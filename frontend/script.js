function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    document.getElementById('btn-' + pageId).classList.add('active');
    if(pageId === 'history') loadHistory();
}

async function addItem() {
    const item = document.getElementById('item-name').value;
    const qty = document.getElementById('item-qty').value;
    const res = await pywebview.api.add_item(item, qty);
    if(res.status === 'success') {
        const tbody = document.querySelector('#order-table tbody');
        tbody.innerHTML = res.items.map(i => `<tr><td>${i.name}</td><td>${i.qty}</td></tr>`).join('');
        document.getElementById('item-name').value = '';
    }
}

async function submitOrder() {
    const name = document.getElementById('user-name').value;
    const memo = document.getElementById('memo').value;
    const cc = Array.from(document.getElementById('cc-list').selectedOptions).map(o => o.value);
    
    const res = await pywebview.api.send_order(name, cc, memo);
    if(res.status === 'success') {
        alert('Outlookを起動しました。');
        document.querySelector('#order-table tbody').innerHTML = '';
        document.getElementById('memo').value = '';
    } else {
        alert('エラー: ' + res.message);
    }
}

async function loadHistory() {
    const data = await pywebview.api.get_history();
    const tbody = document.querySelector('#history-table tbody');
    tbody.innerHTML = data.reverse().map(h => `
        <tr class="${h.tampered ? 'tampered' : ''}">
            <td>${h.date}</td>
            <td>${h.item}</td>
            <td>${h.qty}</td>
            <td>${h.tampered ? '⚠️ 改ざん' : '正常'}</td>
        </tr>
    `).join('');
}