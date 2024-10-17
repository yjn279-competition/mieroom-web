from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from api.crud.shelter import get_shelters, get_shelter, create_shelter, update_shelter, delete_shelter
from api import schemas
from api.database import get_db

# Shelterエンドポイントに関連するルーターを定義
router = APIRouter(
    prefix="/shelters",  # すべてのエンドポイントに適用される共通のURLプレフィックス
    tags=["shelters"],   # ドキュメントで使用されるタグ
)

@router.get("/", response_model=List[schemas.Shelter])
def read_shelters(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """
    複数の避難所を取得するエンドポイント

    Args:
        skip (int): スキップするレコードの数。デフォルトは0。
        limit (int): 取得するレコードの上限。デフォルトは10。
        db (Session): データベースセッション。FastAPIの依存関係として注入される。

    Returns:
        List[schemas.Shelter]: 避難所情報のリスト。
    """
    return get_shelters(db, skip=skip, limit=limit)

@router.get("/{shelter_code}", response_model=schemas.Shelter)
def read_shelter(shelter_code: str, db: Session = Depends(get_db)):
    """
    特定の避難所を取得するエンドポイント

    Args:
        shelter_code (str): 取得する避難所のコード。
        db (Session): データベースセッション。FastAPIの依存関係として注入される。

    Returns:
        schemas.Shelter: 指定したコードの避難所情報。見つからない場合は404エラーを返す。
    """
    shelter = get_shelter(db, shelter_code=shelter_code)
    if not shelter:
        raise HTTPException(status_code=404, detail="Shelter not found")
    return shelter

@router.post("/", response_model=schemas.Shelter)
def create_shelter(shelter: schemas.ShelterCreate, db: Session = Depends(get_db)):
    """
    新しい避難所を作成するエンドポイント

    Args:
        shelter (schemas.ShelterCreate): 作成する避難所情報のデータ。
        db (Session): データベースセッション。FastAPIの依存関係として注入される。

    Returns:
        schemas.Shelter: 作成された避難所情報。
    """
    return create_shelter(db=db, shelter=shelter)

@router.put("/{shelter_code}", response_model=schemas.Shelter)
def update_shelter(shelter_code: str, shelter_update: schemas.ShelterUpdate, db: Session = Depends(get_db)):
    """
    既存の避難所を更新するエンドポイント

    Args:
        shelter_code (str): 更新する避難所のコード。
        shelter_update (schemas.ShelterUpdate): 更新する避難所情報のデータ。
        db (Session): データベースセッション。FastAPIの依存関係として注入される。

    Returns:
        schemas.Shelter: 更新された避難所情報。見つからない場合は404エラーを返す。
    """
    shelter = update_shelter(db=db, shelter_code=shelter_code, shelter_update=shelter_update)
    if not shelter:
        raise HTTPException(status_code=404, detail="Shelter not found")
    return shelter

@router.delete("/{shelter_code}", response_model=schemas.Shelter)
def delete_shelter(shelter_code: str, db: Session = Depends(get_db)):
    """
    特定の避難所を削除するエンドポイント

    Args:
        shelter_code (str): 削除する避難所のコード。
        db (Session): データベースセッション。FastAPIの依存関係として注入される。

    Returns:
        schemas.Shelter: 削除された避難所情報。見つからない場合は404エラーを返す。
    """
    shelter = delete_shelter(db=db, shelter_code=shelter_code)
    if not shelter:
        raise HTTPException(status_code=404, detail="Shelter not found")
    return shelter