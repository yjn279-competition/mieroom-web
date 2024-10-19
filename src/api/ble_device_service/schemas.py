from pydantic import BaseModel

class BLEDataBase(BaseModel):
    """BLEデバイスデータの基本スキーマ。"""
    device_id: str
    data: str

class BLEDataCreate(BLEDataBase):
    """新しいBLEデバイスデータを作成するためのスキーマ。"""
    pass

class BLEDataUpdate(BaseModel):
    """既存のBLEデバイスデータを更新するためのスキーマ。"""
    device_id: str
    data: str

class BLEData(BLEDataBase):
    """データベースから取得したBLEデバイスデータを表現するためのスキーマ。"""
    id: int

    class Config:
        orm_mode = True  # ORMモードを有効にして、SQLAlchemyモデルとの互換性を持たせます
