import { and, asc, desc, eq, gte, lte, type SQL } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  leads,
  savedVehicles,
  searchSessions,
  users,
  vehicleMakes,
  vehicleModels,
  insuranceEstimates,
  ownershipCosts,
  vehicleSources,
  vehicleTrims,
  vehicleMarketSnapshots,
  vehicleRegistrySnapshots,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the Drizzle instance so local tooling can run without a database.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];

  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };

  textFields.forEach(assignNullable);

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  values.lastSignedIn ??= new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export type CatalogFilters = {
  maxPrice?: number;
  fuelType?: string;
  bodyType?: string;
  minReliability?: number;
  limit?: number;
};

/** Returns the public vehicle catalog as a flat, recommendation-friendly shape. */
export async function listVehicleCatalog(filters: CatalogFilters = {}) {
  const db = await getDb();
  if (!db) return [];

  const conditions: SQL[] = [
    eq(vehicleMakes.active, true),
    eq(vehicleModels.active, true),
    eq(vehicleTrims.active, true),
  ];
  if (filters.maxPrice !== undefined) {
    conditions.push(lte(vehicleTrims.marketMinPrice, filters.maxPrice));
  }
  if (filters.fuelType && filters.fuelType !== "any") {
    conditions.push(eq(vehicleTrims.fuelType, filters.fuelType));
  }
  if (filters.bodyType) {
    conditions.push(eq(vehicleModels.bodyType, filters.bodyType));
  }
  if (filters.minReliability !== undefined) {
    conditions.push(gte(vehicleTrims.reliabilityScore, filters.minReliability));
  }

  return db
    .select({
      id: vehicleTrims.id,
      make: vehicleMakes.name,
      model: vehicleModels.name,
      trimName: vehicleTrims.trimName,
      yearFrom: vehicleTrims.yearFrom,
      yearTo: vehicleTrims.yearTo,
      bodyType: vehicleModels.bodyType,
      fuelType: vehicleTrims.fuelType,
      marketMinPrice: vehicleTrims.marketMinPrice,
      marketMaxPrice: vehicleTrims.marketMaxPrice,
      estimatedMonthlyCost: vehicleTrims.estimatedMonthlyCost,
      reliabilityScore: vehicleTrims.reliabilityScore,
      safetyScore: vehicleTrims.safetyScore,
      economyScore: vehicleTrims.economyScore,
      comfortScore: vehicleTrims.comfortScore,
      practicalityScore: vehicleTrims.practicalityScore,
      pros: vehicleTrims.pros,
      cons: vehicleTrims.cons,
      ownershipNotes: vehicleTrims.ownershipNotes,
      dataStatus: vehicleTrims.dataStatus,
      dataConfidence: vehicleTrims.dataConfidence,
      lastVerifiedAt: vehicleTrims.lastVerifiedAt,
      primarySourceName: vehicleSources.name,
      primarySourceUrl: vehicleSources.url,
      primarySourceRetrievedAt: vehicleSources.retrievedAt,
      insuranceMonthlyMin: insuranceEstimates.monthlyMin,
      insuranceMonthlyMax: insuranceEstimates.monthlyMax,
      ownershipCostMonthly: ownershipCosts.totalMonthly,
      ownershipCostIsEstimate: ownershipCosts.isEstimate,
      marketSnapshotMin: vehicleMarketSnapshots.priceMin,
      marketSnapshotMedian: vehicleMarketSnapshots.priceMedian,
      marketSnapshotMax: vehicleMarketSnapshots.priceMax,
      marketSnapshotSampleSize: vehicleMarketSnapshots.sampleSize,
      marketSnapshotObservedAt: vehicleMarketSnapshots.observedAt,
      marketSnapshotIsOfficial: vehicleMarketSnapshots.isOfficial,
      marketSnapshotDisclaimer: vehicleMarketSnapshots.disclaimer,
      officialRegisteredCount: vehicleRegistrySnapshots.registeredCount,
      officialRegistryCommercialName: vehicleRegistrySnapshots.commercialName,
      officialRegistryAsOf: vehicleRegistrySnapshots.asOfDate,
      officialRegistryNotes: vehicleRegistrySnapshots.notes,
    })
    .from(vehicleTrims)
    .innerJoin(vehicleModels, eq(vehicleTrims.modelId, vehicleModels.id))
    .innerJoin(vehicleMakes, eq(vehicleModels.makeId, vehicleMakes.id))
    .leftJoin(vehicleSources, eq(vehicleTrims.primarySourceId, vehicleSources.id))
    .leftJoin(insuranceEstimates, and(eq(insuranceEstimates.trimId, vehicleTrims.id), eq(insuranceEstimates.coverageType, "comprehensive")))
    .leftJoin(ownershipCosts, and(eq(ownershipCosts.trimId, vehicleTrims.id), eq(ownershipCosts.annualKm, 15000)))
    .leftJoin(vehicleMarketSnapshots, eq(vehicleMarketSnapshots.trimId, vehicleTrims.id))
    .leftJoin(vehicleRegistrySnapshots, and(eq(vehicleRegistrySnapshots.trimId, vehicleTrims.id), eq(vehicleRegistrySnapshots.productionYear, vehicleTrims.yearFrom)))
    .where(and(...conditions))
    .orderBy(desc(vehicleTrims.reliabilityScore), asc(vehicleTrims.marketMinPrice))
    .limit(Math.min(Math.max(filters.limit ?? 50, 1), 100));
}

