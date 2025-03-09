from sqlalchemy import Column, String, Integer, ARRAY, TIMESTAMP, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from api.database import Base

class Shelter(Base):
    """Shelterテーブルを表すSQLAlchemyモデル。避難所情報を管理します。"""
    __tablename__ = "shelter_table"

    shelter_code = Column(String(64), primary_key=True, index=True)  # 避難所コード（主キー）
    name = Column(String(256), nullable=False)  # 避難所の名前
    strong_point = Column(ARRAY(String))  # 特徴
    postal_code = Column(String(8))  # 郵便番号
    prefectures = Column(String(32), nullable=False)  # 都道府県
    address = Column(String(256), nullable=False)  # 住所
    total_count = Column(Integer, default=0)  # 現在の避難者数
    capacity = Column(Integer, default=0)  # 収容人数
    availability_status = Column(String(1), server_default="2")  # 空き状況
    update_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())  # レコード更新時のタイムスタンプ
    create_at = Column(TIMESTAMP, server_default=func.now())  # レコード作成時のタイムスタンプ

    evacuees = relationship("Evacuee", back_populates="shelter")

    __table_args__ = (
        CheckConstraint('availability_status IN (\'0\', \'1\', \'2\')', name='check_availability_status'),
    )
