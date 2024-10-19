from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

class MaterialDetailBase(BaseModel):
    name: str
    genre: str
    quantity: Optional[int] = 0
    allergy_code: Optional[str] = None
    expiration_date: Optional[date] = None

class MaterialDetailCreate(MaterialDetailBase):
    material_id: str
    branch_number: str

class MaterialDetailUpdate(MaterialDetailBase):
    pass

class MaterialDetail(MaterialDetailBase):
    material_id: str
    branch_number: str
    update_at: datetime
    create_at: datetime

    class Config:
        orm_mode = True
