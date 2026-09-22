import sqlite3
import argparse
from datetime import datetime
import os

DB_NAME = "freelance_flow.db"

def init_db():
    """初始化 SQLite 資料庫"""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project TEXT,
            rate REAL,
            start_time TEXT,
            end_time TEXT,
            duration_hours REAL,
            amount REAL,
            invoiced INTEGER DEFAULT 0
        )
    ''')
    conn.commit()
    conn.close()

def start_session(project, rate):
    """開始計算專案時間"""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # 檢查是否有尚未結束的任務
    cursor.execute("SELECT id, project FROM sessions WHERE end_time IS NULL")
    active = cursor.fetchone()
    if active:
        print(f"⚠️ 警告：專案 '{active[1]}' 仍在計時中。請先停止它。")
        return

    start_time = datetime.now().isoformat()
    cursor.execute("INSERT INTO sessions (project, rate, start_time) VALUES (?, ?, ?)", 
                   (project, rate, start_time))
    conn.commit()
    conn.close()
    print(f"🚀 開始追蹤專案 '{project}' (時薪: ${rate}/hr)。目前時間: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

def stop_session():
    """停止目前的時間追蹤"""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, project, rate, start_time FROM sessions WHERE end_time IS NULL")
    active = cursor.fetchone()
    if not active:
        print("ℹ️ 目前沒有正在進行中的專案。")
        return

    session_id, project, rate, start_time_str = active
    start_time = datetime.fromisoformat(start_time_str)
    end_time = datetime.now()
    
    # 計算時數與金額
    duration_hours = (end_time - start_time).total_seconds() / 3600
    amount = duration_hours * rate

    cursor.execute('''
        UPDATE sessions 
        SET end_time = ?, duration_hours = ?, amount = ? 
        WHERE id = ?
    ''', (end_time.isoformat(), duration_hours, amount, session_id))
    
    conn.commit()
    conn.close()
    print(f"🛑 停止追蹤專案 '{project}'。")
    print(f"🕒 總計時數: {duration_hours:.2f} 小時")
    print(f"💰 累積金額: ${amount:.2f}")

def generate_invoice(project):
    """生成 HTML 請款單並將紀錄標記為已請款"""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT start_time, end_time, duration_hours, rate, amount, id 
        FROM sessions 
        WHERE project = ? AND end_time IS NOT NULL AND invoiced = 0
    ''', (project,))
    
    records = cursor.fetchall()
    if not records:
        print(f"ℹ️ 專案 '{project}' 目前沒有未請款的紀錄。")
        return

    total_hours = sum(r[2] for r in records)
    total_amount = sum(r[4] for r in records)
    ids_to_update = [r[5] for r in records]

    # 生成 HTML 內容
    html_content = f"""
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
        <meta charset="UTF-8">
        <title>請款單 - {project}</title>
        <style>
            body {{ font-family: 'Helvetica Neue', Arial, sans-serif; margin: 40px auto; max-width: 800px; color: #333; }}
            .header {{ border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }}
            .header h1 {{ margin: 0; color: #2c3e50; }}
            table {{ width: 100%; border-collapse: collapse; margin-bottom: 30px; }}
            th, td {{ border: 1px solid #ddd; padding: 12px; text-align: left; }}
            th {{ background-color: #f8f9fa; font-weight: bold; }}
            .total {{ font-size: 1.2em; font-weight: bold; text-align: right; }}
            .footer {{ text-align: center; color: #7f8c8d; font-size: 0.9em; margin-top: 50px; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>請款單 (Invoice)</h1>
            <p><strong>專案名稱：</strong> {project}</p>
            <p><strong>產出日期：</strong> {datetime.now().strftime('%Y-%m-%d')}</p>
        </div>
        <table>
            <thead>
                <tr>
                    <th>日期</th>
                    <th>開始時間</th>
                    <th>結束時間</th>
                    <th>時數</th>
                    <th>時薪</th>
                    <th>小計</th>
                </tr>
            </thead>
            <tbody>
    """
    
    for r in records:
        st = datetime.fromisoformat(r[0])
        et = datetime.fromisoformat(r[1])
        html_content += f"""
                <tr>
                    <td>{st.strftime('%Y-%m-%d')}</td>
                    <td>{st.strftime('%H:%M')}</td>
                    <td>{et.strftime('%H:%M')}</td>
                    <td>{r[2]:.2f} hr</td>
                    <td>${r[3]:.2f}</td>
                    <td>${r[4]:.2f}</td>
                </tr>
        """
        
    html_content += f"""
            </tbody>
        </table>
        <div class="total">
            <p>總時數：{total_hours:.2f} hr</p>
            <p>總請款金額：${total_amount:.2f}</p>
        </div>
        <div class="footer">
            <p>感謝您的合作！請於收到請款單後 14 日內完成匯款。</p>
        </div>
    </body>
    </html>
    """

    filename = f"Invoice_{project}_{datetime.now().strftime('%Y%m%d')}.html"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(html_content)

    # 將紀錄標記為已請款
    cursor.execute(f"UPDATE sessions SET invoiced = 1 WHERE id IN ({','.join('?' * len(ids_to_update))})", ids_to_update)
    conn.commit()
    conn.close()
    
    print(f"📄 請款單已成功生成：{filename}")
    print("💡 提示：您可以使用瀏覽器開啟該 HTML 檔案，並按下 Ctrl+P (或 Cmd+P) 將其另存為 PDF 格式傳送給客戶。")

if __name__ == "__main__":
    init_db()
    parser = argparse.ArgumentParser(description="FreelanceFlow: 終端機時數追蹤與請款單生成器")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Start command
    parser_start = subparsers.add_parser("start", help="開始追蹤專案時間")
    parser_start.add_argument("project", type=str, help="專案名稱")
    parser_start.add_argument("rate", type=float, help="每小時費率 (金額)")

    # Stop command
    parser_stop = subparsers.add_parser("stop", help="停止目前的時間追蹤")

    # Invoice command
    parser_invoice = subparsers.add_parser("invoice", help="結算並生成 HTML 請款單")
    parser_invoice.add_argument("project", type=str, help="要結算的專案名稱")

    args = parser.parse_args()

    if args.command == "start":
        start_session(args.project, args.rate)
    elif args.command == "stop":
        stop_session()
    elif args.command == "invoice":
        generate_invoice(args.project)