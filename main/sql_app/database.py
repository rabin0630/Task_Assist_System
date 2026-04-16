from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# データベースの保存先
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"   # データベースの格納先

# データベースを操作するための準備
engine = create_engine(
  SQLALCHEMY_DATABASE_URL,connect_args={"check_same_thread":False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False,bind=engine) # エンジンとこれを統合
Base = declarative_base()  # クラスを継承した