
def Japan_strftime(date):
    """
    
    
    datetime.now()でその日付時間を取得し、weekdaysリストを用いて取得された曜日の番号で
    何曜日かを取り出す。ストリング式フォーマットで書く変数を減らした。
    引数は必要なし、設計上渡されることもない（はず）が、引数が渡されたらエラーを吐く
    
    :return: 関数が実行された時点の日付を曜日形式で戻す
    :rtype: str型
    """
    
    weekdays = ["月","火","水","木","金","土","日"]
    weekday = weekdays[date.weekday()]
    
    return date.strftime(f"%Y/%m/%d({weekday}) %H時%M分%S秒")
    

if __name__ == "__main__":
    pass