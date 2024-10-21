from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

class BLEDataBase(BaseModel):
    my_number_id: str
    full_name: str
    birth_date: date
    gender: str
    family_my_number_ids: Optional[List[str]] = None

class BLEDataCreate(BLEDataBase):
    pass

class BLEDataUpdate(BaseModel):
    my_number_id: str
    full_name: str
    birth_date: date
    gender: str
    family_my_number_ids: Optional[List[str]] = None

class BLEData(BLEDataBase):
    create_at: datetime
    update_at: datetime

    class Config:
        orm_mode = True
