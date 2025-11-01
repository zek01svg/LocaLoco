-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
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
CREATE TABLE `business_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_email` varchar(255) NOT NULL,
	`business_uen` varchar(20),
	`rating` int NOT NULL,
	`body` text NOT NULL,
	`like_count` int DEFAULT 0,
	`created_at` timestamp,
	CONSTRAINT `business_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `businesses` (
	`owner_id` varchar(255) NOT NULL,
	`uen` varchar(20) NOT NULL,
	`business_name` varchar(255) NOT NULL,
	`business_category` varchar(100),
	`description` text,
	`address` varchar(500),
	`latitude` decimal(9,6),
	`longitude` decimal(9,6),
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
CREATE TABLE `forum_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_email` varchar(255) NOT NULL,
	`business_uen` varchar(20),
	`title` varchar(255),
	`body` text NOT NULL,
	`like_count` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `forum_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `forum_posts_replies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`post_id` int NOT NULL,
	`user_email` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`like_count` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `forum_posts_replies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrer_user_id` varchar(36) NOT NULL,
	`referred_user_id` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`)
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
	`email_verified` tinyint(1) NOT NULL DEFAULT 0,
	`image` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	`has_business` tinyint(1),
	`referral_code` text,
	`referred_by_user_id` text,
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
CREATE TABLE `vouchers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrer_user_id` varchar(36) NOT NULL,
	`referred_user_id` varchar(36) NOT NULL,
	`referral_code` varchar(10) NOT NULL,
	`amount` int NOT NULL,
	`status` enum('issued','redeemed','expired') DEFAULT 'issued',
	`issued_at` timestamp DEFAULT (now()),
	`redeemed_at` timestamp,
	CONSTRAINT `vouchers_id` PRIMARY KEY(`id`),
	CONSTRAINT `referral_code` UNIQUE(`referral_code`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `business_opening_hours` ADD CONSTRAINT `business_opening_hours_uen_businesses_uen_fk` FOREIGN KEY (`uen`) REFERENCES `businesses`(`uen`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `business_payment_options` ADD CONSTRAINT `business_payment_options_uen_businesses_uen_fk` FOREIGN KEY (`uen`) REFERENCES `businesses`(`uen`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `business_reviews` ADD CONSTRAINT `business_reviews_business_uen_businesses_uen_fk` FOREIGN KEY (`business_uen`) REFERENCES `businesses`(`uen`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `business_reviews` ADD CONSTRAINT `business_reviews_user_email_user_email_fk` FOREIGN KEY (`user_email`) REFERENCES `user`(`email`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `businesses` ADD CONSTRAINT `businesses_owner_id_user_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `forum_posts` ADD CONSTRAINT `forum_posts_business_uen_businesses_uen_fk` FOREIGN KEY (`business_uen`) REFERENCES `businesses`(`uen`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `forum_posts` ADD CONSTRAINT `forum_posts_user_email_user_email_fk` FOREIGN KEY (`user_email`) REFERENCES `user`(`email`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `forum_posts_replies` ADD CONSTRAINT `forum_posts_replies_user_email_user_email_fk` FOREIGN KEY (`user_email`) REFERENCES `user`(`email`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `forum_posts_replies` ADD CONSTRAINT `replies_post_id_fk` FOREIGN KEY (`post_id`) REFERENCES `forum_posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `referrals` ADD CONSTRAINT `referrals_referred_user_id_user_id_fk` FOREIGN KEY (`referred_user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `referrals` ADD CONSTRAINT `referrals_referrer_user_id_user_id_fk` FOREIGN KEY (`referrer_user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vouchers` ADD CONSTRAINT `vouchers_referred_user_id_user_id_fk` FOREIGN KEY (`referred_user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vouchers` ADD CONSTRAINT `vouchers_referrer_user_id_user_id_fk` FOREIGN KEY (`referrer_user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `uen` ON `business_opening_hours` (`uen`);--> statement-breakpoint
CREATE INDEX `uen` ON `business_payment_options` (`uen`);--> statement-breakpoint
CREATE INDEX `business_uen` ON `forum_posts` (`business_uen`);--> statement-breakpoint
CREATE INDEX `user_email` ON `forum_posts` (`user_email`);--> statement-breakpoint
CREATE INDEX `post_id` ON `forum_posts_replies` (`post_id`);--> statement-breakpoint
CREATE INDEX `user_id` ON `forum_posts_replies` (`user_email`);--> statement-breakpoint
CREATE INDEX `referred_user_idx` ON `referrals` (`referred_user_id`);--> statement-breakpoint
CREATE INDEX `referrer_user_idx` ON `referrals` (`referrer_user_id`);--> statement-breakpoint
CREATE INDEX `referred_user_idx` ON `vouchers` (`referred_user_id`);--> statement-breakpoint
CREATE INDEX `referrer_user_idx` ON `vouchers` (`referrer_user_id`);
*/