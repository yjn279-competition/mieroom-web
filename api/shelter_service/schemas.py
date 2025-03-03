from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class ShelterBase(BaseModel):
    name: str
    prefectures: str
    address: str
    strong_point: Optional[List[str]] = None
    postal_code: Optional[str] = None
    total_count: Optional[int] = 0
    capacity: Optional[int] = 0
    availability_status: Optional[str] = "2"

class ShelterCreate(ShelterBase):
    shelter_code: str

class ShelterUpdate(ShelterBase):
    pass

class Shelter(ShelterBase):
    shelter_code: str
    update_at: datetime
    create_at: datetime

    class Config:
        orm_mode = True
