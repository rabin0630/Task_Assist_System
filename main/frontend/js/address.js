const addrText = document.getElementById('address');
const BASE_URL = "http://127.0.0.1:8000/get_address";

const getPosition = async (position) => {
  try {
    const { latitude, longitude } = position.coords;

    // 
    const params = new URLSearchParams({
      lat: latitude,
      lng: longitude
    });

    // 自動で ?lat=xxx&lng=xxx の形に整形される
    const response = await fetch(`${BASE_URL}?${params}`);
    
    if (!response.ok) throw new Error('Network error');
    
    const data = await response.json();
    
    addrText.textContent = data;

  } catch (error) {
    console.error(error);
    addrText.textContent = "取得失敗";
  }
};

const notPosition = () => {
  addrText.textContent = "位置許可が必要です";
};

navigator.geolocation.getCurrentPosition(getPosition, notPosition);