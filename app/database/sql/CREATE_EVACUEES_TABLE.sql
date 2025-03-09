DROP TABLE IF EXISTS Evacuees;
CREATE TABLE IF NOT EXISTS Evacuees (
  my_number TEXT PRIMARY KEY, -- 一意の識別番号
  family_name TEXT NOT NULL, -- 姓
  given_name TEXT NOT NULL, -- 名
  gender TEXT NOT NULL, -- 性別
  birth_date TEXT NOT NULL, -- 生年月日
  address TEXT NOT NULL, -- 住所
  phone_number TEXT NOT NULL, -- 電話番号
  health_status TEXT NOT NULL, -- 健康状態
  special_notes TEXT, -- 特記事項
  created_datetime TEXT NOT NULL, -- 作成日時
  updated_datetime TEXT NOT NULL -- 更新日時
);
