DROP TABLE IF EXISTS Shelters;
CREATE TABLE IF NOT EXISTS Shelters (
  shelter_name TEXT PRIMARY KEY, -- 避難所名（主キー）
  local_government_code INTEGER, -- 地方公共団体コード
  prefecture TEXT NOT NULL, -- 都道府県
  city_name TEXT NOT NULL, -- 市区町村名
  address TEXT NOT NULL, -- 住所
  latitude REAL NOT NULL, -- 緯度
  longitude REAL NOT NULL, -- 経度
  elevator_info TEXT, -- エレベーター有無
  slope TEXT, -- スロープ等
  braille_blocks TEXT, -- 点字ブロック
  wheelchair_toilet TEXT, -- 車椅子対応トイレ
  other_facilities TEXT -- その他の設備
);
