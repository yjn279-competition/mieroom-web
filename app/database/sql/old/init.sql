DROP TABLE IF EXISTS Cities;
CREATE TABLE IF NOT EXISTS Cities (
  city_code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  prefecture TEXT NOT NULL
);

DROP TABLE IF EXISTS Shelters;
CREATE TABLE IF NOT EXISTS Shelters (
  shelter_name TEXT PRIMARY KEY,
  local_government_code TEXT,
  prefecture TEXT,
  city_name TEXT,
  address TEXT,
  latitude REAL,
  longitude REAL,
  elevator_info TEXT
);

DROP TABLE IF EXISTS Evacuees;
CREATE TABLE IF NOT EXISTS Evacuees (
  my_number TEXT PRIMARY KEY,
  family_name TEXT,
  given_name TEXT,
  gender TEXT,
  birth_date TEXT,
  address TEXT,
  phone_number TEXT,
  health_status TEXT
);

DROP TABLE IF EXISTS EvacueeShelter;
CREATE TABLE IF NOT EXISTS EvacueeShelter (
  evacuee_my_number TEXT,
  shelter_name TEXT,
  evacuation_date TEXT,
  PRIMARY KEY (evacuee_my_number, shelter_name),
  FOREIGN KEY (evacuee_my_number) REFERENCES Evacuees(my_number),
  FOREIGN KEY (shelter_name) REFERENCES Shelters(shelter_name)
);

DROP TABLE IF EXISTS Supplies;
CREATE TABLE IF NOT EXISTS Supplies (
  supply_id INTEGER PRIMARY KEY,
  category TEXT,
  item_name TEXT,
  expiration_date TEXT,
  created_datetime TEXT,
  updated_datetime TEXT
);

DROP TABLE IF EXISTS SupplyShelter;
CREATE TABLE IF NOT EXISTS SupplyShelter (
  supply_id INTEGER,
  shelter_name TEXT,
  quantity INTEGER,
  PRIMARY KEY (supply_id, shelter_name),
  FOREIGN KEY (supply_id) REFERENCES Supplies(supply_id),
  FOREIGN KEY (shelter_name) REFERENCES Shelters(shelter_name)
);