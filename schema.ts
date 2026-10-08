import {
  boolean,
  decimal,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing Manus OAuth.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** A source used to document where a vehicle fact came from and when it was checked. */
export const vehicleSources = mysqlTable(
  "vehicleSources",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    url: varchar("url", { length: 500 }),
    sourceType: varchar("sourceType", { length: 64 }).notNull(),
    retrievedAt: timestamp("retrievedAt").defaultNow().notNull(),
    notes: text("notes"),
  },
  (table) => [index("vehicleSources_type_idx").on(table.sourceType)],
);

/** Manufacturer-level data. */
export const vehicleMakes = mysqlTable(
  "vehicleMakes",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 140 }).notNull(),
    countryOfOrigin: varchar("countryOfOrigin", { length: 80 }),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [uniqueIndex("vehicleMakes_slug_uidx").on(table.slug)],
);

export type VehicleMake = typeof vehicleMakes.$inferSelect;

/** Model-level facts shared by multiple model years and trims. */
export const vehicleModels = mysqlTable(
  "vehicleModels",
  {
    id: int("id").autoincrement().primaryKey(),
    makeId: int("makeId").notNull().references(() => vehicleMakes.id),
    name: varchar("name", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),
    bodyType: varchar("bodyType", { length: 64 }).notNull(),
    seats: int("seats").notNull().default(5),
    cargoLiters: int("cargoLiters"),
    description: text("description"),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("vehicleModels_make_slug_uidx").on(table.makeId, table.slug),
    index("vehicleModels_body_type_idx").on(table.bodyType),
  ],
);

export type VehicleModel = typeof vehicleModels.$inferSelect;

/** A concrete year/trim used by the recommendation engine. Prices are stored in ILS. */
export const vehicleTrims = mysqlTable(
  "vehicleTrims",
  {
    id: int("id").autoincrement().primaryKey(),
    modelId: int("modelId").notNull().references(() => vehicleModels.id),
    trimName: varchar("trimName", { length: 160 }).notNull(),
    yearFrom: int("yearFrom").notNull(),
    yearTo: int("yearTo").notNull(),
    fuelType: varchar("fuelType", { length: 32 }).notNull(),
    transmission: varchar("transmission", { length: 64 }),
    driveType: varchar("driveType", { length: 32 }),
    engineCc: int("engineCc"),
    powerHp: int("powerHp"),
    rangeKm: int("rangeKm"),
    combinedConsumption: decimal("combinedConsumption", { precision: 6, scale: 2 }),
    newPrice: int("newPrice"),
    marketMinPrice: int("marketMinPrice"),
    marketMaxPrice: int("marketMaxPrice"),
    estimatedMonthlyCost: int("estimatedMonthlyCost"),
    reliabilityScore: int("reliabilityScore").notNull().default(0),
    safetyScore: int("safetyScore").notNull().default(0),
    economyScore: int("economyScore").notNull().default(0),
    comfortScore: int("comfortScore").notNull().default(0),
    practicalityScore: int("practicalityScore").notNull().default(0),
    ownershipNotes: text("ownershipNotes"),
    pros: json("pros").$type<string[]>(),
    cons: json("cons").$type<string[]>(),
    dataStatus: varchar("dataStatus", { length: 32 }).notNull().default("estimated"),
    dataConfidence: int("dataConfidence").notNull().default(0),
    primarySourceId: int("primarySourceId").references(() => vehicleSources.id),
    lastVerifiedAt: timestamp("lastVerifiedAt"),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("vehicleTrims_model_year_trim_uidx").on(table.modelId, table.yearFrom, table.trimName),
    index("vehicleTrims_fuel_idx").on(table.fuelType),
    index("vehicleTrims_market_price_idx").on(table.marketMinPrice, table.marketMaxPrice),
    index("vehicleTrims_reliability_idx").on(table.reliabilityScore),
    index("vehicleTrims_quality_idx").on(table.dataStatus, table.dataConfidence),
  ],
);

export type VehicleTrim = typeof vehicleTrims.$inferSelect;
export type InsertVehicleTrim = typeof vehicleTrims.$inferInsert;

