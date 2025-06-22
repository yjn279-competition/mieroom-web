import json
import os
import random

# JSON データのファイルパス
supply_shelter_json_path = "../raw_data/supply_shelters.json"

# `避難所名リスト`（ランダムに割り当てる）
shelter_names = [
    "お台場学園港陽小・中学校",
    "お茶の水小学校",
    "ちよだパークサイドプラザ",
    "みなとパーク芝浦（港区スポーツセンター・男女平等参画センター）",
    "アーツ千代田3331",
    "エコプラザ",
    "サン・サン赤坂（赤坂子ども中高生プラザ）",
    "スポーツセンター",
    "三田いきいきプラザ",
    "三田中学校"
]

# 出力する SQL ファイルのパス
output_dir = "./insert_sql"
output_sql_file = os.path.join(output_dir, "insert_supply_shelter.sql")

# `insert_sql` ディレクトリが存在しない場合は作成
os.makedirs(output_dir, exist_ok=True)

# `SupplyShelter` のデータを読み込む
with open(supply_shelter_json_path, "r", encoding="utf-8") as file:
    supply_shelters = json.load(file)

# 100件まで取得
batch = supply_shelters[:100]

# `INSERT` コマンドを生成
sql_values = []
for record in batch:
    supply_id = record["supply_id"]
    shelter_name = random.choice(shelter_names)  # ランダムに shelter_name を割り当て
    quantity = record["quantity"]
    created_datetime = record["created"]
    updated_datetime = record["updated"]

    values = (
        f"{supply_id}, '{shelter_name}', {quantity}, "
        f"DATETIME('{created_datetime}'), DATETIME('{updated_datetime}')"
    )
    sql_values.append(f"({values})")

sql_insert_command = (
    "INSERT INTO SupplyShelter (supply_id, shelter_name, quantity, created_datetime, updated_datetime) VALUES\n" +
    ",\n".join(sql_values) + ";"
)

# `.sql` ファイルに書き出し
with open(output_sql_file, "w", encoding="utf-8") as sql_file:
    sql_file.write(sql_insert_command)

print(f"✅ `{output_sql_file}` に `INSERT` クエリを生成しました！（100件まで）")
print("🎯 確認方法:")
print(f"    cat {output_sql_file}")
