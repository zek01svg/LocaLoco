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
ALTER TABLE `forum_posts` DROP FOREIGN KEY `forum_posts_ibfk_3`;
--> statement-breakpoint
DROP INDEX `parent_id` ON `forum_posts`;--> statement-breakpoint
ALTER TABLE `forum_posts` MODIFY COLUMN `created_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `user` ADD `referral_code` text;--> statement-breakpoint
ALTER TABLE `user` ADD `referred_by_user_id` text;--> statement-breakpoint
ALTER TABLE `business_reviews` ADD CONSTRAINT `business_reviews_user_email_user_email_fk` FOREIGN KEY (`user_email`) REFERENCES `user`(`email`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `business_reviews` ADD CONSTRAINT `business_reviews_business_uen_businesses_uen_fk` FOREIGN KEY (`business_uen`) REFERENCES `businesses`(`uen`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `forum_posts_replies` ADD CONSTRAINT `forum_posts_replies_user_email_user_email_fk` FOREIGN KEY (`user_email`) REFERENCES `user`(`email`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `forum_posts_replies` ADD CONSTRAINT `replies_post_id_fk` FOREIGN KEY (`post_id`) REFERENCES `forum_posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `referrals` ADD CONSTRAINT `referrals_referrer_user_id_user_id_fk` FOREIGN KEY (`referrer_user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `referrals` ADD CONSTRAINT `referrals_referred_user_id_user_id_fk` FOREIGN KEY (`referred_user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vouchers` ADD CONSTRAINT `vouchers_referrer_user_id_user_id_fk` FOREIGN KEY (`referrer_user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vouchers` ADD CONSTRAINT `vouchers_referred_user_id_user_id_fk` FOREIGN KEY (`referred_user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `post_id` ON `forum_posts_replies` (`post_id`);--> statement-breakpoint
CREATE INDEX `user_email` ON `forum_posts_replies` (`user_email`);--> statement-breakpoint
CREATE INDEX `referred_user_idx` ON `referrals` (`referred_user_id`);--> statement-breakpoint
CREATE INDEX `referrer_user_idx` ON `referrals` (`referrer_user_id`);--> statement-breakpoint
CREATE INDEX `referred_user_idx` ON `vouchers` (`referred_user_id`);--> statement-breakpoint
CREATE INDEX `referrer_user_idx` ON `vouchers` (`referrer_user_id`);--> statement-breakpoint
ALTER TABLE `businesses` DROP COLUMN `password`;--> statement-breakpoint
ALTER TABLE `forum_posts` DROP COLUMN `parent_id`;--> statement-breakpoint
ALTER TABLE `forum_posts` DROP COLUMN `updated_at`;