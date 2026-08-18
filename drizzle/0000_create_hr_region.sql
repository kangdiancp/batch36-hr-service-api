CREATE SCHEMA "hr";
--> statement-breakpoint
CREATE TABLE "hr"."regions" (
	"region_id" serial PRIMARY KEY NOT NULL,
	"region_name" varchar(25)
);
