from sqlalchemy import Column, String, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from api.database import Base

class Evacuee(Base):
    """Evacueeテーブルを表すSQLAlchemyモデル。避難者情報を管理します。
    """
    __tablename__ = "evacuees"

    evacuee_id = Column(String(64), primary_key=True, index=True)  # 避難者ID（主キー）
    is_safety = Column(Boolean)  # 安否確認
    shelter_code = Column(String(64), ForeignKey('shelter_table.shelter_code'))  # 避難所コード（外部キー）
    allergy_code = Column(String(2))  # アレルギーコード
    update_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())  # レコード更新時のタイムスタンプ
    create_at = Column(TIMESTAMP, server_default=func.now())  # レコード作成時のタイムスタンプ

    shelter = relationship("Shelter", back_populates="evacuees")
