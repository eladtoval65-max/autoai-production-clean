CREATE TABLE `vehicleMarketSnapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trimId` int NOT NULL,
	`sourceId` int NOT NULL,
	`priceMin` int NOT NULL,
	`priceMedian` int,
	`priceMax` int NOT NULL,
	`sampleSize` int,
	`observedAt` timestamp NOT NULL,
	`isOfficial` boolean NOT NULL DEFAULT false,
	`disclaimer` text NOT NULL,
	CONSTRAINT `vehicleMarketSnapshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicleRegistrySnapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trimId` int NOT NULL,
	`sourceId` int NOT NULL,
	`productionYear` int NOT NULL,
	`commercialName` varchar(160) NOT NULL,
	`fuelType` varchar(64),
	`registeredCount` int NOT NULL DEFAULT 0,
	`asOfDate` timestamp NOT NULL,
	`notes` text,
	CONSTRAINT `vehicleRegistrySnapshots_id` PRIMARY KEY(`id`),
	CONSTRAINT `vehicleRegistrySnapshots_trim_source_year_uidx` UNIQUE(`trimId`,`sourceId`,`productionYear`)
);
--> statement-breakpoint
ALTER TABLE `vehicleMarketSnapshots` ADD CONSTRAINT `vehicleMarketSnapshots_trimId_vehicleTrims_id_fk` FOREIGN KEY (`trimId`) REFERENCES `vehicleTrims`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicleMarketSnapshots` ADD CONSTRAINT `vehicleMarketSnapshots_sourceId_vehicleSources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `vehicleSources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicleRegistrySnapshots` ADD CONSTRAINT `vehicleRegistrySnapshots_trimId_vehicleTrims_id_fk` FOREIGN KEY (`trimId`) REFERENCES `vehicleTrims`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicleRegistrySnapshots` ADD CONSTRAINT `vehicleRegistrySnapshots_sourceId_vehicleSources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `vehicleSources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `vehicleMarketSnapshots_trim_date_idx` ON `vehicleMarketSnapshots` (`trimId`,`observedAt`);--> statement-breakpoint
CREATE INDEX `vehicleMarketSnapshots_source_idx` ON `vehicleMarketSnapshots` (`sourceId`);--> statement-breakpoint
CREATE INDEX `vehicleRegistrySnapshots_model_year_idx` ON `vehicleRegistrySnapshots` (`commercialName`,`productionYear`);