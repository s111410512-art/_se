# 🚀 SmartContent AI - 全方位社群與 SEO 內容智能生成平台

SmartContent AI 是一款專為**數位行銷人員、自由接案者與內容創作者**打造的生產力 SaaS 工具。本專案結合了真實的 OpenAI API，不僅能大幅縮短內容產製時間（使用價值），更內建了接案報價與 PDF 匯出功能（商業價值），協助個人與企業實現內容變現與精準 ROI 評估。

## ✨ 核心功能 (Features)

1. 📱 **多平台社群內容適配 (Social Media Hub)**
   - 串接 **OpenAI (GPT-4o-mini)** 模型，一鍵輸入主題即可生成 4 大平台客製化文案：
     - **LinkedIn**: 專業、職涯導向長文。
     - **Twitter/X**: 簡潔、條列式短文與 Emoji。
     - **Instagram**: 高互動、視覺導向圖文與多個 Hashtag。
     - **Facebook**: 口語化、引發共鳴的長文。
   - **AI 算圖咒語生成**: 同步生成適用於 Midjourney 或 DALL-E 的英文高畫質算圖提示詞 (Image Prompts)。

2. 📈 **實時 SEO 檢測寫作器 (SEO Real-time Analyzer)**
   - 具備實時字數統計、關鍵字密度偵測與可讀性分析。
   - 動態計算整體 SEO 健康度評分 (0-100分)，並給予過度堆疊關鍵字的警告提示。

3. 💰 **商業報價算股器與 PDF 匯出 (Agency Estimator)**
   - 輸入每月貼文與文章需求，自動對比「傳統人工耗時成本」與「AI 輔助成本」。
   - 自動計算利潤率，並提供對外接案的建議報價。
   - **一鍵匯出 PDF**: 將報價結果自動轉換為專業的 PDF 報價單供客戶下載。

4. 🕰️ **本地端歷史紀錄 (Local Storage History)**
   - 自動保存使用者過去生成的社群文案與提示詞。
   - 使用瀏覽器 Local Storage，重整網頁資料不遺失。

## 🛠️ 技術棧 (Tech Stack)

- **前端框架**: React 18 (Vite 構建)
- **UI 樣式**: Tailwind CSS (v4)
- **圖示庫**: Lucide React
- **PDF 與截圖匯出**: jsPDF, html2canvas
- **AI 模型串接**: OpenAI API (`gpt-4o-mini`)
- **資料儲存**: 瀏覽器 Local Storage

## 🚀 快速開始 (Getting Started)

### 1. 安裝環境與建立專案
請確保您的電腦已安裝 Node.js。在終端機中執行以下指令建立並進入專案：
```bash
npm create vite@latest smart-content-ai -- --template react
cd smart-content-ai
```

### 2. 安裝依賴套件
```bash
# 安裝核心依賴與 UI 圖示
npm install
npm install lucide-react

# 安裝 PDF 匯出相關套件
npm install jspdf html2canvas

# 安裝 Tailwind CSS 與 PostCSS
npm install -D tailwindcss @tailwindcss/postcss autoprefixer
npx tailwindcss init -p
```

### 3. 設定 Tailwind CSS
確保您的 `postcss.config.js` 設定如下：
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

確保您的 `tailwind.config.js` 設定如下：
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

並清空 `src/index.css`，加入以下三行：
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. 啟動開發伺服器
將主程式碼貼入 `src/App.jsx` 後，執行以下指令啟動：
```bash
npm run dev
```
打開瀏覽器訪問 `http://localhost:5173` 即可開始使用！

## 💡 使用指南 (Usage Guide)

1. **設定 API Key**: 點擊右上角輸入您的 OpenAI API Key。系統會將其安全地儲存在您的瀏覽器本地端 (Local Storage)，不會上傳至任何第三方伺服器。若未輸入，系統將使用預設的「模擬假資料」進行展示。
2. **切換夜間模式**: 點擊右上角的 🌙/☀️ 按鈕可自由切換深色/淺色主題。
3. **生成內容**: 在「多平台社群生成」頁籤輸入您的靈感（例如："2026 AI 辦公趨勢"），點擊生成即可獲得四個平台專屬文案與算圖咒語。
4. **匯出報價單**: 在「接案報價算股器」調整參數後，點擊右上角「匯出報價單 PDF」，即可獲得一份精美的專案報價單檔案。

## 📄 授權 (License)

此專案為開放原始碼，採用 [MIT License](LICENSE) 授權。您可以自由修改並應用於個人或商業專案中。
