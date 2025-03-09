-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "shelter_evacuee";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "shelter_supply";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "shelter_evacuees" (
    "shelter_code" TEXT NOT NULL,
    "my_number" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,

    PRIMARY KEY ("shelter_code", "my_number"),
    CONSTRAINT "shelter_evacuees_shelter_code_fkey" FOREIGN KEY ("shelter_code") REFERENCES "shelters" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "shelter_evacuees_my_number_fkey" FOREIGN KEY ("my_number") REFERENCES "evacuees" ("my_number") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "shelter_supplies" (
    "shelter_code" TEXT NOT NULL,
    "supply_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created" DATETIME NOT NULL,
    "updated" DATETIME NOT NULL,

    PRIMARY KEY ("shelter_code", "supply_id"),
    CONSTRAINT "shelter_supplies_shelter_code_fkey" FOREIGN KEY ("shelter_code") REFERENCES "shelters" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "shelter_supplies_supply_id_fkey" FOREIGN KEY ("supply_id") REFERENCES "supplies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
