import {
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const cities = sqliteTable("cities", {
  id: text("code").primaryKey(),
  name: text("name").notNull(),
  prefecture: text("prefecture").notNull(),
});

export const shelters = sqliteTable("shelters", {
  id: text("code").primaryKey(),
  name: text("name").notNull(),
  cityId: text("city_code").notNull(),
  cityName: text("city_name").notNull(),
  prefecture: text("prefecture").notNull(),
  address: text("address").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  elevatorInfo: text("elevator_info"),
  slope: text("slope"),
  brailleBlocks: text("braille_blocks"),
  wheelchairToilet: text("wheelchair_toilet"),
  otherFacilities: text("other_facilities"),
  status: text("status").notNull(),
  created: integer("created", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  updated: integer("updated", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const evacuees = sqliteTable("evacuees", {
  id: text("my_number").primaryKey(),
  familyName: text("family_name").notNull(),
  givenName: text("given_name").notNull(),
  gender: text("gender").notNull(),
  birthDate: text("birth_date").notNull(),
  address: text("address").notNull(),
  phoneNumber: text("phone_number").notNull(),
  healthStatus: text("health_status"),
  specialNotes: text("special_notes"),
  created: integer("created", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  updated: integer("updated", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const shelterEvacuees = sqliteTable(
  "shelter_evacuees",
  {
    shelterId: text("shelter_code")
      .notNull()
      .references(() => shelters.id),
    evacueeId: text("my_number")
      .notNull()
      .references(() => evacuees.id),
    created: integer("created", { mode: "timestamp" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
    updated: integer("updated", { mode: "timestamp" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.shelterId, table.evacueeId] }),
    };
  }
);

export const supplies = sqliteTable("supplies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category"),
  expirationDate: text("expiration_date"),
  created: integer("created", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  updated: integer("updated", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const shelterSupplies = sqliteTable(
  "shelter_supplies",
  {
    shelterId: text("shelter_code")
      .notNull()
      .references(() => shelters.id),
    supplyId: text("supply_id")
      .notNull()
      .references(() => supplies.id),
    quantity: integer("quantity").notNull(),
    created: integer("created", { mode: "timestamp" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
    updated: integer("updated", { mode: "timestamp" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.shelterId, table.supplyId] }),
    };
  }
);

