CREATE TABLE `game` (
	`id` int AUTO_INCREMENT NOT NULL,
	`external_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`release_date` date,
	`to_be_announced` boolean NOT NULL DEFAULT false,
	`cover_image` varchar(255),
	`metacritic_rating` int,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `game_id` PRIMARY KEY(`id`),
	CONSTRAINT `game_external_id_unique` UNIQUE(`external_id`),
	CONSTRAINT `game_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `parent_platform_game` (
	`parent_platform_id` int NOT NULL,
	`game_id` int NOT NULL,
	CONSTRAINT `parent_platform_game_parent_platform_id_game_id_pk` PRIMARY KEY(`parent_platform_id`,`game_id`)
);
--> statement-breakpoint
CREATE TABLE `parent_platform` (
	`id` int AUTO_INCREMENT NOT NULL,
	`external_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `parent_platform_id` PRIMARY KEY(`id`),
	CONSTRAINT `parent_platform_external_id_unique` UNIQUE(`external_id`),
	CONSTRAINT `parent_platform_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `account` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` text,
	`session_state` varchar(255),
	CONSTRAINT `account_provider_providerAccountId_pk` PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `session_sessionToken` PRIMARY KEY(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `user_game` (
	`user_id` varchar(255) NOT NULL,
	`game_id` int NOT NULL,
	`status` varchar(255),
	CONSTRAINT `user_game_user_id_game_id_pk` PRIMARY KEY(`user_id`,`game_id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`emailVerified` timestamp(3) DEFAULT CURRENT_TIMESTAMP(3),
	`image` varchar(255),
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `verification_token` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `verification_token_identifier_token_pk` PRIMARY KEY(`identifier`,`token`)
);
--> statement-breakpoint
CREATE INDEX `userId_idx` ON `account` (`userId`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `session` (`userId`);--> statement-breakpoint
ALTER TABLE `parent_platform_game` ADD CONSTRAINT `parent_platform_game_parent_platform_id_parent_platform_id_fk` FOREIGN KEY (`parent_platform_id`) REFERENCES `parent_platform`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `parent_platform_game` ADD CONSTRAINT `parent_platform_game_game_id_game_id_fk` FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_game` ADD CONSTRAINT `user_game_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_game` ADD CONSTRAINT `user_game_game_id_game_id_fk` FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON DELETE cascade ON UPDATE no action;