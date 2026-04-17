/**
 * 現在の年月からカレンダーの行を生成する。
 */
function initializeAttendanceList() {
    const tableBody = document.getElementById("attendance-body");
    const monthTitle = document.getElementById("month-title");
    
    if (!tableBody || !monthTitle) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0が1月、3が4月を指す。

    // タイトルを設定する。
    monthTitle.textContent = `${year}年 ${month + 1}月 勤務実績`;

    // 今月の末日を取得する(来月の0日目を指定すると今月の末日になる)。
    const lastDay = new Date(year, month + 1, 0).getDate();

    // 1日から末日までループして行を作る。
    for (let day = 1; day <= lastDay; day++) {
        const row = document.createElement("tr");

        // 日付セル。
        const dateCell = document.createElement("td");
        dateCell.textContent = `${day}日`;
        row.appendChild(dateCell);

        // 出勤時間セル(仮のデータ)。
        const inCell = document.createElement("td");
        inCell.textContent = (day === 14) ? "08:15" : "-"; // 14日だけテスト表示。
        row.appendChild(inCell);

        // 退勤時間セル(仮のデータ)。
        const outCell = document.createElement("td");
        outCell.textContent = "-";
        row.appendChild(outCell);

        tableBody.appendChild(row);
    }
}

// ページ読み込み時に実行する。
initializeAttendanceList();