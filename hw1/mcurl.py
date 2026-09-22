#!/usr/bin/env python3
import argparse
import urllib.request
import urllib.error
import sys

def main():
    # 1. 設定命令列參數 (仿造 curl 的參數設計)
    parser = argparse.ArgumentParser(description="一個類似 curl 的輕量級 Python 命令列工具")
    parser.add_argument("url", help="要請求的目標 URL")
    parser.add_argument("-X", "--request", default="GET", help="指定 HTTP 請求方法 (例如: GET, POST, PUT, DELETE)")
    parser.add_argument("-d", "--data", help="要傳送的 HTTP POST 資料")
    parser.add_argument("-H", "--header", action="append", help="自訂 HTTP 標頭 (可多次使用，例如: -H 'Accept: application/json')")
    parser.add_argument("-o", "--output", help="將輸出結果儲存到檔案，而不是顯示在螢幕上")
    parser.add_argument("-v", "--verbose", action="store_true", help="顯示詳細的請求與回應過程")

    args = parser.parse_args()

    # 2. 處理 HTTP Headers
    headers = {}
    if args.header:
        for h in args.header:
            if ":" in h:
                key, value = h.split(":", 1)
                headers[key.strip()] = value.strip()

    # 3. 處理 Payload Data
    data = None
    if args.data:
        data = args.data.encode('utf-8')
        # 如果使用者帶了資料，但沒有指定方法，自動轉為 POST
        if args.request == "GET":
            args.request = "POST"

    # 4. 建立請求物件
    req = urllib.request.Request(
        args.url, 
        data=data, 
        headers=headers, 
        method=args.request.upper()
    )

    # 5. 顯示 Verbose 資訊 (請求端)
    if args.verbose:
        print(f"> {args.request.upper()} {args.url}", file=sys.stderr)
        for k, v in headers.items():
            print(f"> {k}: {v}", file=sys.stderr)
        if data:
            print(f"> [攜帶 Data: {args.data}]", file=sys.stderr)
        print(">", file=sys.stderr)

    # 6. 發送請求並處理回應
    try:
        with urllib.request.urlopen(req) as response:
            # 顯示 Verbose 資訊 (回應端)
            if args.verbose:
                print(f"< HTTP/1.1 {response.status} {response.reason}", file=sys.stderr)
                for k, v in response.getheaders():
                    print(f"< {k}: {v}", file=sys.stderr)
                print("<", file=sys.stderr)

            # 讀取回應內容
            body = response.read()

            # 7. 輸出結果 (寫入檔案或印出)
            if args.output:
                with open(args.output, "wb") as f:
                    f.write(body)
                if args.verbose:
                    print(f"** 已將結果儲存至 {args.output} **", file=sys.stderr)
            else:
                try:
                    # 嘗試以 UTF-8 解碼印出
                    print(body.decode('utf-8'))
                except UnicodeDecodeError:
                    # 若為二進位檔案(如圖片)則直接輸出二進位資料
                    sys.stdout.buffer.write(body)

    except urllib.error.HTTPError as e:
        print(f"HTTP 錯誤: {e.code} {e.reason}", file=sys.stderr)
        print(e.read().decode('utf-8', errors='ignore'))
    except urllib.error.URLError as e:
        print(f"連線錯誤: {e.reason}", file=sys.stderr)
    except Exception as e:
        print(f"發生未知的錯誤: {e}", file=sys.stderr)

if __name__ == "__main__":
    main()