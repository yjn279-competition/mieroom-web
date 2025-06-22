DROP TABLE IF EXISTS Supplies;
CREATE TABLE IF NOT EXISTS Supplies (
  supply_id INTEGER PRIMARY KEY,
  category TEXT,
  item_name TEXT,
  expiration_date TEXT,
  created_datetime DATETIME,
  updated_datetime DATETIME
);
