/**
 * 現在の年月と末日のデータを計算して返す
 */
const baseurl = "http://127.0.0.1:8000/get_attendances";

function getCurrentMonthInfo() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-11
    const lastDay = new Date(year, month + 1, 0).getDate();
    const day = now.getDate();
    console.log(day);
    return { year, month: month + 1, lastDay ,day};
}

/**
 * 渡されたデータをもとにカレンダーを描画する
 */
function renderAttendanceTable(year, month, lastDay,url) {
    const tableBody = document.getElementById("attendance-body");
    const monthTitle = document.getElementById("month-title");

    if (!tableBody || !monthTitle) return;
    
    // 1.get_attendancesを取得する
      let fetchdata ;
      fetch(url)
    .then(res => res.json())
    .then(data => {

    
    // console.log(`${data[0].clock_out}`);
    console.log("%o",data);
    // タイトルを設定
    monthTitle.textContent = `${year}年 ${month}月 勤務実績`;

    // テーブルを一度空にする（再描画時の重複を防ぐため）
    tableBody.innerHTML = "";

    // 1日から末日まで行を作る
    for (let day = 1; day <= lastDay; day++) {
        // 2.1で取得した日付を加工するyear-month-day
        year=year.toString().padStart(2,"0");
        month=month.toString().padStart(2,"0");
        day=day.toString().padStart(2,"0");

        const formatDate = `${year}-${month}-${day}`;
        // 3.formatDateと一致するwork-dateのindexを取得
        var workDateIndex = -1 ;
    for (let elementidx = 0;elementidx < data.length; elementidx++) {
        const workdate = data[elementidx].work_date;
        if(formatDate==workdate) {
            workDateIndex = elementidx;
            break;
        }
    }
    console.log(workDateIndex);
        const row = document.createElement("tr");
        var incontent = "-";
        var outcontent ="-";
        // 3.indexが一致している場合
        if (workDateIndex >= 0) {
        // 4.if出勤している場合incontentの中身をwork-dateの中の情報を当てはめる
        console.log(data[workDateIndex].clock_in != null);
            if(data[workDateIndex].clock_in != null){
                incontent = data[workDateIndex].clock_in;
                console.log(incontent);
            }
        // 5.if退勤している場合outcontentの中身をwork-dateの中の情報を当てはめる
            if(data[workDateIndex].clock_out != null){
                outcontent = data[workDateIndex].clock_out;
                
            }
        }
        const dateCell = document.createElement("td");
        dateCell.textContent = `${day}日`;
        row.appendChild(dateCell);

        const inCell = document.createElement("td");
        inCell.textContent = incontent;
        row.appendChild(inCell);

        const outCell = document.createElement("td");
        outCell.textContent = outcontent;
        row.appendChild(outCell);

        tableBody.appendChild(row);

    }
    });
}

/**
 * データベースから勤務実績を取得して返す
 */
async function getAttendancesList() {
    const url = `http://127.0.0.1:8000/get_attendances`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("ネットワークエラー");
        
        const data = await res.json();
        return data; // ここでデータを返す
    } catch (error) {
        console.error("取得失敗:", error);
        return []; // エラー時は処理が止まらないように空の配列などを返す
    }
}

/**
 * データベースから勤務実績を取得して返す
 */
function postAttendancesList(year, month, day, url) {
    
}


/**
 * 初期化処理（制御の責務）
 */
function initializeAttendanceList() {
    // 1. データを取得
    const { year, month, lastDay, day} = getCurrentMonthInfo();
    
    // 2. 描画を実行
    renderAttendanceTable(year, month, lastDay);
}

// ページ読み込み時に実行
// initializeAttendanceList();
// getAttendancesList();
    const { year, month, lastDay, day} = getCurrentMonthInfo();
renderAttendanceTable(year,month,lastDay,baseurl);