from sqlalchemy.orm import Session
# import main.backend.sql_app.models as models, main.backend.sql_app.schemas as schemas
from datetime import datetime
from sqlalchemy import update
import models,schemas
# データベースを操作する


# ## Read

### ユーザー一覧を取得
def get_attendances(db :Session, skip: int = 0, limit: int = 100):
  return db.query(models.Attendance).offset(skip).limit(limit).all()

# ### 会議室一覧取得
# def get_rooms(db :Session, skip: int = 0, limit: int = 100):
#   return db.query(models.Room).offset(skip).limit(limit).all()

# ### 予約一覧取得
# def get_bookings(db :Session, skip: int = 0, limit: int = 100):
#   return db.query(models.Booking).offset(skip).limit(limit).all()


## Create

### 出勤
def stamp_clock_in(db: Session, attendance: schemas.Attendance):
  
  clean_time = attendance.clock_in.replace(microsecond=0) if attendance.clock_in else None
  db_clock_in = models.Attendance(
    work_date = attendance.work_date,# stamp_clock_inのattendance引数を使用
    clock_in = clean_time
    ) ### インスタンスを生成して、db_clock_inにをいれる
  db.add(db_clock_in) ### インスタンス化したdb_clock_inをdbに追加する
  db.commit() ### addとcommitはgitと似ている
  db.refresh(db_clock_in) ### 変更をしたらリフレッシュする必要はある
  return db_clock_in

# 退勤
def stamp_clock_out(db: Session, attendance: schemas.Attendance):
  ### 1.データベースから情報を引っ張ってくる
  clean_time = attendance.clock_out
  print(clean_time)
  db_clock_out = db.query(models.Attendance).filter(models.Attendance.work_date == attendance.work_date).first() # 一致しているデータを引っ張る
  db_clock_out.clock_out = clean_time
  print(db_clock_out)
  db.commit() ### addとcommitはgitと似ている
  db.refresh(db_clock_out) ### 変更をしたらリフレッシュする必要はある
  return db_clock_out
