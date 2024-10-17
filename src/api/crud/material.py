from sqlalchemy.orm import Session
from sqlalchemy import text
from api import models, schemas
from sqlalchemy import select, join


def get_material_details(db: Session):
    query = text("""
        SELECT
            shelter.name AS shelter_name,
            shelter.address AS shelter_address,
            materials.name AS material_name,
            materials.genre,
            materials.allergy_code,
            materials_detail.quantity,
            materials_detail.expiration_date
        FROM
            shelter_table AS shelter
            INNER JOIN materials_table AS materials ON shelter.shelter_code = materials.shelter_code
            INNER JOIN materials_detail_table AS materials_detail ON materials.material_id = materials_detail.material_id;
    """)
    
    # 辞書形式で結果を取得
    result = db.execute(query)
    rows = result.mappings().all()

    response_content = [
        {
            "shelter_name": row['shelter_name'],
            "shelter_address": row['shelter_address'],
            "material_name": row['material_name'],
            "genre": row['genre'],
            "allergy_code": row['allergy_code'],
            "quantity": row['quantity'],
            "expiration_date": row['expiration_date']
        }
        for row in rows
    ]

    return response_content


def get_materials(db: Session, skip: int = 0, limit: int = 10):
    """
    複数の材料を取得する関数

    Args:
        db (Session): データベースセッション。
        skip (int): スキップするレコードの数。デフォルトは0。
        limit (int): 取得するレコードの上限。デフォルトは10。

    Returns:
        List[models.Material]: 材料情報のリスト。
    """
    return db.query(models.Material).offset(skip).limit(limit).all()

def get_material(db: Session, material_id: str):
    """
    特定の材料をIDで取得する関数

    Args:
        db (Session): データベースセッション。
        material_id (str): 取得する材料のID。

    Returns:
        models.Material: 指定したIDの材料情報。見つからない場合はNoneを返す。
    """
    return db.query(models.Material).filter(models.Material.material_id == material_id).first()

def create_material(db: Session, material: schemas.MaterialCreate):
    """
    新しい材料を作成する関数

    Args:
        db (Session): データベースセッション。
        material (schemas.MaterialCreate): 作成する材料情報のデータ。

    Returns:
        models.Material: 作成された材料情報。
    """
    db_material = models.Material(**material.dict())
    db.add(db_material)
    db.commit()
    db.refresh(db_material)
    return db_material

def update_material(db: Session, material_id: str, material_update: schemas.MaterialUpdate):
    """
    既存の材料を更新する関数

    Args:
        db (Session): データベースセッション。
        material_id (str): 更新する材料のID。
        material_update (schemas.MaterialUpdate): 更新するデータ。

    Returns:
        models.Material: 更新された材料情報。見つからない場合はNoneを返す。
    """
    db_material = db.query(models.Material).filter(models.Material.material_id == material_id).first()
    if db_material:
        for key, value in material_update.dict(exclude_unset=True).items():
            setattr(db_material, key, value)
        db.commit()
        db.refresh(db_material)
    return db_material

def delete_material(db: Session, material_id: str):
    """
    特定の材料を削除する関数

    Args:
        db (Session): データベースセッション。
        material_id (str): 削除する材料のID。

    Returns:
        models.Material: 削除された材料情報。見つからない場合はNoneを返す。
    """
    db_material = db.query(models.Material).filter(models.Material.material_id == material_id).first()
    if db_material:
        db.delete(db_material)
        db.commit()
    return db_material