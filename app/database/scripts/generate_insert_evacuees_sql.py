import json
import os

# JSON データのファイルパス
json_file_path = "../raw_data/evacuees.json"

# 出力する SQL ファイルのパス
output_dir = "./insert_sql"
output_sql_file = os.path.join(output_dir, "insert_evacuees.sql")

# `insert_sql` ディレクトリが存在しない場合は作成
os.makedirs(output_dir, exist_ok=True)

# JSON データを読み込む
with open(json_file_path, "r", encoding="utf-8") as file:
    evacuees = json.load(file)

# 100件まで取得
batch = evacuees[:100]

# `INSERT` コマンドを生成
sql_values = []
for record in batch:
    my_number = record["my_number"]
    family_name = record["family_name"]
    given_name = record["given_name"]
    gender = record["gender"]
    birth_date = record["birth_date"]
    address = record["address"]
    phone_number = record["phone_number"]
    health_status = record["health_status"]
    special_notes = record["special_notes"] or ""
    created_datetime = record["created_datetime"]
    updated_datetime = record["updated_datetime"]

    # 値を SQL 形式で作成
    values = (
        f"'{my_number}', '{family_name}', '{given_name}', '{gender}', '{birth_date}', "
        f"'{address}', '{phone_number}', '{health_status}', '{special_notes}', "
        f"'{created_datetime}', '{updated_datetime}'"
    )
    sql_values.append(f"({values})")

sql_insert_command = (
    "INSERT INTO Evacuees (my_number, family_name, given_name, gender, birth_date, address, phone_number, "
    "health_status, special_notes, created_datetime, updated_datetime) VALUES\n" +
    ",\n".join(sql_values) + ";"
)

# `.sql` ファイルに書き出し
with open(output_sql_file, "w", encoding="utf-8") as sql_file:
    sql_file.write(sql_insert_command)

print(f"✅ `{output_sql_file}` に `INSERT` クエリを生成しました！（NULL → 空文字）")
print("🎯 確認方法:")
print(f"    cat {output_sql_file}")
