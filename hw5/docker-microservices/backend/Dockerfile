# 選擇輕量級 Node.js 基礎映像檔
FROM node:18-alpine

# 設定工作目錄
WORKDIR /app

# 複製依賴描述檔並安裝套件
COPY package*.json ./
RUN npm install --production

# 複製後端程式碼
COPY . .

# 開放 Port 3000
EXPOSE 3000

# 啟動 API 服務
CMD ["node", "server.js"]