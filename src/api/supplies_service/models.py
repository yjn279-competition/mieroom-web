from sqlalchemy import Column, String, TIMESTAMP
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
