CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestId` varchar(36) NOT NULL,
	`fullName` varchar(120) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`city` varchar(80),
	`leadType` enum('vehicle','financing','insurance','trade_in','used_car','test_drive') NOT NULL,
	`trimId` int,
	`vehicleLabel` varchar(200) NOT NULL,
	`matchScore` int,
	`budget` int,
	`purchaseTimeline` enum('now','three_months','later','unsure') NOT NULL DEFAULT 'unsure',
	`sourcePage` varchar(80) NOT NULL DEFAULT 'recommendations',
	`consentText` text NOT NULL,
	`consentAt` timestamp NOT NULL,
	`status` enum('new','contacted','qualified','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`),
	CONSTRAINT `leads_request_uidx` UNIQUE(`requestId`)
);
--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `leads_trimId_vehicleTrims_id_fk` FOREIGN KEY (`trimId`) REFERENCES `vehicleTrims`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `leads_phone_created_idx` ON `leads` (`phone`,`createdAt`);--> statement-breakpoint
CREATE INDEX `leads_status_created_idx` ON `leads` (`status`,`createdAt`);