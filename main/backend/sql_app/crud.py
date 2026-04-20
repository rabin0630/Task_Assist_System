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


## Create

### 出勤時のアクション
def stamp_clock_in(db: Session, attendance: schemas.Attendance):
  data_base = models.Attendance(
    work_date = attendance.work_date,# stamp_clock_inのattendance引数を使用
    clock_in = attendance.clock_in
    ) ### インスタンスを生成して、data_baseにをいれる
  db.add(data_base) ### インスタンス化したdata_baseをdbに追加する
  db.commit() ### addとcommitはgitと似ている
  db.refresh(data_base) ### 変更をしたらリフレッシュする必要はある
  return data_base

# 退勤
def stamp_clock_out(db: Session, attendance: schemas.Attendance):
    data_base = db.query(models.Attendance).filter(
        models.Attendance.work_date == attendance.work_date
    ).first()

    if data_base and data_base.clock_in: # type: ignore
        end = datetime.combine(data_base.work_date, attendance.clock_out) # type: ignore
        start = datetime.combine(data_base.work_date, data_base.clock_in) # type: ignore
        
        # 1. 差分を計算（timedelta）
        diff = end - start 
        
        # 2. 文字列に変換する
        # そのまま str(diff) すると "8:30:00" のような形式になる
        diff_str = str(diff)

        data_base.clock_out = attendance.clock_out # type: ignore
        # 3. 文字列として保存
        data_base.total_elapsed_time = diff_str  # type: ignore
        
        db.commit()
        db.refresh(data_base)
        return data_base
