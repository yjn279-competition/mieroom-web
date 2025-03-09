from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

class MaterialBase(BaseModel):
    """Materialの基本スキーマ"""
    name: str
    genre: str
    allergy_code: Optional[str] = None

class MaterialCreate(MaterialBase):
    """新しい材料を作成するためのスキーマ"""
    material_id: str

class MaterialUpdate(MaterialBase):
    """既存の材料を更新するためのスキーマ"""
    pass

class Material(MaterialBase):
    """データベースから取得した材料を表現するためのスキーマ"""
    material_id: str
    update_at: datetime
    create_at: datetime

    class Config:
        orm_mode = True

class MaterialDetailBase(BaseModel):
    """MaterialDetailの基本スキーマ"""
    name: str
    genre: str
    quantity: Optional[int] = 0
    allergy_code: Optional[str] = None
    expiration_date: Optional[date] = None

class MaterialDetailCreate(MaterialDetailBase):
    """新しい材料詳細を作成するためのスキーマ"""
    material_id: str
    branch_number: str

class MaterialDetailUpdate(MaterialDetailBase):
    """既存の材料詳細を更新するためのスキーマ"""
    pass

class MaterialDetail(MaterialDetailBase):
    """データベースから取得した材料詳細を表現するためのスキーマ"""
    material_id: str
    branch_number: str
    update_at: datetime
    create_at: datetime

    class Config:
        orm_mode = True
