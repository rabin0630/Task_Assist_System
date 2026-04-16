from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Time, Date
from database import Base

# データベースに登録したいことを入力

## 勤怠管理に必要な情報
class Attendance(Base):
  __tablename__ = "attendances"
  """
  primary_key= 主キー（必ずつけなくてはいけない)
  nullable = 空っぽでもいいかダメか。 Trueなら何もなくてもいい。Falseだったら空っぽはダメ
  nullとは、その箱の中は空だということを表す目印
  
  """
  # id = Column(Integer, primary_key=True, index=True) ### ID（自動採番の主キー）
  # user_id = Column(String(12), unique=True, index=True, nullable=False) ### ユーザーID（12文字以内・重複不可）
  work_date = Column(Date, primary_key=True, nullable=False) ### 勤務日（日付データ）
  clock_in = Column(Time, nullable=True) ### 出勤時刻（時刻）
  clock_out = Column(Time, nullable=True) ### 退勤時刻（時刻）
  # break_duration = Column(Integer, default=0) ### 休憩時間（分単位の整数：例 60）
  # total_elapsed_time = Column(Integer, default=0) ### 実労働時間（分単位の整数：例 480）