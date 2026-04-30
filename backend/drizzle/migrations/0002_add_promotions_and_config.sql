CREATE TABLE `promotions` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`image_url` text NOT NULL,
	`link_url` text,
	`priority` integer DEFAULT 0,
	`is_active` integer DEFAULT true NOT NULL,
	`metadata` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_config` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `discovery_grids` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`items` text NOT NULL,
	`link` text,
	`order` integer DEFAULT 0
);