/** Flexible, source-backed facts for details we will add over time without changing the core model. */
export const vehicleFacts = mysqlTable(
  "vehicleFacts",
  {
    id: int("id").autoincrement().primaryKey(),
    trimId: int("trimId").notNull().references(() => vehicleTrims.id),
    sourceId: int("sourceId").references(() => vehicleSources.id),
    factType: varchar("factType", { length: 80 }).notNull(),
    label: varchar("label", { length: 160 }).notNull(),
    value: text("value").notNull(),
    numericValue: decimal("numericValue", { precision: 12, scale: 3 }),
    confidence: int("confidence").notNull().default(80),
    verifiedAt: timestamp("verifiedAt").defaultNow().notNull(),
  },
  (table) => [
    index("vehicleFacts_trim_type_idx").on(table.trimId, table.factType),
    index("vehicleFacts_source_idx").on(table.sourceId),
  ],
);

export type VehicleFact = typeof vehicleFacts.$inferSelect;

/** A persisted questionnaire run. sessionId keeps anonymous users useful before login. */
export const searchSessions = mysqlTable(
  "searchSessions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").references(() => users.id),
    sessionId: varchar("sessionId", { length: 120 }).notNull(),
    answers: json("answers").$type<Record<string, unknown>>().notNull(),
    topMatchTrimId: int("topMatchTrimId").references(() => vehicleTrims.id),
    topMatchScore: int("topMatchScore"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("searchSessions_session_idx").on(table.sessionId),
    index("searchSessions_user_idx").on(table.userId),
    index("searchSessions_created_idx").on(table.createdAt),
  ],
);

export type SearchSession = typeof searchSessions.$inferSelect;

/** Saved vehicles are available to signed-in users; anonymous save state remains client-side. */
export const savedVehicles = mysqlTable(
  "savedVehicles",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id),
    trimId: int("trimId").notNull().references(() => vehicleTrims.id),
    note: text("note"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("savedVehicles_user_trim_uidx").on(table.userId, table.trimId),
    index("savedVehicles_user_created_idx").on(table.userId, table.createdAt),
  ],
);

export type SavedVehicle = typeof savedVehicles.$inferSelect;

/** Indicative insurance ranges; never an insurer quote. */
export const insuranceEstimates = mysqlTable(
  "insuranceEstimates",
  {
    id: int("id").autoincrement().primaryKey(),
    trimId: int("trimId").notNull().references(() => vehicleTrims.id),
    coverageType: varchar("coverageType", { length: 48 }).notNull(),
    driverProfile: varchar("driverProfile", { length: 120 }).notNull(),
    monthlyMin: int("monthlyMin").notNull(),
    monthlyMax: int("monthlyMax").notNull(),
    deductibleEstimate: int("deductibleEstimate"),
    sourceId: int("sourceId").references(() => vehicleSources.id),
    disclaimer: text("disclaimer").notNull(),
    verifiedAt: timestamp("verifiedAt").defaultNow().notNull(),
  },
  (table) => [
    index("insuranceEstimates_trim_idx").on(table.trimId),
    index("insuranceEstimates_coverage_idx").on(table.coverageType),
  ],
);

export type InsuranceEstimate = typeof insuranceEstimates.$inferSelect;
export type InsertInsuranceEstimate = typeof insuranceEstimates.$inferInsert;

/** Transparent monthly ownership components used by the Analysis screen. */
export const ownershipCosts = mysqlTable(
  "ownershipCosts",
  {
    id: int("id").autoincrement().primaryKey(),
    trimId: int("trimId").notNull().references(() => vehicleTrims.id),
    annualKm: int("annualKm").notNull(),
    financingMonthly: int("financingMonthly").notNull().default(0),
    fuelMonthly: int("fuelMonthly").notNull().default(0),
    insuranceMonthly: int("insuranceMonthly").notNull().default(0),
    maintenanceMonthly: int("maintenanceMonthly").notNull().default(0),
    depreciationMonthly: int("depreciationMonthly").notNull().default(0),
    totalMonthly: int("totalMonthly").notNull().default(0),
    isEstimate: boolean("isEstimate").notNull().default(true),
    sourceId: int("sourceId").references(() => vehicleSources.id),
    verifiedAt: timestamp("verifiedAt").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("ownershipCosts_trim_km_uidx").on(table.trimId, table.annualKm),
    index("ownershipCosts_total_idx").on(table.totalMonthly),
  ],
);

