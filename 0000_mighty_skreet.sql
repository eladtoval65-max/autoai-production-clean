CREATE TABLE `savedVehicles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`trimId` int NOT NULL,
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `savedVehicles_id` PRIMARY KEY(`id`),
	CONSTRAINT `savedVehicles_user_trim_uidx` UNIQUE(`userId`,`trimId`)
);
--> statement-breakpoint
CREATE TABLE `searchSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`sessionId` varchar(120) NOT NULL,
	`answers` json NOT NULL,
	`topMatchTrimId` int,
	`topMatchScore` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `searchSessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `vehicleFacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trimId` int NOT NULL,
	`sourceId` int,
	`factType` varchar(80) NOT NULL,
	`label` varchar(160) NOT NULL,
	`value` text NOT NULL,
	`numericValue` decimal(12,3),
	`confidence` int NOT NULL DEFAULT 80,
	`verifiedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vehicleFacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicleMakes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`slug` varchar(140) NOT NULL,
	`countryOfOrigin` varchar(80),
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicleMakes_id` PRIMARY KEY(`id`),
	CONSTRAINT `vehicleMakes_slug_uidx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `vehicleModels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`makeId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`slug` varchar(180) NOT NULL,
	`bodyType` varchar(64) NOT NULL,
	`seats` int NOT NULL DEFAULT 5,
	`cargoLiters` int,
	`description` text,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicleModels_id` PRIMARY KEY(`id`),
	CONSTRAINT `vehicleModels_make_slug_uidx` UNIQUE(`makeId`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `vehicleSources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`url` varchar(500),
	`sourceType` varchar(64) NOT NULL,
	`retrievedAt` timestamp NOT NULL DEFAULT (now()),
	`notes` text,
	CONSTRAINT `vehicleSources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicleTrims` (
	`id` int AUTO_INCREMENT NOT NULL,
	`modelId` int NOT NULL,
	`trimName` varchar(160) NOT NULL,
	`yearFrom` int NOT NULL,
	`yearTo` int NOT NULL,
	`fuelType` varchar(32) NOT NULL,
	`transmission` varchar(64),
	`driveType` varchar(32),
	`engineCc` int,
	`powerHp` int,
	`rangeKm` int,
	`combinedConsumption` decimal(6,2),
	`newPrice` int,
	`marketMinPrice` int,
	`marketMaxPrice` int,
	`estimatedMonthlyCost` int,
	`reliabilityScore` int NOT NULL DEFAULT 0,
	`safetyScore` int NOT NULL DEFAULT 0,
	`economyScore` int NOT NULL DEFAULT 0,
	`comfortScore` int NOT NULL DEFAULT 0,
	`practicalityScore` int NOT NULL DEFAULT 0,
	`ownershipNotes` text,
	`pros` json,
	`cons` json,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicleTrims_id` PRIMARY KEY(`id`),
	CONSTRAINT `vehicleTrims_model_year_trim_uidx` UNIQUE(`modelId`,`yearFrom`,`trimName`)
);
--> statement-breakpoint
ALTER TABLE `savedVehicles` ADD CONSTRAINT `savedVehicles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `savedVehicles` ADD CONSTRAINT `savedVehicles_trimId_vehicleTrims_id_fk` FOREIGN KEY (`trimId`) REFERENCES `vehicleTrims`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `searchSessions` ADD CONSTRAINT `searchSessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `searchSessions` ADD CONSTRAINT `searchSessions_topMatchTrimId_vehicleTrims_id_fk` FOREIGN KEY (`topMatchTrimId`) REFERENCES `vehicleTrims`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicleFacts` ADD CONSTRAINT `vehicleFacts_trimId_vehicleTrims_id_fk` FOREIGN KEY (`trimId`) REFERENCES `vehicleTrims`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicleFacts` ADD CONSTRAINT `vehicleFacts_sourceId_vehicleSources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `vehicleSources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicleModels` ADD CONSTRAINT `vehicleModels_makeId_vehicleMakes_id_fk` FOREIGN KEY (`makeId`) REFERENCES `vehicleMakes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicleTrims` ADD CONSTRAINT `vehicleTrims_modelId_vehicleModels_id_fk` FOREIGN KEY (`modelId`) REFERENCES `vehicleModels`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `savedVehicles_user_created_idx` ON `savedVehicles` (`userId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `searchSessions_session_idx` ON `searchSessions` (`sessionId`);--> statement-breakpoint
CREATE INDEX `searchSessions_user_idx` ON `searchSessions` (`userId`);--> statement-breakpoint
CREATE INDEX `searchSessions_created_idx` ON `searchSessions` (`createdAt`);--> statement-breakpoint
CREATE INDEX `vehicleFacts_trim_type_idx` ON `vehicleFacts` (`trimId`,`factType`);--> statement-breakpoint
CREATE INDEX `vehicleFacts_source_idx` ON `vehicleFacts` (`sourceId`);--> statement-breakpoint
CREATE INDEX `vehicleModels_body_type_idx` ON `vehicleModels` (`bodyType`);--> statement-breakpoint
CREATE INDEX `vehicleSources_type_idx` ON `vehicleSources` (`sourceType`);--> statement-breakpoint
CREATE INDEX `vehicleTrims_fuel_idx` ON `vehicleTrims` (`fuelType`);--> statement-breakpoint
CREATE INDEX `vehicleTrims_market_price_idx` ON `vehicleTrims` (`marketMinPrice`,`marketMaxPrice`);--> statement-breakpoint
CREATE INDEX `vehicleTrims_reliability_idx` ON `vehicleTrims` (`reliabilityScore`);