import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("vehicle catalog API", () => {
  it("returns a list for valid public catalog filters", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.catalog.list({ limit: 5, maxPrice: 150000 });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeLessThanOrEqual(5);
  });

  it("returns provenance metadata instead of hiding estimates as live prices", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.catalog.list({ limit: 1 });
    const first = result[0];

    expect(first?.officialRegisteredCount).toBeGreaterThan(0);
    expect(first?.marketSnapshotIsOfficial).toBe(false);
    expect(first?.marketSnapshotDisclaimer).toContain("not a live quote");
    expect(first?.dataStatus).toBe("estimated");
    expect(first?.dataConfidence).toBeGreaterThan(0);
    expect(first?.primarySourceName).toBeTruthy();
    expect(first?.lastVerifiedAt).toBeInstanceOf(Date);
  });

  it("rejects an invalid vehicle id before querying the database", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(caller.catalog.byId({ id: 0 })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });

  it("requires authentication for saved vehicles", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(caller.saved.list()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});
