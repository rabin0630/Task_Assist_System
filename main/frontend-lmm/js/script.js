/**
 * 定数定義
 */
const CLOCK_UPDATE_INTERVAL_MS = 100;

/**
 * 画面の現在時刻表示を更新する。
 */
function updateCurrentTimeDisplay() {
    const timeElement = document.getElementById("time");
    if (!timeElement) return;

    const currentDate = new Date();
    timeElement.textContent = currentDate.toLocaleTimeString();
}

/**
 * 操作結果をユーザーに通知する。
 * 現在時刻を含めた警告文形式で表示する。
 */
function notifyActionResponse(params) {
    const { actionName, hasError = false } = params;
    
    if (hasError) {
        alert(`エラー: ${actionName}の記録に失敗しました。`);
        return;
    }

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // 「丸々時まるまる分に${n}しました。」という形式で通知する。
    alert(`${hours}時${minutes}分に${actionName}しました。`);
}

/**
 * ボタンを無効化し、背景色を変更する。
 */
function disableButton(buttonElement) {
    buttonElement.disabled = true;
    buttonElement.style.backgroundColor = "gray";
    buttonElement.style.cursor = "not-allowed";
}

/**
 * 各操作ボタンにクリックイベントを登録する。
 */
function initializeButtonListeners() {
    const buttonWrapper = document.getElementById("button-wrapper");
    if (!buttonWrapper) return;

    const actionButtons = buttonWrapper.querySelectorAll("button");

    actionButtons.forEach(function(targetButton) {
        targetButton.addEventListener("click", function(event) {
            const clickedActionName = event.target.textContent;
            
            // 処理結果を通知する。
            notifyActionResponse({ 
                actionName: clickedActionName, 
                hasError: false 
            });

            // 1日1回制限のため、クリックされたボタンを無効化する。
            disableButton(targetButton);
        });
    });
}

/**
 * 実行処理
 */
setInterval(updateCurrentTimeDisplay, CLOCK_UPDATE_INTERVAL_MS);
updateCurrentTimeDisplay();
initializeButtonListeners();