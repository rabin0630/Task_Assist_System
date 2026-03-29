// 1. ページ切り替え機能
function showPage(pageId) {
    // すべてのページを非表示にする
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    // すべてのナビボタンの活性状態を解除
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // 対象のページとボタンを活性化
    document.getElementById(`page-${pageId}`).classList.add('active');
    document.getElementById(`btn-${pageId}`).classList.add('active');

    // 履歴ページを開いたときは最新データを読み込む
    if (pageId === 'history') {
        loadHistory();
    }
}

// 2. 「追加」ボタンを押したときの処理 (Pythonのadd_itemを呼ぶ)
async function addItem() {
    const surface = document.getElementById('spec-surface').value;
    const size = document.getElementById('spec-size').value;
    const shape = document.getElementById('spec-shape').value;
    const qty = document.getElementById('order-qty').value;

    if (!surface || !size || !shape || !qty) {
        alert("未入力の項目があります");
        return;
    }

    const fullName = `${surface} ${size} ${shape}`;

    // Python側の Api.add_item() を呼び出し、結果を待つ
    const response = await window.pywebview.api.add_item(fullName, qty);

    if (response.status === "success") {
        renderOrderTable(response.items);
        // 入力フィールドをリセット
        document.getElementById('spec-surface').value = '';
        document.getElementById('spec-size').value = '';
        document.getElementById('spec-shape').value = '';
        document.getElementById('order-qty').value = '';
    }
}

// 3. 発注リストのテーブル描画
function renderOrderTable(items) {
    const tbody = document.querySelector('#order-table tbody');
    tbody.innerHTML = "";
    items.forEach(item => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = item.name;
        row.insertCell(1).textContent = item.qty;
    });
}

// 4. 「Outlookで作成」ボタンの処理 (Pythonのsend_orderを呼ぶ)
async function submitOrder() {
    const ccSelect = document.getElementById('cc-list');
    const ccList = Array.from(ccSelect.selectedOptions).map(opt => opt.value);
    const memo = document.getElementById('memo').value;

    // Python側の Api.send_order() を呼び出し
    const response = await window.pywebview.api.send_order("ラビン", ccList, memo);

    if (response.status === "success") {
        alert("Outlookを起動し、履歴を保存しました");
        renderOrderTable([]); // リスト表示をクリア
        document.getElementById('memo').value = '';
    } else {
        alert("エラーが発生しました: " + response.message);
    }
}

// 5. 履歴データの読み込み (Pythonのget_historyを呼ぶ)
async function loadHistory() {
    const history = await window.pywebview.api.get_history();
    const tbody = document.querySelector('#history-table tbody');
    tbody.innerHTML = "";

    history.forEach(h => {
        const row = tbody.insertRow();
        // 改ざん検知（Python側で判定済み）
        if (h.tampered) {
            row.style.backgroundColor = "#ffebee"; // 薄い赤
            row.style.color = "#c62828";
        }

        row.insertCell(0).textContent = h.date;
        row.insertCell(1).textContent = h.item;
        row.insertCell(2).textContent = h.qty;
        row.insertCell(3).textContent = h.tampered ? "⚠️改ざん検知" : "正常";
    });
}