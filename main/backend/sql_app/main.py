from typing import List
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import crud,address,database,models,schemas
from database import engine, SessionLocal
import address
# modelsのBaseを持ってくる Databaseの作成をしている。
models.Base.metadata.create_all(bind=engine) # databaseのエンジンを使ってdatabaseの作成をしている。

# 2.apiを作成する
app = FastAPI()

### データベースを取得するための関数  
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

## get
@app.get("/get_address")
async def read_address(lat : float ,lng : float):
  print(lat,lng)
  return await address.get_address(lat,lng)

@app.get("/get_attendances")
async def read_attendances(db : Session = Depends(get_db)):
  return crud.get_attendances(db=db)


### post
@app.post("/clock_in")
async def create_attendance(attendance: schemas.Attendance ,db : Session = Depends(get_db)):
  return crud.stamp_clock_in(db=db,attendance=attendance)

@app.post("/clock_out")
async def update_attendance(attendance: schemas.Attendance ,db : Session = Depends(get_db)):
  print(attendance)
  return crud.stamp_clock_out(db=db,attendance=attendance)