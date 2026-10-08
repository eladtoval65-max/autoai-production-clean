import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME, LEAD_CONSENT_TEXT } from "@shared/const";
import {
  createLead,
  createSearchSession,
  getVehicleCatalogItem,
  listLeadsForAdmin,
  listSavedVehicles,
  listVehicleCatalog,
  removeSavedVehicle,
  saveVehicle,
} from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";

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
      }).optional())
      .query(({ input }) => listVehicleCatalog(input ?? {})),
    byId: publicProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .query(({ input }) => getVehicleCatalogItem(input.id)),
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
        sourcePage: z.enum(["recommendations", "vehicle_details", "comparison"]),
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
            consentText: LEAD_CONSENT_TEXT,
            consentAt: new Date(),
          });
          return { id, status: "received" as const };
        } catch (error) {
          console.error("[Lead] could not save request", error);
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
