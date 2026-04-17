import webview
import hashlib
import csv
import os,sys
import subprocess
from datetime import datetime

# 設定
CSV_FILE = "order_history.csv"
SALT = "SECRET_SCREW_2026"

class Api:
    def __init__(self):
        self.order_items = []

    def generate_hash(self, date, item, qty):
        text = f"{date}{item}{qty}{SALT}"
        return hashlib.sha256(text.encode()).hexdigest()

    def add_item(self, item, qty):
        """一時リストにネジを追加"""
        if not item or not qty:
            return {"status": "error", "message": "入力が不足しています"}
        self.order_items.append({"name": item, "qty": qty})
        return {"status": "success", "items": self.order_items}

    def clear_list(self):
        self.order_items = []
        return {"status": "success"}

    def send_order(self, name, cc_list, memo):
        """Outlook送信と履歴保存"""
        if not self.order_items:
            return {"status": "error", "message": "リストが空です"}

        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        item_details = ""
        for i, item in enumerate(self.order_items, 1):
            item_details += f"{i}. {item['name']} / 数量: {item['qty']}\n"

        body = f"発注者: {name}\n日時: {now}\n\n{item_details}\n備考:\n{memo}"
        safe_body = body.replace('"', "'")
        cc_str = ", ".join(cc_list)

        # AppleScript実行 (Mac専用)
        cc_scripts = ""
        for cc_name in cc_list:
            cc_scripts += f'make new cc recipient at newMessage with properties {{email address:{{address:"{cc_name}@example.com"}}}}\n'

        script = f'''
        tell application "Microsoft Outlook"
            set newMessage to make new outgoing message with properties {{subject:"ネジ発注", content:"{safe_body}"}}
            make new recipient at newMessage with properties {{email address:{{address:"support@example.com"}}}}
            {cc_scripts}
            open newMessage
            activate
        end tell
        '''
        
        try:
            subprocess.run(['osascript', '-e', script], check=True)
            
            # CSV保存
            file_exists = os.path.isfile(CSV_FILE)
            with open(CSV_FILE, mode='a', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                if not file_exists:
                    writer.writerow(["日時", "ネジ名", "数量", "CC", "ハッシュ"])
                for item in self.order_items:
                    h = self.generate_hash(now, item['name'], item['qty'])
                    writer.writerow([now, item['name'], item['qty'], cc_str, h])
            
            self.order_items = []
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def get_history(self):
        """履歴の読み込みと改ざんチェック"""
        history = []
        if not os.path.isfile(CSV_FILE):
            return history
        
        with open(CSV_FILE, mode='r', encoding='utf-8') as f:
            reader = csv.reader(f)
            try:
                next(reader) # ヘッダー
                for row in reader:
                    if len(row) < 5: continue
                    date, item, qty, cc, saved_hash = row
                    current_hash = self.generate_hash(date, item, qty)
                    is_tampered = current_hash != saved_hash
                    history.append({
                        "date": date, "item": item, "qty": qty, 
                        "cc": cc, "tampered": is_tampered
                    })
            except StopIteration:
                pass
        return history

if __name__ == '__main__':
    api = Api()
    
    # index.htmlの絶対パスを取得
    current_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(current_dir)
    html_path = os.path.join(parent_dir, 'frontend','index.html')
    
    # pywebviewの起動
    # Mac環境で真っ白になるのを防ぐため file:// を使用
    window = webview.create_window(
        'Screw Ordering System', 
        url=f'file://{html_path}', 
        js_api=api, 
        width=800, 
        height=750
    )
    webview.start()