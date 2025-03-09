-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_evacuees" (
    "my_number" TEXT NOT NULL PRIMARY KEY,
    "family_name" TEXT NOT NULL,
    "given_name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "health_status" TEXT,
    "special_notes" TEXT,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_evacuees" ("address", "birth_date", "created", "family_name", "gender", "given_name", "health_status", "my_number", "phone_number", "special_notes", "updated") SELECT "address", "birth_date", "created", "family_name", "gender", "given_name", "health_status", "my_number", "phone_number", "special_notes", "updated" FROM "evacuees";
DROP TABLE "evacuees";
ALTER TABLE "new_evacuees" RENAME TO "evacuees";
CREATE TABLE "new_shelter_evacuees" (
    "shelter_code" TEXT NOT NULL,
    "my_number" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("shelter_code", "my_number"),
    CONSTRAINT "shelter_evacuees_shelter_code_fkey" FOREIGN KEY ("shelter_code") REFERENCES "shelters" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "shelter_evacuees_my_number_fkey" FOREIGN KEY ("my_number") REFERENCES "evacuees" ("my_number") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_shelter_evacuees" ("created", "my_number", "shelter_code", "updated") SELECT "created", "my_number", "shelter_code", "updated" FROM "shelter_evacuees";
DROP TABLE "shelter_evacuees";
ALTER TABLE "new_shelter_evacuees" RENAME TO "shelter_evacuees";
CREATE TABLE "new_shelter_supplies" (
    "shelter_code" TEXT NOT NULL,
    "supply_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("shelter_code", "supply_id"),
    CONSTRAINT "shelter_supplies_shelter_code_fkey" FOREIGN KEY ("shelter_code") REFERENCES "shelters" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "shelter_supplies_supply_id_fkey" FOREIGN KEY ("supply_id") REFERENCES "supplies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_shelter_supplies" ("created", "quantity", "shelter_code", "supply_id", "updated") SELECT "created", "quantity", "shelter_code", "supply_id", "updated" FROM "shelter_supplies";
DROP TABLE "shelter_supplies";
ALTER TABLE "new_shelter_supplies" RENAME TO "shelter_supplies";
CREATE TABLE "new_shelters" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "city_code" TEXT NOT NULL,
    "city_name" TEXT NOT NULL,
    "prefecture" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "elevator_info" TEXT,
    "slope" TEXT,
    "braille_blocks" TEXT,
    "wheelchair_toilet" TEXT,
    "other_facilities" TEXT,
    "status" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_shelters" ("address", "braille_blocks", "city_code", "city_name", "code", "created", "elevator_info", "latitude", "longitude", "name", "other_facilities", "prefecture", "slope", "status", "updated", "wheelchair_toilet") SELECT "address", "braille_blocks", "city_code", "city_name", "code", "created", "elevator_info", "latitude", "longitude", "name", "other_facilities", "prefecture", "slope", "status", "updated", "wheelchair_toilet" FROM "shelters";
DROP TABLE "shelters";
ALTER TABLE "new_shelters" RENAME TO "shelters";
CREATE TABLE "new_supplies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "expiration_date" TEXT,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_supplies" ("category", "created", "expiration_date", "id", "name", "updated") SELECT "category", "created", "expiration_date", "id", "name", "updated" FROM "supplies";
DROP TABLE "supplies";
ALTER TABLE "new_supplies" RENAME TO "supplies";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
