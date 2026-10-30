import React, { useState, useEffect, useRef } from 'react';
import { 
  PenTool, LineChart, Briefcase, Sparkles, Copy, 
  Check, Moon, Sun, Share2, Search, Calculator, 
  AlertCircle, Key, History, Download, Image as ImageIcon
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const SmartContentApp = () => {
  const [activeTab, setActiveTab] = useState('social');
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState('');
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  
  // History State
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('sc_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('openai_api_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('sc_history', JSON.stringify(history));
  }, [history]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // --- Tab 1: Social Media State ---
  const [socialPrompt, setSocialPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [socialResults, setSocialResults] = useState(null);
  const [activePlatform, setActivePlatform] = useState('linkedin');

  const handleGenerateSocial = async () => {
    if (!socialPrompt) return;
    setIsGenerating(true);

    if (!apiKey) {
      // 模擬假資料 (若無 API Key)
      setTimeout(() => {
        const mockResult = {
          linkedin: `🚀 專家觀點：關於「${socialPrompt}」的深度解析\n\n這三個關鍵策略幫助我們的團隊實現了 40% 的成長...\n#領導力 #職涯發展`,
          twitter: `想掌握「${socialPrompt}」的精髓嗎？💡\n1️⃣ 持續學習\n2️⃣ 擁抱改變\n#科技 #趨勢`,
          instagram: `✨ 突破自我：${socialPrompt} ✨\n\n告訴我，你最近遇到最大的挑戰是什麼？\n#靈感 #日常 #生活風格`,
          facebook: `🎉 深入探討「${socialPrompt}」！\n其實最關鍵的秘訣就在於持之以恆...\n歡迎轉發分享！🙌`,
          imagePrompt: "A futuristic workspace with holographic displays showing social media metrics, cinematic lighting, photorealistic, 8k, ultra-detailed --ar 16:9"
        };
        setSocialResults(mockResult);
        setHistory([{ type: 'social', prompt: socialPrompt, date: new Date().toLocaleString(), data: mockResult }, ...history]);
        setIsGenerating(false);
        showToast('已使用模擬資料生成（請設定 API Key 啟用真實 AI）');
      }, 1500);
      return;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'system',
            content: `你是一個專業的社群行銷專家。請根據用戶提供的主題，生成對應的社群貼文。
            必須嚴格依照以下 JSON 格式回傳：
            {
              "linkedin": "專業、職涯導向長文",
              "twitter": "簡潔、條列式短文(包含emoji)",
              "instagram": "高互動、視覺導向圖文與多個hashtag",
              "facebook": "口語化、引發共鳴的長文",
              "imagePrompt": "適合搭配此貼文的 Midjourney 英文算圖提示詞 (Prompt)"
            }`
          }, {
            role: 'user',
            content: `請幫我寫關於「${socialPrompt}」的貼文。`
          }],
          response_format: { type: "json_object" }
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      
      const result = JSON.parse(data.choices[0].message.content);
      setSocialResults(result);
      setHistory([{ type: 'social', prompt: socialPrompt, date: new Date().toLocaleString(), data: result }, ...history]);
      showToast('AI 內容生成完畢！');
    } catch (error) {
      showToast(`錯誤：${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Tab 2: SEO Article State ---
  const [seoKeyword, setSeoKeyword] = useState('數位轉型');
  const [seoContent, setSeoContent] = useState('');
  const [seoStats, setSeoStats] = useState({ words: 0, density: 0, readability: 0, score: 0 });

  useEffect(() => {
    const words = seoContent.trim() ? seoContent.trim().split(/\s+/).length : 0;
    const keywordCount = (seoContent.match(new RegExp(seoKeyword, 'gi')) || []).length;
    const density = words > 0 ? ((keywordCount / words) * 100).toFixed(1) : 0;
    
    let score = 40;
    if (words > 50) score += 20;
    if (density > 1 && density < 5) score += 20;
    if (seoContent.includes('#') || seoContent.includes('\n\n')) score += 20;

    setSeoStats({
      words, density, readability: Math.min(100, words > 0 ? 60 + (words * 0.5) : 0), score: Math.min(100, score)
    });
  }, [seoContent, seoKeyword]);

  // --- Tab 3: Commercial State ---
  const [postsPerMonth, setPostsPerMonth] = useState(20);
  const [articlesPerMonth, setArticlesPerMonth] = useState(4);
  const [hourlyRate, setHourlyRate] = useState(1000);
  const quoteRef = useRef(null);

  const traditionalHours = (postsPerMonth * 1) + (articlesPerMonth * 5);
  const aiHours = (postsPerMonth * 0.2) + (articlesPerMonth * 1);
  const costTraditional = traditionalHours * hourlyRate;
  const costAi = aiHours * hourlyRate;
  const suggestedRetainer = Math.round(costAi * 2.5);

  const exportPDF = async () => {
    if (!quoteRef.current) return;
    try {
      const canvas = await html2canvas(quoteRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('行銷專案報價單.pdf');
      showToast('報價單 PDF 已匯出！');
    } catch (err) {
      showToast('匯出失敗');
    }
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 z-50 animate-bounce">
          <Check size={18} /> {toast}
        </div>
      )}

      {/* Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Sparkles className="text-blue-500" size={32} />
          <h1 className="text-2xl font-bold tracking-tight">SmartContent AI</h1>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Key size={16} className="text-gray-400" />
            <input 
              type="password"
              placeholder="OpenAI API Key (選填)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className={`text-sm p-1.5 rounded border outline-none ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}
            />
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-2">
          <NavButton active={activeTab === 'social'} onClick={() => setActiveTab('social')} icon={<Share2 />} label="多平台社群生成" darkMode={darkMode} />
          <NavButton active={activeTab === 'seo'} onClick={() => setActiveTab('seo')} icon={<Search />} label="SEO 實時檢測寫作" darkMode={darkMode} />
          <NavButton active={activeTab === 'commercial'} onClick={() => setActiveTab('commercial')} icon={<Calculator />} label="接案報價算股器" darkMode={darkMode} />
          <NavButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History />} label="歷史生成紀錄" darkMode={darkMode} />
        </aside>

        {/* Workspace */}
        <section className={`lg:col-span-9 rounded-xl p-6 shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          
          {/* TAB 1: Social */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2"><PenTool size={20}/> 智能社群貼文與算圖提示生成</h2>
              <div className="space-y-3">
                <textarea 
                  value={socialPrompt}
                  onChange={(e) => setSocialPrompt(e.target.value)}
                  placeholder="輸入想寫的主題，例如：2024 AI 工具對設計師的影響..."
                  className={`w-full p-4 rounded-lg border h-28 outline-none ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-300'}`}
                />
                <button 
                  onClick={handleGenerateSocial}
                  disabled={isGenerating || !socialPrompt}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? 'AI 思考中...' : <><Sparkles size={18}/> 啟動多平台生成</>}
                </button>
              </div>

              {socialResults && (
                <div className="mt-8 space-y-6">
                  {/* Image Prompt Section */}
                  <div className={`p-4 rounded-lg border ${darkMode ? 'bg-indigo-900/30 border-indigo-800' : 'bg-indigo-50 border-indigo-100'}`}>
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-indigo-500 mb-2">
                      <ImageIcon size={16}/> AI 算圖提示詞 (Midjourney/DALL-E)
                    </h3>
                    <p className="text-sm font-mono select-all">{socialResults.imagePrompt}</p>
                  </div>

                  <div className="border-t pt-6 border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2 mb-4">
                      {['linkedin', 'twitter', 'instagram', 'facebook'].map(plat => (
                        <button
                          key={plat}
                          onClick={() => setActivePlatform(plat)}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${activePlatform === plat ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                          {plat}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <textarea 
                        readOnly
                        value={socialResults[activePlatform]}
                        className={`w-full p-4 rounded-lg border h-64 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-300'}`}
                      />
                      <button 
                        onClick={() => { navigator.clipboard.writeText(socialResults[activePlatform]); showToast('已複製！'); }}
                        className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-md shadow border hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2"><LineChart size={20}/> 實時 SEO 文章編輯器</h2>
              <input 
                type="text" 
                value={seoKeyword}
                onChange={(e) => setSeoKeyword(e.target.value)}
                placeholder="目標關鍵字"
                className={`w-1/3 p-2 rounded-md border outline-none ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-300'}`}
              />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <textarea 
                  value={seoContent}
                  onChange={(e) => setSeoContent(e.target.value)}
                  placeholder="開始撰寫您的文章，系統將自動偵測關鍵字頻率..."
                  className={`md:col-span-3 w-full p-4 rounded-lg border h-[400px] outline-none ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-300'}`}
                />
                <div className="space-y-4">
                  <MetricCard title="SEO 評分" value={seoStats.score} suffix="/100" isScore darkMode={darkMode}/>
                  <MetricCard title="字數" value={seoStats.words} darkMode={darkMode}/>
                  <MetricCard title="關鍵字密度" value={seoStats.density} suffix="%" alert={seoStats.density > 5 ? "密度過高" : ""} darkMode={darkMode}/>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Commercial */}
          {activeTab === 'commercial' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2"><Briefcase size={20}/> 接案報價與 ROI 算股器</h2>
                <button onClick={exportPDF} className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 hover:bg-gray-700">
                  <Download size={16}/> 匯出報價單 PDF
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div><label className="text-sm">月貼文數</label><input type="number" value={postsPerMonth} onChange={(e)=>setPostsPerMonth(Number(e.target.value))} className="w-full p-2 border rounded mt-1 text-black" /></div>
                <div><label className="text-sm">月SEO文章</label><input type="number" value={articlesPerMonth} onChange={(e)=>setArticlesPerMonth(Number(e.target.value))} className="w-full p-2 border rounded mt-1 text-black" /></div>
                <div><label className="text-sm">時薪(NTD)</label><input type="number" value={hourlyRate} onChange={(e)=>setHourlyRate(Number(e.target.value))} className="w-full p-2 border rounded mt-1 text-black" /></div>
              </div>

              {/* Printable PDF Area */}
              <div ref={quoteRef} className={`p-8 rounded-xl border bg-white text-gray-900 mt-6`}>
                <h1 className="text-2xl font-bold border-b pb-4 mb-6">社群內容行銷代操報價單</h1>
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold text-gray-500 mb-2">專案交付內容 (每月)</h3>
                    <ul className="list-disc ml-5 space-y-1">
                      <li>社群多平台貼文：{postsPerMonth} 篇</li>
                      <li>SEO 優化長文：{articlesPerMonth} 篇</li>
                      <li>AI 算圖/視覺規劃：包含</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500 mb-2">傳統工時預估對照</h3>
                    <p>傳統製作工時：{traditionalHours} 小時</p>
                    <p>AI 協作工時：{aiHours} 小時</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg text-right">
                  <p className="text-gray-500">專案總計報價 (NTD)</p>
                  <p className="text-4xl font-bold text-blue-600 mt-2">$ {suggestedRetainer.toLocaleString()}</p>
                  <p className="text-sm text-gray-400 mt-2">* 報價單自動生成自 SmartContent AI</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: History */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2"><History size={20}/> 歷史生成紀錄</h2>
                <button onClick={() => setHistory([])} className="text-red-500 text-sm hover:underline">清除全部紀錄</button>
              </div>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {history.length === 0 ? <p className="text-gray-500">尚無紀錄</p> : 
                  history.map((item, idx) => (
                    <div key={idx} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded capitalize">{item.type}</span>
                        <span>{item.date}</span>
                      </div>
                      <p className="font-medium mb-2">{item.prompt}</p>
                      <p className="text-sm text-gray-400 line-clamp-2">{item.data?.linkedin || item.data}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label, darkMode }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${active ? 'bg-blue-600 text-white' : `hover:bg-gray-200 ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600'}`}`}>
    {icon} {label}
  </button>
);

const MetricCard = ({ title, value, suffix, alert, darkMode, isScore }) => (
  <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
    <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
    <div className="flex items-baseline gap-1">
      <span className={`text-2xl font-bold ${isScore ? (value > 70 ? 'text-green-500' : value > 40 ? 'text-yellow-500' : 'text-red-500') : ''}`}>{value}</span>
      <span className="text-sm text-gray-500">{suffix}</span>
    </div>
    {alert && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/> {alert}</p>}
  </div>
);

export default SmartContentApp;