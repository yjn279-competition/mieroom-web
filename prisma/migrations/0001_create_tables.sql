-- CreateTable
CREATE TABLE "cities" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "prefecture" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "shelters" (
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
    "updated" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "evacuees" (
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
    "updated" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "shelter_evacuee" (
    "shelter_code" TEXT NOT NULL,
    "my_number" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,

    PRIMARY KEY ("shelter_code", "my_number"),
    CONSTRAINT "shelter_evacuee_shelter_code_fkey" FOREIGN KEY ("shelter_code") REFERENCES "shelters" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "shelter_evacuee_my_number_fkey" FOREIGN KEY ("my_number") REFERENCES "evacuees" ("my_number") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "supplies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "expiration_date" TEXT,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "shelter_supply" (
    "shelter_code" TEXT NOT NULL,
    "supply_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created" DATETIME NOT NULL,
    "updated" DATETIME NOT NULL,

    PRIMARY KEY ("shelter_code", "supply_id"),
    CONSTRAINT "shelter_supply_shelter_code_fkey" FOREIGN KEY ("shelter_code") REFERENCES "shelters" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "shelter_supply_supply_id_fkey" FOREIGN KEY ("supply_id") REFERENCES "supplies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
