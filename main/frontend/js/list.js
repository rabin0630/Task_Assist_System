// リスト取得APIのURL
const getAttendancesUrl = "http://127.0.0.1:8000/get_attendances";

/**
 * 現在の年月、今日の日付、およびその月の末日を計算して返す
 * @returns {Object} year(年), month(1月開始), lastDay(月末日), day(今日の日付)
 */
function getCurrentMonthInfo() {
    const now = new Date(); // Dateクラスの実体（インスタンス）を生成
    const year = now.getFullYear(); // 4桁の西暦を取得
    const month = now.getMonth(); // 0〜11の数値で月を取得（1月は0）

    // 月を人間が読みやすい1〜12の形式に補正して返す
    return { year, month: month + 1};
}

/**
 * 指定した年月の最終日（末日）の日数を取得する
 * @param {number} year - 西暦（例: 2026）
 * @param {number} month - 月（1月なら1、2月なら2を指定。内部で翌月として処理される）
 * @returns {number} その月の末日（28〜31）
 */
function getMonthDate(year, month) {
    // 日付に 0 を指定することで、指定した月の「前月の末日」を取得する
    // 引数の month をそのまま使うことで、人間が指定した月の末日が返る仕組み
    const lastDay = new Date(year, month, 0).getDate();
    
    return lastDay;
}

/**
 * 渡されたデータをもとにカレンダーを描画する
 */
function renderAttendanceTable(year, month, lastDay, url) {
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
 * 初期化処理（制御の責務）
 */
function initializeAttendanceList() {
    // 1. データを取得
    const { year, month } = getCurrentMonthInfo();

    // 2. 月の日数を取得
    const lastDay = getMonthDate(year,month);
    
    // 2. 描画を実行
    renderAttendanceTable(year, month, lastDay, getAttendancesUrl);
}


// ページ読み込み時に実行
initializeAttendanceList();