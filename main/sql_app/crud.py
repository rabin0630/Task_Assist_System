from sqlalchemy.orm import Session
import models, schemas
from datetime import datetime
from sqlalchemy import update

# データベースを操作する


# ## Read

# ### ユーザー一覧を取得
# def get_users(db :Session, skip: int = 0, limit: int = 100):
#   return db.query(models.User).offset(skip).limit(limit).all()

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
  clean_time = attendance.clck_out
  db_clock_out = db.query(models.Attendance).filter(models.Attendance.work_date == attendance.work_date).first() # 一致しているデータを引っ張る
  db_clock_out.clock_out = clean_time
  db.commit() ### addとcommitはgitと似ている
  db.refresh(db_clock_out) ### 変更をしたらリフレッシュする必要はある
  return db_clock_out

# from sqlalchemy import update

# stmt = update(user_table).where(user_table.c.name == "sandy").values(fullname="Sandra Cheeks")
# print(stmt)
# # UPDATE user_account SET fullname=:fullname WHERE user_account.name = :name_1





# ### 会議室登録
# def create_room(db: Session, room: schemas.Room):
#   db_room = models.Room(roomname=room.roomname, capacity=room.capacity) ### インスタンスを生成して、roomnameをいれる
#   db.add(db_room) ### インスタンス化したdb_roomをdbに追加する
#   db.commit() ### addとcommitはgitと似ている
#   db.refresh(db_room) ### 変更をしたらリフレッシュする必要はある
#   return db_room

# ### 予約登録
# def create_booking(db: Session, booking: schemas.Booking):
#   db_booking = models.Booking(
#       user_id = booking.user_id,
#       room_id = booking.room_id,
#       booked_num = booking.booked_num,
#       start_datetime = booking.start_datetime,
#       end_datetime = booking.end_datetime
#     ) ### インスタンスを生成して、bookingnameをいれる
#   db.add(db_booking) ### インスタンス化したdb_bookingをdbに追加する
#   db.commit() ### addとcommitはgitと似ている
#   db.refresh(db_booking) ### 変更をしたらリフレッシュする必要はある
#   return db_booking