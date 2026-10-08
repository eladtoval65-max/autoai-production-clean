ALTER TABLE `vehicleTrims` ADD `dataStatus` varchar(32) DEFAULT 'estimated' NOT NULL;--> statement-breakpoint
ALTER TABLE `vehicleTrims` ADD `dataConfidence` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `vehicleTrims` ADD `primarySourceId` int;--> statement-breakpoint
ALTER TABLE `vehicleTrims` ADD `lastVerifiedAt` timestamp;--> statement-breakpoint
ALTER TABLE `vehicleTrims` ADD CONSTRAINT `vehicleTrims_primarySourceId_vehicleSources_id_fk` FOREIGN KEY (`primarySourceId`) REFERENCES `vehicleSources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `vehicleTrims_quality_idx` ON `vehicleTrims` (`dataStatus`,`dataConfidence`);