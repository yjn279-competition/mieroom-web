from sqlalchemy import Column, String, Date, ARRAY, TIMESTAMP
from sqlalchemy.sql import func
from api.database import Base

class DeviceData(Base):
    """マイナンバーカード情報を管理するためのモデル。
    
    カラム:
        my_number_id: マイナンバーID（12桁、主キー）
        full_name: 氏名
        birth_date: 生年月日
        gender: 性別 (M: 男性, F: 女性)
        family_my_number_ids: 家族のマイナンバーIDリスト
        create_at: レコード作成時のタイムスタンプ
        update_at: レコード更新時のタイムスタンプ
    """

    my_number_id = Column(String(12), primary_key=True, unique=True, nullable=False, index=True)
    full_name = Column(String(256), nullable=False)
    birth_date = Column(Date, nullable=False)
    gender = Column(String(1), nullable=False)
    family_my_number_ids = Column(ARRAY(String), nullable=True)
    create_at = Column(TIMESTAMP, server_default=func.now())
    update_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
