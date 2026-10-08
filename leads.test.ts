import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LEAD_CONSENT_TEXT } from "@shared/const";
import type { TrpcContext } from "./_core/context";

vi.mock("./db", async importOriginal => {
  const original = await importOriginal<typeof import("./db")>();
  return { ...original, createLead: vi.fn(), listLeadsForAdmin: vi.fn() };
});
import { createLead, listLeadsForAdmin } from "./db";
import { appRouter } from "./routers";

const publicCtx = { user: null, req: { headers: {} }, res: {} } as TrpcContext;
const validInput = {
  requestId: "9d59aa36-067d-4c51-bd5f-56eb1593385a",
  fullName: "ישראל ישראלי",
  phone: "0501234567",
  city: "תל אביב",
  leadType: "vehicle" as const,
  trimId: 1,
  vehicleLabel: "Toyota Corolla 2022",
  matchScore: 87,
  budget: 100000,
  purchaseTimeline: "three_months" as const,
  sourcePage: "recommendations" as const,
  consent: true as const,
  website: "",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("AUTOAI_CONTACT_EMAIL", "operator@example.test");
});
afterEach(() => vi.unstubAllEnvs());

describe("lead request API", () => {
  it("saves a consented request with a server timestamp and exact consent text", async () => {
    vi.mocked(createLead).mockResolvedValue(42);
    const response = await appRouter.createCaller(publicCtx).leads.create(validInput);
    expect(response).toEqual({ id: 42, status: "received" });
    expect(createLead).toHaveBeenCalledWith(expect.objectContaining({
      fullName: validInput.fullName, phone: validInput.phone,
      consentText: LEAD_CONSENT_TEXT, consentAt: expect.any(Date),
    }));
    expect(response).not.toHaveProperty("phone");
  });

  it("rejects missing consent, invalid phone and bot honeypot", async () => {
    const caller = appRouter.createCaller(publicCtx);
    await expect(caller.leads.create({ ...validInput, consent: false as true })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.leads.create({ ...validInput, phone: "123" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.leads.create({ ...validInput, website: "spam.example" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(createLead).not.toHaveBeenCalled();
  });

  it("does not collect personal data when no operator contact is configured", async () => {
    vi.stubEnv("AUTOAI_CONTACT_EMAIL", "");
    await expect(appRouter.createCaller(publicCtx).leads.create(validInput)).rejects.toMatchObject({ code: "SERVICE_UNAVAILABLE" });
    expect(createLead).not.toHaveBeenCalled();
  });

  it("never exposes lead data via the unauthenticated or ordinary-user list", async () => {
    await expect(appRouter.createCaller(publicCtx).leads.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
    const userCtx = { ...publicCtx, user: { id: 1, role: "user" } } as TrpcContext;
    await expect(appRouter.createCaller(userCtx).leads.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(listLeadsForAdmin).not.toHaveBeenCalled();
  });

  it("allows the server-verified administrator to list internal leads", async () => {
    vi.mocked(listLeadsForAdmin).mockResolvedValue([]);
    const adminCtx = { ...publicCtx, user: { id: 2, role: "admin" } } as TrpcContext;
    expect(await appRouter.createCaller(adminCtx).leads.list({ limit: 10 })).toEqual([]);
    expect(listLeadsForAdmin).toHaveBeenCalledWith(10);
  });
});
