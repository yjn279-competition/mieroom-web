from sqlalchemy import Column, String, Date
from api.database import Base

class MyNumberCard(Base):
    """マイナンバーカード情報を管理するためのモデル。"""
    __tablename__ = "my_number_card"

    card_number = Column(String, primary_key=True, index=True)  # マイナンバーカード番号（主キー）
    full_name = Column(String)  # 名前
    birth_date = Column(Date)  # 生年月日
    address = Column(String)  # 住所
