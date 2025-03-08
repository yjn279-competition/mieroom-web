import json
import os

# JSON データのファイルパス
json_file_path = "../raw_data/shelters.json"

# 出力する SQL ファイルのパス
output_dir = "./insert_sql"
output_sql_file = os.path.join(output_dir, "insert_shelters.sql")

# `insert_sql` ディレクトリが存在しない場合は作成
os.makedirs(output_dir, exist_ok=True)

# JSON データを読み込む
with open(json_file_path, "r", encoding="utf-8") as file:
    shelters = json.load(file)

# 100件まで取得
batch = shelters[:100]

# `INSERT` コマンドを生成
sql_values = []
for record in batch:
    # JSON のカラムを SQL のカラムにマッピング
    shelter_name = record["避難所_施設名称"]
    local_government_code = record["地方公共団体コード"]
    prefecture = record["都道府県"]
    city_name = record["指定市区町村名"]
    address = record["所在地住所"]
    latitude = record["緯度"]
    longitude = record["経度"]
    elevator_info = record["エレベーター有/避難スペースが１階"] or ""
    slope = record["スロープ等"] or ""
    braille_blocks = record["点字ブロック"] or ""
    wheelchair_toilet = record["車椅子使用者対応トイレ"] or ""
    other_facilities = record["その他"] or ""

    # 値を SQL 形式で作成
    values = (
        f"'{shelter_name}', {local_government_code}, '{prefecture}', '{city_name}', "
        f"'{address}', {latitude}, {longitude}, "
        f"'{elevator_info}', '{slope}', '{braille_blocks}', '{wheelchair_toilet}', '{other_facilities}'"
    )
    sql_values.append(f"({values})")

sql_insert_command = (
    "INSERT INTO Shelters (shelter_name, local_government_code, prefecture, city_name, address, latitude, longitude, "
    "elevator_info, slope, braille_blocks, wheelchair_toilet, other_facilities) VALUES\n" +
    ",\n".join(sql_values) + ";"
)

# `.sql` ファイルに書き出し
with open(output_sql_file, "w", encoding="utf-8") as sql_file:
    sql_file.write(sql_insert_command)

print(f"✅ `{output_sql_file}` に `INSERT` クエリを生成しました！（NULL → 空文字）")
print("🎯 確認方法:")
print(f"    cat {output_sql_file}")
