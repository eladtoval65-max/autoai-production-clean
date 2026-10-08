CREATE TABLE `insuranceEstimates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trimId` int NOT NULL,
	`coverageType` varchar(48) NOT NULL,
	`driverProfile` varchar(120) NOT NULL,
	`monthlyMin` int NOT NULL,
	`monthlyMax` int NOT NULL,
	`deductibleEstimate` int,
	`sourceId` int,
	`disclaimer` text NOT NULL,
	`verifiedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `insuranceEstimates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ownershipCosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trimId` int NOT NULL,
	`annualKm` int NOT NULL,
	`financingMonthly` int NOT NULL DEFAULT 0,
	`fuelMonthly` int NOT NULL DEFAULT 0,
	`insuranceMonthly` int NOT NULL DEFAULT 0,
	`maintenanceMonthly` int NOT NULL DEFAULT 0,
	`depreciationMonthly` int NOT NULL DEFAULT 0,
	`totalMonthly` int NOT NULL DEFAULT 0,
	`isEstimate` boolean NOT NULL DEFAULT true,
	`sourceId` int,
	`verifiedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ownershipCosts_id` PRIMARY KEY(`id`),
	CONSTRAINT `ownershipCosts_trim_km_uidx` UNIQUE(`trimId`,`annualKm`)
);
--> statement-breakpoint
ALTER TABLE `insuranceEstimates` ADD CONSTRAINT `insuranceEstimates_trimId_vehicleTrims_id_fk` FOREIGN KEY (`trimId`) REFERENCES `vehicleTrims`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `insuranceEstimates` ADD CONSTRAINT `insuranceEstimates_sourceId_vehicleSources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `vehicleSources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ownershipCosts` ADD CONSTRAINT `ownershipCosts_trimId_vehicleTrims_id_fk` FOREIGN KEY (`trimId`) REFERENCES `vehicleTrims`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ownershipCosts` ADD CONSTRAINT `ownershipCosts_sourceId_vehicleSources_id_fk` FOREIGN KEY (`sourceId`) REFERENCES `vehicleSources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `insuranceEstimates_trim_idx` ON `insuranceEstimates` (`trimId`);--> statement-breakpoint
CREATE INDEX `insuranceEstimates_coverage_idx` ON `insuranceEstimates` (`coverageType`);--> statement-breakpoint
CREATE INDEX `ownershipCosts_total_idx` ON `ownershipCosts` (`totalMonthly`);