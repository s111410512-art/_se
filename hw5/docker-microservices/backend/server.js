const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// 連結 PostgreSQL 資料庫
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'demo_user',
  password: process.env.DB_PASSWORD || 'demo_password',
  database: process.env.DB_NAME || 'demo_db',
  port: process.env.DB_PORT || 5432,
});

// 初始化資料庫資料表
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_logs (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ 資料庫資料表初始化完成');
  } catch (err) {
    console.error('❌ 資料庫初始化失敗:', err.message);
  }
}

initDb();

// 1. 系統狀態 API
app.get('/system-status', async (req, res) => {
  try {
    const dbResult = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      service: 'Node.js Backend',
      containerTime: new Date().toISOString(),
      database: {
        status: 'Connected',
        postgresTime: dbResult.rows[0].now
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      service: 'Node.js Backend',
      database: { status: 'Disconnected', error: err.message }
    });
  }
});

// 2. 取得所有紀錄 API
app.get('/logs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM system_logs ORDER BY created_at DESC LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. 新增紀錄 API
app.post('/logs', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const result = await pool.query(
      'INSERT INTO system_logs (message) VALUES ($1) RETURNING *',
      [message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API 服務在埠號 ${PORT} 運作中`);
});