export type OwnershipCost = typeof ownershipCosts.$inferSelect;
export type InsertOwnershipCost = typeof ownershipCosts.$inferInsert;

/** Official registry coverage signal for a model/year, sourced from the Ministry of Transport. */
export const vehicleRegistrySnapshots = mysqlTable(
  "vehicleRegistrySnapshots",
  {
    id: int("id").autoincrement().primaryKey(),
    trimId: int("trimId").notNull().references(() => vehicleTrims.id),
    sourceId: int("sourceId").notNull().references(() => vehicleSources.id),
    productionYear: int("productionYear").notNull(),
    commercialName: varchar("commercialName", { length: 160 }).notNull(),
    fuelType: varchar("fuelType", { length: 64 }),
    registeredCount: int("registeredCount").notNull().default(0),
    asOfDate: timestamp("asOfDate").notNull(),
    notes: text("notes"),
  },
  (table) => [
    uniqueIndex("vehicleRegistrySnapshots_trim_source_year_uidx").on(table.trimId, table.sourceId, table.productionYear),
    index("vehicleRegistrySnapshots_model_year_idx").on(table.commercialName, table.productionYear),
  ],
);

export type VehicleRegistrySnapshot = typeof vehicleRegistrySnapshots.$inferSelect;

/** Point-in-time market-price observations. A snapshot is never presented as a live quote. */
export const vehicleMarketSnapshots = mysqlTable(
  "vehicleMarketSnapshots",
  {
    id: int("id").autoincrement().primaryKey(),
    trimId: int("trimId").notNull().references(() => vehicleTrims.id),
    sourceId: int("sourceId").notNull().references(() => vehicleSources.id),
    priceMin: int("priceMin").notNull(),
    priceMedian: int("priceMedian"),
    priceMax: int("priceMax").notNull(),
    sampleSize: int("sampleSize"),
    observedAt: timestamp("observedAt").notNull(),
    isOfficial: boolean("isOfficial").notNull().default(false),
    disclaimer: text("disclaimer").notNull(),
  },
  (table) => [
    index("vehicleMarketSnapshots_trim_date_idx").on(table.trimId, table.observedAt),
    index("vehicleMarketSnapshots_source_idx").on(table.sourceId),
  ],
);

export type VehicleMarketSnapshot = typeof vehicleMarketSnapshots.$inferSelect;

/** Internal-only contact requests. No partner delivery happens when a row is created. */
export const leads = mysqlTable(
  "leads",
  {
    id: int("id").autoincrement().primaryKey(),
    requestId: varchar("requestId", { length: 36 }).notNull(),
    fullName: varchar("fullName", { length: 120 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    city: varchar("city", { length: 80 }),
    leadType: mysqlEnum("leadType", ["vehicle", "financing", "insurance", "trade_in", "used_car", "test_drive"]).notNull(),
    trimId: int("trimId").references(() => vehicleTrims.id),
    vehicleLabel: varchar("vehicleLabel", { length: 200 }).notNull(),
    matchScore: int("matchScore"),
    budget: int("budget"),
    purchaseTimeline: mysqlEnum("purchaseTimeline", ["now", "three_months", "later", "unsure"]).notNull().default("unsure"),
    sourcePage: varchar("sourcePage", { length: 80 }).notNull().default("recommendations"),
    consentText: text("consentText").notNull(),
    consentAt: timestamp("consentAt").notNull(),
    status: mysqlEnum("status", ["new", "contacted", "qualified", "closed"]).notNull().default("new"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
  },
  table => [
    uniqueIndex("leads_request_uidx").on(table.requestId),
    index("leads_phone_created_idx").on(table.phone, table.createdAt),
    index("leads_status_created_idx").on(table.status, table.createdAt),
  ],
);

export type Lead = typeof leads.$inferSelect;
