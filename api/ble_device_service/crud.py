from sqlalchemy import text
from sqlalchemy.orm import Session
from api.ble_device_service import schemas

def get_ble_devices_data(db: Session, skip: int = 0, limit: int = 10):
    """複数のBLEデバイスデータを最新順で取得するクエリを実行します"""
    query = text("""
        SELECT 
            my_number_id,
            full_name,
            birth_date,
            gender,
            family_my_number_ids,
            create_at,
            update_at
        FROM 
            ble_device_data
        ORDER BY 
            create_at DESC  -- 最新のレコードを先に表示
        OFFSET :skip
        LIMIT :limit
    """)  # クエリを text() 関数でラップする
    result = db.execute(query, {"skip": skip, "limit": limit})
    return result.mappings().all()

# BLEデバイスデータを作成するためのクエリ
def create_device_data(db: Session, ble_data: schemas.BLEDataCreate):
    query = text("""
        INSERT INTO ble_device_data (
                my_number_id, 
                full_name, 
                birth_date,
                gender, 
                family_my_number_ids, 
                create_at,
                update_at
        )
        VALUES (
            :my_number_id, :full_name, :birth_date, :gender, :family_my_number_ids, now(), now())
        RETURNING *;
    """)
    result = db.execute(query, ble_data.dict())
    db.commit()
    return result.fetchone()