export async function getVehicleCatalogItem(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select({
      id: vehicleTrims.id,
      make: vehicleMakes.name,
      model: vehicleModels.name,
      trimName: vehicleTrims.trimName,
      yearFrom: vehicleTrims.yearFrom,
      yearTo: vehicleTrims.yearTo,
      bodyType: vehicleModels.bodyType,
      seats: vehicleModels.seats,
      cargoLiters: vehicleModels.cargoLiters,
      fuelType: vehicleTrims.fuelType,
      transmission: vehicleTrims.transmission,
      driveType: vehicleTrims.driveType,
      engineCc: vehicleTrims.engineCc,
      powerHp: vehicleTrims.powerHp,
      rangeKm: vehicleTrims.rangeKm,
      combinedConsumption: vehicleTrims.combinedConsumption,
      newPrice: vehicleTrims.newPrice,
      marketMinPrice: vehicleTrims.marketMinPrice,
      marketMaxPrice: vehicleTrims.marketMaxPrice,
      estimatedMonthlyCost: vehicleTrims.estimatedMonthlyCost,
      reliabilityScore: vehicleTrims.reliabilityScore,
      safetyScore: vehicleTrims.safetyScore,
      economyScore: vehicleTrims.economyScore,
      comfortScore: vehicleTrims.comfortScore,
      practicalityScore: vehicleTrims.practicalityScore,
      ownershipNotes: vehicleTrims.ownershipNotes,
      pros: vehicleTrims.pros,
      cons: vehicleTrims.cons,
      dataStatus: vehicleTrims.dataStatus,
      dataConfidence: vehicleTrims.dataConfidence,
      lastVerifiedAt: vehicleTrims.lastVerifiedAt,
      primarySourceName: vehicleSources.name,
      primarySourceUrl: vehicleSources.url,
      primarySourceRetrievedAt: vehicleSources.retrievedAt,
      insuranceMonthlyMin: insuranceEstimates.monthlyMin,
      insuranceMonthlyMax: insuranceEstimates.monthlyMax,
      ownershipCostMonthly: ownershipCosts.totalMonthly,
      ownershipCostIsEstimate: ownershipCosts.isEstimate,
      marketSnapshotMin: vehicleMarketSnapshots.priceMin,
      marketSnapshotMedian: vehicleMarketSnapshots.priceMedian,
      marketSnapshotMax: vehicleMarketSnapshots.priceMax,
      marketSnapshotSampleSize: vehicleMarketSnapshots.sampleSize,
      marketSnapshotObservedAt: vehicleMarketSnapshots.observedAt,
      marketSnapshotIsOfficial: vehicleMarketSnapshots.isOfficial,
      marketSnapshotDisclaimer: vehicleMarketSnapshots.disclaimer,
      officialRegisteredCount: vehicleRegistrySnapshots.registeredCount,
      officialRegistryCommercialName: vehicleRegistrySnapshots.commercialName,
      officialRegistryAsOf: vehicleRegistrySnapshots.asOfDate,
      officialRegistryNotes: vehicleRegistrySnapshots.notes,
    })
    .from(vehicleTrims)
    .innerJoin(vehicleModels, eq(vehicleTrims.modelId, vehicleModels.id))
    .innerJoin(vehicleMakes, eq(vehicleModels.makeId, vehicleMakes.id))
    .leftJoin(vehicleSources, eq(vehicleTrims.primarySourceId, vehicleSources.id))
    .leftJoin(insuranceEstimates, and(eq(insuranceEstimates.trimId, vehicleTrims.id), eq(insuranceEstimates.coverageType, "comprehensive")))
    .leftJoin(ownershipCosts, and(eq(ownershipCosts.trimId, vehicleTrims.id), eq(ownershipCosts.annualKm, 15000)))
    .leftJoin(vehicleMarketSnapshots, eq(vehicleMarketSnapshots.trimId, vehicleTrims.id))
    .leftJoin(vehicleRegistrySnapshots, and(eq(vehicleRegistrySnapshots.trimId, vehicleTrims.id), eq(vehicleRegistrySnapshots.productionYear, vehicleTrims.yearFrom)))
    .where(and(eq(vehicleTrims.id, id), eq(vehicleTrims.active, true)))
    .limit(1);

  return result[0];
}

