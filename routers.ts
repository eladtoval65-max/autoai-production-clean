import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { notifyNewLead } from "./leadNotify";
import { COOKIE_NAME, LEAD_CONSENT_TEXT } from "@shared/const";
import {
  createLead,
  createSearchSession,
  getVehicleCatalogItem,
  getTcoMultiBand,
  listLeadsForAdmin,
  listSavedVehicles,
  listVehicleCatalog,
  removeSavedVehicle,
  saveVehicle,
} from "./db";
import { getSessionCookieOptions } from "./cookies";
import { systemRouter } from "./systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./trpcServer";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  /** Public catalog endpoints power recommendations without exposing database credentials. */
  catalog: router({
    list: publicProcedure
      .input(z.object({
        maxPrice: z.number().int().positive().optional(),
        fuelType: z.string().max(32).optional(),
        bodyType: z.string().max(64).optional(),
        minReliability: z.number().int().min(0).max(100).optional(),
        limit: z.number().int().min(1).max(100).optional(),
        /** Annual km for TCO JOIN (7000 / 15000 / 25000) — defaults to 15000 */
        annualKm: z.number().int().min(1000).max(100000).optional(),
      }).optional())
      .query(({ input }) => listVehicleCatalog(input ?? {})),
    byId: publicProcedure
      .input(z.object({
        id: z.number().int().positive(),
        /** Annual km for TCO JOIN — must be 7000, 15000 or 25000; defaults to 15000 */
        annualKm: z.number().int().min(1000).max(100000).optional(),
      }))
      .query(({ input }) => getVehicleCatalogItem(input.id, input.annualKm)),
  }),

  /**
   * TCO endpoints — total-cost-of-ownership data for the recommendation engine.
   * All figures are estimates; no data is presented as an official binding quote.
   */
  tco: router({
    /**
     * Returns ownership-cost rows for up to 5 trim IDs across all three km bands (7k / 15k / 25k).
     * Used by the Compare panel to render a side-by-side TCO ladder.
     */
    multiBand: publicProcedure
      .input(z.object({
        trimIds: z.array(z.number().int().positive()).min(1).max(5),
      }))
      .query(({ input }) => getTcoMultiBand(input.trimIds)),
  }),

  /** Collect a contact request internally; no third-party forwarding occurs here. */
  leads: router({
    create: publicProcedure
      .input(z.object({
        requestId: z.string().uuid(),
        fullName: z.string().trim().min(2).max(120),
        phone: z.string().trim().regex(/^05\d{8}$/, "מספר נייד ישראלי אינו תקין"),
        city: z.string().trim().max(80).optional(),
        leadType: z.enum(["vehicle", "financing", "insurance", "trade_in", "used_car", "test_drive"]),
        trimId: z.number().int().positive().optional(),
        vehicleLabel: z.string().trim().min(2).max(200),
        matchScore: z.number().int().min(0).max(100).optional(),
        budget: z.number().int().min(0).max(10000000).optional(),
        purchaseTimeline: z.enum(["now", "three_months", "later", "unsure"]),
        sourcePage: z.string().trim().regex(/^[a-z0-9_:-]{2,80}$/),
        utmSource: z.string().trim().max(80).optional(),
        utmMedium: z.string().trim().max(80).optional(),
        utmCampaign: z.string().trim().max(120).optional(),
        landingSlug: z.string().trim().regex(/^[a-z0-9-]{1,60}$/).optional(),
        consent: z.literal(true),
        website: z.string().max(120).default(""), // Spam honeypot; ordinary users never see it.
      }).strict())
      .mutation(async ({ input }) => {
        if (input.website) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid request" });
        if (!/^\S+@\S+\.\S+$/.test(process.env.AUTOAI_CONTACT_EMAIL ?? "")) {
          throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "קליטת פניות עדיין אינה פעילה. נא לפנות לבעל האתר." });
        }
        const { consent: _consent, website: _website, ...details } = input;
        try {
          const id = await createLead({
            ...details,
            trimId: details.trimId ?? null,
            city: details.city || null,
            matchScore: details.matchScore ?? null,
            budget: details.budget ?? null,
            utmSource: details.utmSource || null,
            utmMedium: details.utmMedium || null,
            utmCampaign: details.utmCampaign || null,
            landingSlug: details.landingSlug || null,
            consentText: LEAD_CONSENT_TEXT,
            consentAt: new Date(),
          });
          // Speed-to-lead: email the owner immediately (no-op when RESEND_API_KEY is unset).
          await notifyNewLead({ id: Number(id), ...details, city: details.city || null, budget: details.budget ?? null });
          return { id, status: "received" as const };
        } catch (error) {
          console.error("[Lead] could not save request", error instanceof Error ? error.name : "unknown");
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "לא הצלחנו לשמור את הפנייה. נסו שוב מאוחר יותר." });
        }
      }),
    list: adminProcedure
      .input(z.object({ limit: z.number().int().min(1).max(100).default(50) }).optional())
      .query(({ input }) => listLeadsForAdmin(input?.limit ?? 50)),
  }),

  /** Search history is tied to a signed-in account; anonymous history stays client-side for now. */
  searches: router({
    create: protectedProcedure
      .input(z.object({
        sessionId: z.string().min(8).max(120),
        answers: z.record(z.string(), z.unknown()),
        topMatchTrimId: z.number().int().positive().optional(),
        topMatchScore: z.number().int().min(0).max(100).optional(),
      }))
      .mutation(({ ctx, input }) => createSearchSession({ ...input, userId: ctx.user.id })),
  }),

  saved: router({
    list: protectedProcedure.query(({ ctx }) => listSavedVehicles(ctx.user.id)),
    add: protectedProcedure
      .input(z.object({ trimId: z.number().int().positive(), note: z.string().max(1000).optional() }))
      .mutation(({ ctx, input }) => saveVehicle(ctx.user.id, input.trimId, input.note)),
    remove: protectedProcedure
      .input(z.object({ trimId: z.number().int().positive() }))
      .mutation(({ ctx, input }) => removeSavedVehicle(ctx.user.id, input.trimId)),
  }),
});

export type AppRouter = typeof appRouter;
