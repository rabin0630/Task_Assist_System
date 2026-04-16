/**
 * 定数定義
 */
const CLOCK_UPDATE_INTERVAL_MS = 100;
const API_BASE_URL = "http://127.0.0.1:8000"; // バックエンドのURL

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
 */
function notifyActionResponse(params) {
    const { actionName, hasError = false } = params;
    
    if (hasError) {
        alert(`エラー: ${actionName}の記録に失敗しました。サーバーが起動しているか確認してください。`);
        return;
    }

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    alert(`${hours}時${minutes}分に${actionName}しました。`);
}

/**
 * ボタンを無効化する。
 */
function disableButton(buttonElement) {
    buttonElement.disabled = true;
    buttonElement.style.backgroundColor = "gray";
    buttonElement.style.cursor = "not-allowed";
}

/**
 * バックエンドのAPIにデータを送信する。
 */
async function sendAttendanceData(actionName) {
    const now = new Date();
    
    // APIが求める形式 (schemas.Attendance) に合わせる
    const requestData = {
        work_date: now.toLocaleDateString('sv-SE'), // "YYYY-MM-DD" 形式
        clock_in: now.toTimeString().split(' ')[0],   // "HH:MM:SS" 形式
        clck_out: now.toTimeString().split(' ')[0]
    };
    let type = null;
    if (actionName === "出勤") {
        type = "clock_in";
    }else if (actionName === "退勤") {
        type = "clock_out";
        }

    try {
        const response = await fetch(`${API_BASE_URL}/${type}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });

        return response.ok;
    } catch (error) {
        console.error("通信失敗:", error);
        return false;
    }
    
}

/**
 * 各操作ボタンにクリックイベントを登録する。
 */
function initializeButtonListeners() {
    const buttonWrapper = document.getElementById("button-wrapper");
    if (!buttonWrapper) return;

    const actionButtons = buttonWrapper.querySelectorAll("button");

    actionButtons.forEach(function(targetButton) {
        targetButton.addEventListener("click", async function(event) {
            const clickedActionName = event.target.textContent;

            // 「出勤」ボタンの場合のみAPI通信を実行
            if (clickedActionName === "出勤") {
                const isSuccess = await sendAttendanceData(clickedActionName);
                
                if (isSuccess) {
                    notifyActionResponse({ actionName: clickedActionName, hasError: false });
                    disableButton(targetButton);
                } else {
                    notifyActionResponse({ actionName: clickedActionName, hasError: true });
                }
            }else if(clickedActionName === "退勤") {
                const isSuccess = await sendAttendanceData(clickedActionName);
                
                if (isSuccess) {
                    notifyActionResponse({ actionName: clickedActionName, hasError: false });
                    disableButton(targetButton);
                } else {
                    notifyActionResponse({ actionName: clickedActionName, hasError: true });
                }

            }else {
                // 出勤以外（退勤・休憩など）はまだアラートのみ
                notifyActionResponse({ actionName: clickedActionName, hasError: false });
                disableButton(targetButton);
            }
        });
    });
}

/**
 * 実行処理
 */
setInterval(updateCurrentTimeDisplay, CLOCK_UPDATE_INTERVAL_MS);
updateCurrentTimeDisplay();
initializeButtonListeners();