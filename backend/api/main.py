from fastapi import FastAPI

app = FastAPI()

@app.get("/") # httpメソッドのgetでルートの一番メインのurlにアクセスがあったら、下の関数を処理する
async def index():
  return {"message":"Hello World"}