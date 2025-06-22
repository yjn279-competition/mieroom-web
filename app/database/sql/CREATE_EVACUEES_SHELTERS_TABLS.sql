DROP TABLE IF EXISTS EvacueeShelter;
CREATE TABLE IF NOT EXISTS EvacueeShelter (
  evacuee_my_number TEXT,
  shelter_name TEXT,
  evacuation_date DATETIME NOT NULL,
  PRIMARY KEY (evacuee_my_number, shelter_name),
  FOREIGN KEY (evacuee_my_number) REFERENCES Evacuees(my_number),
  FOREIGN KEY (shelter_name) REFERENCES Shelters(shelter_name)
);
