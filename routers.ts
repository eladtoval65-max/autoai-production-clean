import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { notifyNewLead } from "./leadNotify";
import { COOKIE_NAME } from "@shared/const";
import { DUPLICATE_WINDOW_DAYS } from "@shared/leadPolicy";
import { consentRecord, leadRateLimited, qualityScoreOf, requestIp } from "./server/leads/intake";
import {
  createLead,
  createSearchSession,
  findRecentLeadByPhone,
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
        leadType: z.enum(["vehicle", "financing", "insurance", "trade_in", "used_car", "test_drive", "leasing"]),
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
        // Separate, optional consent to be passed to ONE business of the category named in leadPolicy.ts.
        partnerConsent: z.boolean().default(false),
        // Optional details per request type (renewal month, plate, trade-in, financing…), see LeadDetails in leadPolicy.ts.
        details: z.object({
          driverAge: z.number().int().min(17).max(99),
          licenseYears: z.number().int().min(0).max(80),
          claims3y: z.enum(["0", "1", "2+"]),
          carYear: z.number().int().min(1990).max(2030),
          renewalMonth: z.number().int().min(1).max(12),
          plate: z.string().regex(/^\d{7,8}$/),
          carName: z.string().trim().max(80),
          loanAmount: z.number().int().min(1000).max(2000000),
          downPayment: z.number().int().min(0).max(2000000),
          months: z.number().int().min(6).max(120),
          tradeInKm: z.number().int().min(0).max(1000000),
          needsFinancing: z.enum(["yes", "no", "unsure"]),
          hasTradeIn: z.enum(["yes", "no"]),
        }).partial().strict().optional(),
        website: z.string().max(120).default(""), // Spam honeypot; ordinary users never see it.
      }).strict())
      .mutation(async ({ ctx, input }) => {
        if (input.website) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid request" });
        if (leadRateLimited(requestIp(ctx.req))) {
          throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "נשלחו יותר מדי בקשות. נסו שוב בעוד כמה דקות." });
        }
        if (!/^\S+@\S+\.\S+$/.test(process.env.AUTOAI_CONTACT_EMAIL ?? "")) {
          throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "קליטת פניות עדיין אינה פעילה. נא לפנות לבעל האתר." });
        }
        const { consent: _consent, website: _website, partnerConsent, details: extra, ...details } = input;
        const hasDetails = Boolean(extra && Object.keys(extra).length);
        try {
          // A repeat request from the same phone is kept (the customer may want something new) but linked to the first.
          const duplicateOfId = await findRecentLeadByPhone(details.phone, DUPLICATE_WINDOW_DAYS).catch(() => null);
          const qualityScore = qualityScoreOf({ ...details, partnerOptIn: partnerConsent, isDuplicate: duplicateOfId !== null, hasDetails, details: extra ?? null });
          const detailsJson = hasDetails ? JSON.stringify(extra) : null;
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
            ...consentRecord(details.leadType, partnerConsent, ctx.req),
            duplicateOfId,
            details: detailsJson,
            qualityScore,
          });
          // Speed-to-lead: email the owner immediately (no-op when RESEND_API_KEY is unset).
          await notifyNewLead({ id: Number(id), ...details, city: details.city || null, budget: details.budget ?? null, details: detailsJson, qualityScore });
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
