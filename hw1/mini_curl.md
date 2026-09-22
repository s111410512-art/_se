# Mini Curl (mcurl) 🚀

`mcurl` 是一個輕量級的命令列 HTTP 客戶端工具，使用純 Python 3 撰寫。它的設計靈感來自於經典的 `curl` 指令，旨在提供一個無需安裝任何第三方套件（如 `requests`），就能在任何支援 Python 的環境下快速發送 HTTP 請求的實用工具。

## ✨ 功能特色

* **零依賴**：僅使用 Python 內建標準函式庫 (`urllib`, `argparse` 等)。
* **跨平台**：支援 Windows、macOS 與 Linux。
* **核心功能**：支援 GET、POST、PUT、DELETE 等常見 HTTP 方法。
* **彈性配置**：可輕鬆自訂 HTTP Headers (標頭) 與傳送 Payload Data (資料)。
* **檔案下載**：支援將伺服器回應直接儲存為本地檔案（支援二進位檔案如圖片、PDF）。
* **除錯模式**：提供 Verbose 模式，清楚印出請求與回應的完整標頭資訊。

## 🛠️ 環境需求

* **Python 3.6 或以上版本**

## 📦 快速開始

1. 下載或複製本專案中的 `mcurl.py` 檔案。
2. 開啟終端機 (Terminal) 或命令提示字元 (CMD)。
3. 確認 Python 已正確安裝：
   ```bash
   python --version
   ```
4. 直接執行腳本：
   ```bash
   python mcurl.py -h
   ```

*(提示：在 macOS/Linux 系統上，您可以透過 `chmod +x mcurl.py` 賦予執行權限，即可使用 `./mcurl.py` 直接執行)*

## 📖 參數說明

| 參數 | 全名 | 說明 |
| :--- | :--- | :--- |
| `url` | 無 (位置參數) | **[必填]** 要發送請求的目標 URL。 |
| `-X` | `--request` | 指定 HTTP 請求方法，預設為 `GET`。 |
| `-d` | `--data` | 要傳送的 HTTP POST 資料。若帶入此參數會自動將方法轉為 `POST`。 |
| `-H` | `--header` | 自訂 HTTP 標頭。可重複使用以加入多個標頭。<br>例如: `-H "Content-Type: application/json"` |
| `-o` | `--output` | 將伺服器回應儲存至指定的檔案路徑，而非印在螢幕上。 |
| `-v` | `--verbose` | 顯示詳細的請求與回應過程，適合網路除錯使用。 |
| `-h` | `--help` | 顯示說明訊息並離開。 |

## 💡 實用範例

### 1. 基本 GET 請求
獲取網頁原始碼或 API 資料，並將結果輸出至終端機：
```bash
python mcurl.py https://httpbin.org/get
```

### 2. 加入自訂 Headers
在請求中攜帶驗證 Token 或是指定語言：
```bash
python mcurl.py -H "Authorization: Bearer my_token_123" -H "Accept-Language: zh-TW" https://httpbin.org/headers
```

### 3. 發送 POST 請求與 JSON 資料
指定請求方法為 POST，設定 Content-Type，並送出 JSON 資料：
```bash
python mcurl.py -X POST -H "Content-Type: application/json" -d '{"name": "Gemini", "role": "AI"}' https://httpbin.org/post
```

### 4. 下載檔案並儲存
將取得的資源（例如圖片）儲存到本地端檔案 `image.jpg`：
```bash
python mcurl.py -o image.jpg https://httpbin.org/image/jpeg
```

### 5. 開啟詳細除錯模式 (Verbose)
查看完整的雙向溝通標頭（包含送出的 Headers 與伺服器回傳的狀態碼/Headers）：
```bash
python mcurl.py -v https://httpbin.org/get
```

## 📄 授權條款

本專案採用 MIT 授權條款 (MIT License) - 詳情請參閱 LICENSE 檔案（如果有的話），您可以自由地修改與散佈。