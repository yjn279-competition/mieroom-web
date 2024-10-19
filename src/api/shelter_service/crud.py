from sqlalchemy.orm import Session
from api.shelter_service import models, schemas

def get_shelters(db: Session, skip: int = 0, limit: int = 10):
    """複数の避難所を取得する関数
    """
    return db.query(models.Shelter).offset(skip).limit(limit).all()

def get_shelter(db: Session, shelter_code: str):
    """特定の避難所をコードで取得する関数
    """
    return db.query(models.Shelter).filter(models.Shelter.shelter_code == shelter_code).first()

def create_shelter(db: Session, shelter: schemas.ShelterCreate):
    """新しい避難所を作成する関数
    """
    db_shelter = models.Shelter(**shelter.dict())
    db.add(db_shelter)
    db.commit()
    db.refresh(db_shelter)
    return db_shelter

def update_shelter(db: Session, shelter_code: str, shelter_update: schemas.ShelterUpdate):
    """既存の避難所を更新する関数
    """
    db_shelter = db.query(models.Shelter).filter(models.Shelter.shelter_code == shelter_code).first()
    if db_shelter:
        for key, value in shelter_update.dict(exclude_unset=True).items():
            setattr(db_shelter, key, value)
        db.commit()
        db.refresh(db_shelter)
    return db_shelter

def delete_shelter(db: Session, shelter_code: str):
    """特定の避難所を削除する関数
    """
    db_shelter = db.query(models.Shelter).filter(models.Shelter.shelter_code == shelter_code).first()
    if db_shelter:
        db.delete(db_shelter)
        db.commit()
    return db_shelter
