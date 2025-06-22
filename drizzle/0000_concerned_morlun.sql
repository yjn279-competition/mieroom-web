CREATE TABLE `cities` (
	`code` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`prefecture` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `evacuees` (
	`my_number` text PRIMARY KEY NOT NULL,
	`family_name` text NOT NULL,
	`given_name` text NOT NULL,
	`gender` text NOT NULL,
	`birth_date` text NOT NULL,
	`address` text NOT NULL,
	`phone_number` text NOT NULL,
	`health_status` text,
	`special_notes` text,
	`created` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `shelter_evacuees` (
	`shelter_code` text NOT NULL,
	`my_number` text NOT NULL,
	`created` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	PRIMARY KEY(`shelter_code`, `my_number`),
	FOREIGN KEY (`shelter_code`) REFERENCES `shelters`(`code`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`my_number`) REFERENCES `evacuees`(`my_number`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `shelter_supplies` (
	`shelter_code` text NOT NULL,
	`supply_id` text NOT NULL,
	`quantity` integer NOT NULL,
	`created` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	PRIMARY KEY(`shelter_code`, `supply_id`),
	FOREIGN KEY (`shelter_code`) REFERENCES `shelters`(`code`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`supply_id`) REFERENCES `supplies`(`id`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `shelters` (
	`code` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`city_code` text NOT NULL,
	`city_name` text NOT NULL,
	`prefecture` text NOT NULL,
	`address` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`elevator_info` text,
	`slope` text,
	`braille_blocks` text,
	`wheelchair_toilet` text,
	`other_facilities` text,
	`status` text NOT NULL,
	`created` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `supplies` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text,
	`expiration_date` text,
	`created` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
