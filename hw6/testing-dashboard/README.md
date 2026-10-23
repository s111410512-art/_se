# 測試儀表板 (Testing Dashboard)

一個基於 React + Vite + Tailwind CSS 建置的全方位現代化測試儀表板，整合了**單元測試**、**系統測試 (Web API)** 與 **E2E 測試 (Playwright 無頭瀏覽器)** 的模擬與視覺化報告。

---

## 🚀 功能特點

1. **單元測試 (Unit Testing)**
   - **Client 端**：包含 React 元件渲染與 Custom Hooks（如 `useAuth`）測試[cite: 1, 3]。
   - **Server 端**：涵蓋 Rust（密碼雜湊驗證、資料模型）與 Node.js（邏輯計算）之單元測試[cite: 1, 3]。

2. **系統測試 (System Testing - Web API)**
   - 模擬整合測試與 API 端點校驗（包含 RESTful API 的 HTTP 狀態碼與 JSON 格式驗證）。

3. **E2E 端對端測試 (End-to-End Testing)**
   - 模擬 Playwright 無頭瀏覽器（Headless Browser）自動化測試。
   - 提供視覺化操作流程步驟與完整失敗 Log 分析。

4. **互動式 UI**
   - 支援一鍵執行測試套件（`Run Test Suite`）與動態進度條[cite: 1, 3]。
   - 實時統計通過/失敗數量與執行時間[cite: 1, 3]。

---

## 🛠️ 技術棧 (Tech Stack)

- **前端框架**：React 18 + Vite
- **樣式庫**：Tailwind CSS v4
- **圖標庫**：Lucide React
- **測試工具規範**：Vitest, Rust `cargo test`, Playwright

---

## 📦 安裝與執行步驟

### 1. 複製專案與安裝依賴

```bash
# 進入專案目錄
cd testing-dashboard

# 安裝套件
npm install