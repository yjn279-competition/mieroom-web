DROP TABLE IF EXISTS SupplyShelter;
CREATE TABLE IF NOT EXISTS SupplyShelter (
  supply_id INTEGER,
  shelter_name TEXT,
  quantity INTEGER,
  created_datetime DATETIME,
  updated_datetime DATETIME,
  PRIMARY KEY (supply_id, shelter_name),
  FOREIGN KEY (supply_id) REFERENCES Supplies(supply_id),
  FOREIGN KEY (shelter_name) REFERENCES Shelters(shelter_name)
);
