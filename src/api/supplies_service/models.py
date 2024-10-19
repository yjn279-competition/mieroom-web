from sqlalchemy import Column, String, Integer, Date, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from api.database import Base

class Material(Base):
    """Materialテーブルを表すSQLAlchemyモデル。材料情報を管理します。"""
    __tablename__ = "materials_table"

    material_id = Column(String(64), primary_key=True, index=True)  # 材料ID（主キー）
    name = Column(String(256), nullable=False)  # 材料名
    allergy_code = Column(String(2))  # アレルギーコード
    genre = Column(String(64), nullable=False)  # ジャンル
    update_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())  # レコード更新時のタイムスタンプ
    create_at = Column(TIMESTAMP, server_default=func.now())  # レコード作成時のタイムスタンプ

    details = relationship("MaterialDetail", back_populates="material")

class MaterialDetail(Base):
    """MaterialDetailテーブルを表すSQLAlchemyモデル。材料の詳細情報を管理します。"""
    __tablename__ = "materials_detail_table"

    material_id = Column(String(64), ForeignKey('materials_table.material_id'), primary_key=True)  # 材料ID（外部キー、主キー）
    branch_number = Column(String(16), primary_key=True)  # ブランチ番号（主キー）
    name = Column(String(256), nullable=False)  # 材料の名前
    quantity = Column(Integer, default=0)  # 数量
    allergy_code = Column(String(2))  # アレルギーコード
    genre = Column(String(64), nullable=False)  # ジャンル
    expiration_date = Column(Date)  # 有効期限
    update_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())  # レコード更新時のタイムスタンプ
    create_at = Column(TIMESTAMP, server_default=func.now())  # レコード作成時のタイムスタンプ

    material = relationship("Material", back_populates="details")
