import { sqliteTable, integer, text, numeric, primaryKey, real } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const cities = sqliteTable("cities", {
	code: text().primaryKey().notNull(),
	name: text().notNull(),
	prefecture: text().notNull(),
});

export const evacuees = sqliteTable("evacuees", {
	myNumber: text("my_number").primaryKey().notNull(),
	familyName: text("family_name").notNull(),
	givenName: text("given_name").notNull(),
	gender: text().notNull(),
	birthDate: text("birth_date").notNull(),
	address: text().notNull(),
	phoneNumber: text("phone_number").notNull(),
	healthStatus: text("health_status"),
	specialNotes: text("special_notes"),
	created: numeric().default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	updated: numeric().default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const shelterEvacuees = sqliteTable("shelter_evacuees", {
	shelterCode: text("shelter_code").notNull().references(() => shelters.code, { onDelete: "restrict", onUpdate: "cascade" } ),
	myNumber: text("my_number").notNull().references(() => evacuees.myNumber, { onDelete: "restrict", onUpdate: "cascade" } ),
	created: numeric().default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	updated: numeric().default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => {
	return {
		pk0: primaryKey({ columns: [table.shelterCode, table.myNumber], name: "shelter_evacuees_shelter_code_my_number_pk"})
	}
});

export const shelterSupplies = sqliteTable("shelter_supplies", {
	shelterCode: text("shelter_code").notNull().references(() => shelters.code, { onDelete: "restrict", onUpdate: "cascade" } ),
	supplyId: text("supply_id").notNull().references(() => supplies.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	quantity: integer().notNull(),
	created: numeric().default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	updated: numeric().default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => {
	return {
		pk0: primaryKey({ columns: [table.shelterCode, table.supplyId], name: "shelter_supplies_shelter_code_supply_id_pk"})
	}
});

export const shelters = sqliteTable("shelters", {
	code: text().primaryKey().notNull(),
	name: text().notNull(),
	cityCode: text("city_code").notNull(),
	cityName: text("city_name").notNull(),
	prefecture: text().notNull(),
	address: text().notNull(),
	latitude: real().notNull(),
	longitude: real().notNull(),
	elevatorInfo: text("elevator_info"),
	slope: text(),
	brailleBlocks: text("braille_blocks"),
	wheelchairToilet: text("wheelchair_toilet"),
	otherFacilities: text("other_facilities"),
	status: text().notNull(),
	created: numeric().default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	updated: numeric().default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const supplies = sqliteTable("supplies", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	category: text(),
	expirationDate: text("expiration_date"),
	created: numeric().default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	updated: numeric().default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});
