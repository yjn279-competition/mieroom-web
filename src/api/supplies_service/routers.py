from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from api.supplies_service.crud import get_materials, get_material, create_material, update_material, delete_material, get_material_details
from api.supplies_service import schemas
from api.database import get_db

# Materialエンドポイントに関連するルーターを定義
router = APIRouter(
    prefix="/materials",  # すべてのエンドポイントに適用される共通のURLプレフィックス
    tags=["materials"],   # ドキュメントで使用されるタグ
)

@router.get("/")
def read_materials(db: Session = Depends(get_db)):
    materials = get_material_details(db)
    if not materials:
        raise HTTPException(status_code=404, detail="No materials found")
    return materials

@router.get("/{material_id}", response_model=schemas.Material)
def read_material(material_id: str, db: Session = Depends(get_db)):
    """特定の材料を取得するエンドポイント
    """
    material = get_material(db, material_id=material_id)
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    return material

@router.post("/", response_model=schemas.Material)
def create_material(material: schemas.MaterialCreate, db: Session = Depends(get_db)):
    """新しい材料を作成するエンドポイント
    """
    return create_material(db=db, material=material)

@router.put("/{material_id}", response_model=schemas.Material)
def update_material(material_id: str, material_update: schemas.MaterialUpdate, db: Session = Depends(get_db)):
    """既存の材料を更新するエンドポイント
    """
    material = update_material(db=db, material_id=material_id, material_update=material_update)
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    return material

@router.delete("/{material_id}", response_model=schemas.Material)
def delete_material(material_id: str, db: Session = Depends(get_db)):
    """特定の材料を削除するエンドポイント
    """
    material = delete_material(db=db, material_id=material_id)
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    return material
