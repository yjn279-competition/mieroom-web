from sqlalchemy.orm import Session
from api.ble_device_service import models, schemas

# 複数のBLEデバイスデータを取得します
def get_ble_devices(db: Session, skip: int = 0, limit: int = 10):
    """複数のBLEデバイスデータを取得します
    """
    return db.query(models.DeviceData).offset(skip).limit(limit).all()

# 特定のBLEデバイスデータを取得します
def get_ble_device(db: Session, device_id: str):
    """特定のBLEデバイスデータをデバイスIDで取得します
    """
    return db.query(models.DeviceData).filter(models.DeviceData.device_id == device_id).first()

def create_device_data(db: Session, ble_data: schemas.BLEDataCreate):
    db_ble_device = models.DeviceData(**ble_data.dict())
    db.add(db_ble_device)
    db.commit()
    db.refresh(db_ble_device)
    return db_ble_device

# 既存のBLEデバイスデータを更新します
def update_ble_device(db: Session, device_id: str, ble_data_update: schemas.BLEDataUpdate):
    """既存のBLEデバイスデータを更新します
    """
    db_ble_device = get_ble_device(db, device_id)  # 既存のデバイスデータを取得
    if db_ble_device:
        for key, value in ble_data_update.dict(exclude_unset=True).items():
            setattr(db_ble_device, key, value)
        db.commit()
        db.refresh(db_ble_device)
    return db_ble_device

# 特定のBLEデバイスデータを削除します
def delete_ble_device(db: Session, device_id: str):
    """特定のBLEデバイスデータを削除します
    """
    db_ble_device = get_ble_device(db, device_id)  # 既存のデバイスデータを取得
    if db_ble_device:
        db.delete(db_ble_device)
        db.commit()
    return db_ble_device

# 複数のBLEデバイスデータを取得します
def get_ble_devices(db: Session, skip: int = 0, limit: int = 10):
    """複数のBLEデバイスデータを取得します
    """
    return db.query(models.DeviceData).offset(skip).limit(limit).all()