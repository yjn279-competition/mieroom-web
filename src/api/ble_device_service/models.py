from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.sql import func
from api.database import Base

class DeviceData(Base):
    """BLEデバイス情報を管理するためのモデル。"""
    __tablename__ = "ble_device_data"

    id = Column(Integer, primary_key=True, index=True)  # 主キーID
    device_id = Column(String(64), nullable=False, index=True)  # BLEデバイスのID
    data = Column(String(256), nullable=False)  # デバイスから取得したデータ（例: バッテリーレベル）
    create_at = Column(TIMESTAMP, server_default=func.now())  # レコード作成時のタイムスタンプ
    update_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())  # レコード更新時のタイムスタンプ
