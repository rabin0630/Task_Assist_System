import httpx
import re
from dotenv import load_dotenv
import os
# .envファイルを読み込み、環境変数としてロードする
load_dotenv()

API = os.getenv("APIKEY")

async def get_address(lat: float, lng: float,) -> str:
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "latlng": f"{lat},{lng}",
        "key": API,
        "language": "ja"
    }
    
    # httpx.AsyncClient を使用して非同期リクエストを送る
    async with httpx.AsyncClient() as client:
        try:
            res = await client.get(url, params=params, timeout=10.0)
            res.raise_for_status()
            data = res.json()

            if data.get("status") == "OK":
                raw_address = data["results"][0]["formatted_address"]
                address = re.sub(r"^日本、", "", raw_address)
                address = re.sub(r"〒\d{3}-\d{4}\s?", "", address)
                address = re.search(r".*?丁目|.*?番", address).group() if "丁目" in address or "番" in address else address
                return address.strip()
            
            return f"API Error: {data.get('status')}"

        except httpx.RequestError as e:
            return f"Network Error: {e}"