export async function createSearchSession(input: {
  userId?: number;
  sessionId: string;
  answers: Record<string, unknown>;
  topMatchTrimId?: number;
  topMatchScore?: number;
}) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(searchSessions).values(input);
  return result[0]?.insertId;
}

export async function listSavedVehicles(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: savedVehicles.id,
      trimId: vehicleTrims.id,
      make: vehicleMakes.name,
      model: vehicleModels.name,
      trimName: vehicleTrims.trimName,
      yearFrom: vehicleTrims.yearFrom,
      yearTo: vehicleTrims.yearTo,
      marketMinPrice: vehicleTrims.marketMinPrice,
      marketMaxPrice: vehicleTrims.marketMaxPrice,
      createdAt: savedVehicles.createdAt,
    })
    .from(savedVehicles)
    .innerJoin(vehicleTrims, eq(savedVehicles.trimId, vehicleTrims.id))
    .innerJoin(vehicleModels, eq(vehicleTrims.modelId, vehicleModels.id))
    .innerJoin(vehicleMakes, eq(vehicleModels.makeId, vehicleMakes.id))
    .where(eq(savedVehicles.userId, userId))
    .orderBy(desc(savedVehicles.createdAt));
}

export async function saveVehicle(userId: number, trimId: number, note?: string) {
  const db = await getDb();
  if (!db) return undefined;
  await db.insert(savedVehicles).values({ userId, trimId, note }).onDuplicateKeyUpdate({ set: { note } });
  return true;
}

export async function removeSavedVehicle(userId: number, trimId: number) {
  const db = await getDb();
  if (!db) return undefined;
  await db.delete(savedVehicles).where(and(eq(savedVehicles.userId, userId), eq(savedVehicles.trimId, trimId)));
  return true;
}

export type NewLead = typeof leads.$inferInsert;

export async function createLead(input: Omit<NewLead, "id" | "status" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  // A client retries with the same UUID; never insert the same consent twice.
  const existing = await db.select({ id: leads.id }).from(leads).where(eq(leads.requestId, input.requestId)).limit(1);
  if (existing[0]) return existing[0].id;
  const result = await db.insert(leads).values(input);
  return result[0].insertId;
}

export async function listLeadsForAdmin(limit = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  return db.select().from(leads).orderBy(desc(leads.createdAt)).limit(Math.min(Math.max(limit, 1), 100));
}

// Kept imported during the first catalog phase so the source table is part of the typed DB surface.
export { vehicleSources };
