CREATE TABLE `share_limits` (
	`id` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `shares` (
	`id` text PRIMARY KEY NOT NULL,
	`delete_hash` text NOT NULL,
	`expires` integer NOT NULL
);
