#使用ライブラリ
import os
import argparse
from programs import times
from datetime import datetime
import numpy

#定数
STATUS = {"1":{"english":"Check in","japanese":"出勤"},
          "2":{"english":"Check out","japanese":"退勤"}
          }

#ファイル作成（存在しなかったら作成）
os.makedirs("log",exist_ok=True)

#引数解析関数
def get_arguments():
    """
    入力された引数を解析する関数
    使用する引数は一つだけのため、位置引数を使用
    コマンドライン引数を指定しないとエラーのようなものが出るため、nargsコマンドを採用
    returnではif文の簡略化をしている。何も書いてなければnoneを返す
    
    :return: 入力された値
    :rtype: str型
    """
    parser = argparse.ArgumentParser()
    parser.add_argument("stamp")
    args = parser.parse_args()
    return args.stamp.strip() if args.stamp else None
    
#書き込み関数
def write_status(current_time,status):
    """
    現在時刻とステータスをcsvに入力する関数
    辞書を用いてステータス代入し、辞書にないキーを打った時は何もしないようになっている
    将来は休憩や中抜けなどのステータスも追加することができる
    指定されたパスにcsvを開き、なかったら新規作成。そのcsvに現在時刻と出勤状況の記入
    
    :param current_time: 現在時刻の文字列
    :type current_time: str
    :param status: 打刻コード
    :type status: str
    :return: なし
    """
    if status in STATUS:
        with open("log/work_time_stamping.csv", 'a', encoding='utf-8') as log:
            log.write(f"{current_time} {STATUS[status]['english']}\n")

#表示関数
def display_message(input_stamp):
    """
    指定コードを用いて、出勤状況を画面に表示する関数
    使用者がちゃんとcsvに出勤状況が書き込んでいるか・出勤できているかを把握するために採用
    将来はその日何時間働いたかなどを表示するようにしたい
    stamp_listは使用引数を状態に変換させるために採用
    指定コード以外を使用したら出退勤ができていないよという警告を表示する
    :param input_stamp: コマンドライン引数に打ち込んだ数字
    :type input_stamp: str型
    :return: なし
    """
    if input_stamp in STATUS:
        print(f"{STATUS[input_stamp]['japanese']}しました")
    else:
        print("出退勤できていません")

#書き込み
def main():
    """
    各部品を統合し、プログラムを作動させるメインの処理
    解析したコマンドライン引数をcommand_argumentsに代入
    書き込み時間と現在時刻のディレイをできるだけ減らすために、現在時刻取得は
    記入の前にした
    write_statusとdisplay_messageの引数に解析したコマンドライン引数と現在時刻引数を
    記入
    
    """
    command_arguments = get_arguments()
    current_time = datetime.now()
    write_status(times.Japan_strftime(current_time),command_arguments)
    display_message(command_arguments)

if __name__ == "__main__":
    main()