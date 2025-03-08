import json
import os

# JSON データのファイルパス
supplies_json_path = "../raw_data/supplies.json"

# 出力する SQL ファイルのパス
output_dir = "./insert_sql"
output_sql_file = os.path.join(output_dir, "insert_supplies.sql")

# `insert_sql` ディレクトリが存在しない場合は作成
os.makedirs(output_dir, exist_ok=True)

# `Supplies` のデータを読み込む
with open(supplies_json_path, "r", encoding="utf-8") as file:
    supplies = json.load(file)

# 100件まで取得
batch = supplies[:100]

# `INSERT` コマンドを生成
sql_values = []
for record in batch:
    supply_id = record["supply_id"]
    category = record["category"]
    item_name = record["item_name"]
    expiration_date = record["expiration_date"]
    created_datetime = record["created_datetime"]
    updated_datetime = record["updated_datetime"]

    # `DATETIME` 型で挿入
    values = (
        f"{supply_id}, '{category}', '{item_name}', '{expiration_date}', "
        f"DATETIME('{created_datetime}'), DATETIME('{updated_datetime}')"
    )
    sql_values.append(f"({values})")

sql_insert_command = (
    "INSERT INTO Supplies (supply_id, category, item_name, expiration_date, created_datetime, updated_datetime) VALUES\n" +
    ",\n".join(sql_values) + ";"
)

# `.sql` ファイルに書き出し
with open(output_sql_file, "w", encoding="utf-8") as sql_file:
    sql_file.write(sql_insert_command)

print(f"✅ `{output_sql_file}` に `INSERT` クエリを生成しました！（100件まで）")
print("🎯 確認方法:")
print(f"    cat {output_sql_file}")
