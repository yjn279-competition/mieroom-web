from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EvacueeBase(BaseModel):
    is_safety: Optional[bool] = None
    shelter_code: Optional[str] = None
    allergy_code: Optional[str] = None

class EvacueeCreate(EvacueeBase):
    evacuee_id: str

class EvacueeUpdate(EvacueeBase):
    pass

class Evacuee(EvacueeBase):
    evacuee_id: str
    update_at: datetime
    create_at: datetime

    class Config:
        orm_mode = True
