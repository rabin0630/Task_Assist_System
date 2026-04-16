from fastapi import FastAPI,Query
from typing import Annotated
from pydantic import BaseModel
from typing import Union

app = FastAPI()
items = ["tシャツ","スカート","ブーツ","コート"]

# データの取得
@app.get("/items")
def read_items(skip: int = 0,limit: Annotated[int,Query(ge=1, le=10)]= 10):
  return {"items": items[skip : skip + limit]}


class Item(BaseModel):
  name: str
  price: float
  description: Union[str, None] = None

# データの登録
@app.post("/items/")
def create_item(item: Item):
  print(f"データを登録します:{item.name},{item.price},{item.description}")
  return item