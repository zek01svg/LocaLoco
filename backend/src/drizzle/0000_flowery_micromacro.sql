CREATE TABLE `account` (
	`id` varchar(36) NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp(3),
	`refresh_token_expires_at` timestamp(3),
	`scope` text,
	`password` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `business_opening_hours` (
	`id` int AUTO_INCREMENT NOT NULL,
	`uen` varchar(20) NOT NULL,
	`day_of_week` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
	`open_time` time NOT NULL,
	`close_time` time NOT NULL,
	CONSTRAINT `business_opening_hours_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `business_payment_options` (
	`id` int AUTO_INCREMENT NOT NULL,
	`uen` varchar(20) NOT NULL,
	`payment_option` varchar(50) NOT NULL,
	CONSTRAINT `business_payment_options_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `businesses` (
	`uen` varchar(20) NOT NULL,
	`password` varchar(255) NOT NULL,
	`business_name` varchar(255) NOT NULL,
	`business_category` varchar(100),
	`description` text,
	`address` varchar(500),
	`open247` tinyint DEFAULT 0,
	`email` varchar(100),
	`phone_number` varchar(20),
	`website_link` varchar(255),
	`social_media_link` varchar(255),
	`wallpaper` varchar(255),
	`date_of_creation` date,
	`price_tier` enum('low','medium','high'),
	`offers_delivery` tinyint DEFAULT 0,
	`offers_pickup` tinyint DEFAULT 0,
	CONSTRAINT `businesses_uen` PRIMARY KEY(`uen`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `business_opening_hours` ADD CONSTRAINT `business_opening_hours_uen_businesses_uen_fk` FOREIGN KEY (`uen`) REFERENCES `businesses`(`uen`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `business_payment_options` ADD CONSTRAINT `business_payment_options_uen_businesses_uen_fk` FOREIGN KEY (`uen`) REFERENCES `businesses`(`uen`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `uen` ON `business_opening_hours` (`uen`);--> statement-breakpoint
CREATE INDEX `uen` ON `business_payment_options` (`uen`);