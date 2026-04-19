import datetime
from pydantic import BaseModel,Field
from typing import Optional

# 型の定義
# jsの中のデータベースの型
# jsを理解するためのスクリプト

### models.pyで設定した情報を元に型を決めていく
class Attendance(BaseModel):
  #id: int
  #user_id: str
  work_date: datetime.date
  clock_in: Optional[datetime.time] = None
  clock_out: Optional[datetime.time] = None  # nullableの時はoptionalにする
  #break_duration: int
  total_elapsed_time: Optional[str] = None
  
  
  
  class Config:
    orm_mode = True