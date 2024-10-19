from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List  # ここを追加
from api.ble_device_service.crud import create_device_data as crud_create_device_data, get_ble_device as get_device_data_by_id, get_ble_devices
from api.ble_device_service import schemas
from api.database import get_db

# APIRouterを初期化し、エンドポイントに関する設定を行う
router = APIRouter(
    prefix="/ble",  # すべてのエンドポイントに適用される共通のURLプレフィックス
    tags=["ble"],   # ドキュメントで使用されるタグ
)

@router.get("/", response_model=List[schemas.BLEData])
def read_all_ble_data(db: Session = Depends(get_db)):
    """すべてのBLEデバイスデータを取得するエンドポイント
    """
    return get_ble_devices(db)

@router.get("/{device_id}", response_model=schemas.BLEData)
def read_ble_data(device_id: str, db: Session = Depends(get_db)):
    """特定のBLEデータをデバイスIDで取得するエンドポイント
    """
    ble_data = get_device_data_by_id(db, device_id=device_id)
    if not ble_data:
        raise HTTPException(status_code=404, detail="BLEデータが見つかりません")
    return ble_data

@router.post("/", response_model=schemas.BLEData)
def create_ble_data(ble_data: schemas.BLEDataCreate, db: Session = Depends(get_db)):
    """新しいBLEデータを作成するエンドポイント
    """
    return crud_create_device_data(db=db, ble_data=ble_data)
