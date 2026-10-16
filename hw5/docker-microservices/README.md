# 🐋 Docker 微服務系統建置紀錄

本專案使用 Docker 與 Docker Compose 建立一個三層式微服務架構（Web/Proxy + Backend + Database），並透過現代化 Web 介面展示系統運作狀態。

---

## 📐 系統架構圖 (Architecture)
[ 用戶瀏覽器 Browser ]
│
▼ (Port 80)
┌──────────────┐
│  Nginx Server│ (靜態網頁 / 反向代理)
└──────┬───────┘
│
├─► /         ---> 靜態 HTML Dashboard
└─► /api/     ---> 轉發至 Backend Service
│
▼
┌──────────────────┐
│ Node.js Backend  │ (Express REST API)
└─────────┬────────┘
│ (Port 5432)
▼
┌──────────────────┐
│   PostgreSQL     │ (持久化資料儲存)
└─────────┬────────┘


---

## 📚 Docker 學習與常用指令筆記

### 核心觀念
* **Dockerfile**：定義單一容器環境的自動化建置腳本。
* **Image (映像檔)**：唯讀的應用程式範本（包含程式碼、執行階段與環境變數）。
* **Container (容器)**：映像檔執行的實例，相互隔離且具備獨立檔案系統與網路。
* **Docker Compose**：使用 YAML 檔統一定義與管理「多容器」應用的工具。

### 常用命令速查表
| 操作項目 | 命令範例 | 說明 |
| :--- | :--- | :--- |
| **建置映像檔** | `docker build -t my-app .` | 根據目前目錄 Dockerfile 建置映像檔 |
| **檢視容器** | `docker ps` / `docker ps -a` | 查看執行中 / 所有容器 |
| **啟動 Compose** | `docker compose up -d` | 在背景編譯並啟動所有微服務 |
| **停止 Compose** | `docker compose down` | 停止並移除所有微服務容器 |
| **檢視日誌** | `docker compose logs -f` | 即時監看所有服務的 Logs |

---

## 🚀 快速啟動指南

1. **一鍵建置並啟動所有微服務：**
   ```bash
   docker compose up -d