CREATE TABLE `forum_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_email` varchar(255) NOT NULL,
	`business_uen` varchar(20),
	`parent_id` int,
	`title` varchar(255),
	`body` text NOT NULL,
	`like_count` int DEFAULT 0,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `forum_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `forum_posts` ADD CONSTRAINT `forum_posts_user_email_user_email_fk` FOREIGN KEY (`user_email`) REFERENCES `user`(`email`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `forum_posts` ADD CONSTRAINT `forum_posts_business_uen_businesses_uen_fk` FOREIGN KEY (`business_uen`) REFERENCES `businesses`(`uen`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `forum_posts` ADD CONSTRAINT `forum_posts_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `forum_posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `business_uen` ON `forum_posts` (`business_uen`);--> statement-breakpoint
CREATE INDEX `parent_id` ON `forum_posts` (`parent_id`);--> statement-breakpoint
CREATE INDEX `user_email` ON `forum_posts` (`user_email`);