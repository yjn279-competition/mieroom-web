from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MaterialBase(BaseModel):
    name: str
    genre: str
    allergy_code: Optional[str] = None

class MaterialCreate(MaterialBase):
    material_id: str

class MaterialUpdate(MaterialBase):
    pass

class Material(MaterialBase):
    material_id: str
    update_at: datetime
    create_at: datetime

    class Config:
        orm_mode = True
