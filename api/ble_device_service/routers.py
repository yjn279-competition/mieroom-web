from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from api.ble_device_service.crud import get_ble_devices_data, create_device_data
from api.ble_device_service import schemas
from api.database import get_db

# APIRouterを初期化し、エンドポイントに関する設定を行う
router = APIRouter(
    prefix="/ble",
    tags=["ble"],
)

@router.get("/", response_model=List[schemas.BLEData])
def read_all_ble_data(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """すべてのBLEデバイスデータを取得するエンドポイント
    ページネーションが可能 (skip, limit)
    """
    data = get_ble_devices_data(db, skip=skip, limit=limit)
    if not data:
        raise HTTPException(status_code=404, detail="No BLE device data found")
    return data

@router.post("/", response_model=schemas.BLEData)
def create_ble_data(ble_data: schemas.BLEDataCreate, db: Session = Depends(get_db)):
    """新しいBLEデータを作成するエンドポイント
    """
    new_data = create_device_data(db=db, ble_data=ble_data)
    if not new_data:
        raise HTTPException(status_code=400, detail="Failed to create BLE device data")
    return new_data
