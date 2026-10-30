# 💰 個人財務與記帳管理儀表板 (Finance Dashboard)

這是一個使用 React 和 Vite 建立的輕量級、響應式記帳單頁應用程式 (SPA)。
所有的記帳資料都會安全地儲存在使用者的瀏覽器本地端 (Local Storage) 中，不需要連接後端伺服器或資料庫即可完整運作。

## ✨ 功能特色

* **📊 即時總覽面板**：自動計算並顯示當前總結餘、本期總收入與總支出。
* **📝 簡易記帳表單**：支援快速切換「收入」與「支出」類型，並提供預設的常見分類與備註欄位。
* **📈 支出結構分析**：內建互動式圓餅圖，自動依據支出金額多寡排序，直觀了解資金流向。
* **📋 歷史紀錄清單**：條列式呈現所有交易明細，以不同顏色與圖示區分收支，並提供一鍵刪除功能。
* **💾 本地資料儲存**：重新整理或關閉網頁後，資料都不會遺失，下次開啟自動還原。

## 🛠️ 使用技術 (Tech Stack)

* **核心框架**：[React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
* **樣式設計**：[Tailwind CSS](https://tailwindcss.com/) (現代化 Utility-First CSS 框架)
* **資料視覺化**：[Recharts](https://recharts.org/) (基於 D3.js 的 React 圖表庫)
* **UI 圖示**：[Lucide React](https://lucide.dev/)

## 🚀 快速開始 (Getting Started)

請確保您的電腦已安裝 [Node.js](https://nodejs.org/) (建議使用 LTS 版本)。

### 1. 安裝專案依賴

進入專案資料夾後，執行以下指令安裝所需套件：

```bash
npm install
```

*(註：若您有遇到 Tailwind CSS 相關外掛錯誤，請確保已安裝 `@tailwindcss/postcss`)*

### 2. 啟動開發伺服器

執行以下指令以啟動 Vite 開發伺服器：

```bash
npm run dev
```

### 3. 開啟網頁

伺服器啟動後，終端機會顯示本地端網址（通常是 `http://localhost:5173`）。
在瀏覽器中開啟該網址，即可開始使用您的記帳儀表板！

## 📁 專案結構簡介

```text
finance-dashboard/
├── public/             # 靜態資源
├── src/
│   ├── App.jsx         # 應用程式主邏輯與 UI 結構
│   ├── index.css       # Tailwind CSS 基礎設定
│   └── main.jsx        # React 程式進入點
├── package.json        # 專案套件清單與設定
├── tailwind.config.js  # Tailwind CSS 設定檔
└── postcss.config.js   # PostCSS 設定檔
```

## 📝 後續可擴充功能建議

* 加入依「月份」或「年份」篩選紀錄的功能。
* 提供「匯出 CSV」或「匯入備份」的功能。
* 允許使用者自訂收支分類名稱。