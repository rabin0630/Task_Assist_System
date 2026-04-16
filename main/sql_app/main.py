from typing import List
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import crud, models, schemas
from database import engine, SessionLocal

# modelsのBaseを持ってくる Databaseの作成をしている。
models.Base.metadata.create_all(bind=engine) # databaseのエンジンを使ってdatabaseの作成をしている。

# 2.apiを作成する
app = FastAPI()

### データベースを取得するための関数  とりあえずコピペでいいよ
def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()

# CORS設定を追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# apiを作成する
# @app.get("/")
# async def index():
#   return {"message","Success"}

### post
@app.post("/clock_in")
async def create_attendance(attendance: schemas.Attendance ,db : Session = Depends(get_db)):
  return crud.stamp_clock_in(db=db,attendance=attendance)