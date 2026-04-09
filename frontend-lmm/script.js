// 画面に現在時刻を表示するためDOMを更新する
function update_current_time() {
    const time_element = document.getElementById("time");
    const current_date = new Date();
    
    time_element.textContent = current_date.toLocaleTimeString();
}

// ユーザーの操作結果を画面に通知する
// 引数は(エラーフラグ, アクション名)の順で定義する
function show_action_alert(has_error, action_name) {
    alert(`${action_name}をしました`);
}

// 各ボタンのクリック動作を監視するためイベントを登録する
function setup_button_listeners() {
    const button_wrapper = document.getElementById("button-wrapper");
    const action_buttons = button_wrapper.querySelectorAll("button");

    action_buttons.forEach(function(target_button) {
        target_button.addEventListener("click", function(event) {
            const clicked_text = event.target.textContent;
            
            show_action_alert(clicked_text, false);
        });
    });
}

// リアルタイムに時刻を更新するためループ処理を実行する
setInterval(update_current_time, 100);

update_current_time();
setup_button_listeners();