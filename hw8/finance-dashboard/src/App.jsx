import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, PlusCircle, Trash2 } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const EXPENSE_CATEGORIES = ['飲食', '交通', '居住', '娛樂', '購物', '其他'];
const INCOME_CATEGORIES = ['薪資', '投資', '獎金', '其他'];

export default function App() {
  // 從 Local Storage 初始化資料
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance_data');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '飲食',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  // 當資料改變時，儲存到 Local Storage
  useEffect(() => {
    localStorage.setItem('finance_data', JSON.stringify(transactions));
  }, [transactions]);

  // 處理表單輸入
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // 如果切換收支類型，自動重置為該類型的第一個分類
      ...(name === 'type' && {
        category: value === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]
      })
    }));
  };

  // 新增紀錄
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || isNaN(formData.amount)) return;

    const newTransaction = {
      id: crypto.randomUUID(),
      ...formData,
      amount: parseFloat(formData.amount)
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setFormData(prev => ({ ...prev, amount: '', description: '' }));
  };

  // 刪除紀錄
  const handleDelete = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // 計算統計數據
  const { totalIncome, totalExpense, balance, chartData } = useMemo(() => {
    let income = 0;
    let expense = 0;
    const categoryTotals = {};

    transactions.forEach(t => {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expense += t.amount;
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      }
    });

    const chart = Object.keys(categoryTotals).map(key => ({
      name: key,
      value: categoryTotals[key]
    })).sort((a, b) => b.value - a.value); // 依金額排序

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      chartData: chart
    };
  }, [transactions]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* 標題 */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Wallet className="w-8 h-8 text-blue-600" />
            個人財務與記帳管理儀表板
          </h1>
          <p className="text-gray-500 mt-2">隨時掌握您的收支狀況，資料安全儲存於您的瀏覽器中。</p>
        </header>

        {/* 總覽卡片區 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 font-medium">總結餘</h3>
              <Wallet className="text-blue-500 w-6 h-6" />
            </div>
            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-gray-800' : 'text-red-500'}`}>
              $ {balance.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 font-medium">總收入</h3>
              <TrendingUp className="text-emerald-500 w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-emerald-600">$ {totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 font-medium">總支出</h3>
              <TrendingDown className="text-red-500 w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-red-600">$ {totalExpense.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 左側：新增表單與圓餅圖 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 新增紀錄表單 */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">新增紀錄</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'type', value: 'expense' } })}
                    className={`py-2 rounded-lg font-medium transition-colors ${formData.type === 'expense' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                  >
                    支出
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'type', value: 'income' } })}
                    className={`py-2 rounded-lg font-medium transition-colors ${formData.type === 'income' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                  >
                    收入
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分類</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {(formData.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">金額</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="請輸入金額"
                    min="1"
                    className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">備註 (選填)</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="例如：午餐、捷運..."
                    className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <PlusCircle className="w-5 h-5" />
                  新增紀錄
                </button>
              </form>
            </div>

            {/* 支出分析圖表 */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">支出結構分析</h2>
              {chartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$ ${value.toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  尚無支出資料可供分析
                </div>
              )}
            </div>
          </div>

          {/* 右側：歷史紀錄列表 */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">近期紀錄</h2>
            
            {transactions.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                目前還沒有任何記帳紀錄，趕快新增第一筆吧！
              </div>
            ) : (
              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
                {transactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${t.type === 'expense' ? 'bg-red-100 text-red-500' : 'bg-emerald-100 text-emerald-500'}`}>
                        {t.type === 'expense' ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{t.category}</div>
                        <div className="text-sm text-gray-500 flex gap-2">
                          <span>{t.date}</span>
                          {t.description && <span>• {t.description}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`font-bold ${t.type === 'expense' ? 'text-red-600' : 'text-emerald-600'}`}>
                        {t.type === 'expense' ? '-' : '+'}$ {t.amount.toLocaleString()}
                      </span>
                      <button 
                        onClick={() => handleDelete(t.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                        title="刪除紀錄"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}