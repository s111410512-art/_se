import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  Beaker, 
  Globe, 
  MonitorPlay, 
  Clock, 
  Terminal,
  Activity,
  Check,
  LayoutTemplate
} from 'lucide-react';

// --- Mock Data Definitions ---
const TEST_DATA = {
  unit: {
    id: 'unit',
    title: '單元測試 (Unit Testing)',
    icon: Beaker,
    description: '針對 Client 端 (React) 與 Server 端 (Rust, Node.js) 的獨立軟體元件進行隔離測試，確保個別邏輯與函式運作正常。',
    duration: '0.85s',
    cases: [
      { name: '[Rust Server] auth::crypto::verify_password - validates hash match correctly', status: 'pass', time: '1ms' },
      { name: '[Rust Server] models::user::create - panics on invalid email format', status: 'pass', time: '2ms' },
      { name: '[Node.js Server] UserService.calculateStats() - returns correct data aggregation', status: 'pass', time: '15ms' },
      { name: '[React Client] <UserProfile /> component - renders user avatar when provided', status: 'pass', time: '45ms' },
      { name: '[React Client] useAuth hook - transitions state to loading during fetch', status: 'pass', time: '12ms' }
    ]
  },
  api: {
    id: 'api',
    title: '系統測試 (Web API Testing)',
    icon: Globe,
    description: '驗證系統的 Web API 端點是否符合規格，確保前後端整合、HTTP 狀態碼返回及資料庫互動正確無誤。',
    duration: '2.14s',
    cases: [
      { name: 'GET /api/v1/products - returns 200 OK and valid JSON array', status: 'pass', time: '240ms' },
      { name: 'POST /api/v1/auth/login - authenticates user and returns JWT token', status: 'pass', time: '315ms' },
      { name: 'GET /api/v1/users/profile - returns 401 Unauthorized without token', status: 'pass', time: '120ms' },
      { name: 'PUT /api/v1/orders/:id - updates order status to "shipped"', status: 'pass', time: '405ms' },
      { name: 'DELETE /api/v1/sessions - clears all active sessions and returns 204', status: 'pass', time: '185ms' }
    ]
  },
  e2e: {
    id: 'e2e',
    title: 'E2E 測試 (Playwright 無頭瀏覽器)',
    icon: MonitorPlay,
    description: '使用 Playwright 控制無頭瀏覽器 (Headless Browser) 模擬真實使用者的操作流程，驗證前端到後端的完整系統運作。',
    duration: '18.4s',
    cases: [
      { name: 'Playwright: browser.newPage() & navigate to login page', status: 'pass', time: '2.1s' },
      { name: 'Playwright: fill credentials and await page.waitForNavigation()', status: 'pass', time: '3.4s' },
      { name: 'Playwright: page.locator(".cart-add").click() - adds item to cart', status: 'pass', time: '1.8s' },
      { name: 'Playwright: assert expect(page.locator(".toast")).toHaveText("Success")', status: 'pass', time: '4.5s' },
      { name: 'Playwright: page.waitForSelector(".checkout-btn") - complete order', status: 'pass', time: '6.6s'}
    ]
  }
};

// --- Components ---

const SidebarItem = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}
  >
    <Icon size={20} className={active ? 'text-emerald-400' : 'text-slate-400'} />
    <span className="font-medium">{label}</span>
  </button>
);

const TestRunner = ({ data }) => {
  const [status, setStatus] = useState('idle'); // idle, running, complete
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  // Reset state when tab changes
  useEffect(() => {
    setStatus('idle');
    setProgress(0);
    setLogs([]);
  }, [data.id]);

  const runTests = () => {
    setStatus('running');
    setProgress(0);
    setLogs([{ text: `Starting ${data.title} suite...`, type: 'info' }]);

    const totalTime = 2000; // 2 seconds simulation
    const intervalTime = 50;
    const steps = totalTime / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(currentProgress);

      if (currentStep === Math.floor(steps * 0.2)) {
        setLogs(prev => [...prev, { text: 'Initializing test environment...', type: 'info' }]);
      } else if (currentStep === Math.floor(steps * 0.5)) {
        setLogs(prev => [...prev, { text: `Running ${data.cases.length} test specs...`, type: 'info' }]);
      } else if (currentStep === Math.floor(steps * 0.8)) {
        setLogs(prev => [...prev, { text: 'Compiling results and generating report...', type: 'info' }]);
      }

      if (currentStep >= steps) {
        clearInterval(interval);
        setStatus('complete');
        setLogs(prev => [...prev, { text: 'Test suite completed.', type: 'success' }]);
      }
    }, intervalTime);
  };

  const totalTests = data.cases.length;
  const passedTests = data.cases.filter(c => c.status === 'pass').length;
  const failedTests = data.cases.filter(c => c.status === 'fail').length;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
            <data.icon size={28} className="text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">{data.title}</h2>
        </div>
        <p className="text-slate-400 max-w-3xl leading-relaxed text-lg">
          {data.description}
        </p>
      </div>

      {/* Action & Status Card */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={runTests}
              disabled={status === 'running'}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                status === 'running'
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:-translate-y-0.5'
              }`}
            >
              {status === 'running' ? (
                <Activity className="animate-pulse" size={20} />
              ) : (
                <Play size={20} fill="currentColor" />
              )}
              <span>{status === 'running' ? 'Running Tests...' : 'Run Test Suite'}</span>
            </button>
            
            {status !== 'idle' && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                status === 'running' 
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {status === 'running' ? 'In Progress' : 'Completed'}
              </span>
            )}
          </div>

          {/* Progress Indicator */}
          {status === 'running' && (
            <div className="w-full md:w-1/2 flex items-center space-x-4">
              <div className="text-sm font-medium text-slate-400 w-12 text-right">
                {Math.round(progress)}%
              </div>
              <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-75 ease-linear relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress-stripes_1s_linear_infinite]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {status === 'complete' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
          
          {/* Summary Stats */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Execution Summary</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                  <div className="text-3xl font-bold text-white mb-1">{totalTests}</div>
                  <div className="text-sm text-slate-400">Total Tests</div>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                  <div className="text-3xl font-bold text-slate-300 mb-1 flex items-center space-x-2">
                    <Clock size={20} className="text-slate-500"/>
                    <span>{data.duration}</span>
                  </div>
                  <div className="text-sm text-slate-400">Duration</div>
                </div>
                <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-900/50">
                  <div className="text-3xl font-bold text-emerald-400 mb-1">{passedTests}</div>
                  <div className="text-sm text-emerald-500/80">Passed</div>
                </div>
                <div className="bg-red-900/20 p-4 rounded-lg border border-red-900/50">
                  <div className="text-3xl font-bold text-red-400 mb-1">{failedTests}</div>
                  <div className="text-sm text-red-500/80">Failed</div>
                </div>
              </div>

              {/* Console Output */}
              <div className="bg-[#0D1117] rounded-lg border border-slate-700 p-3 font-mono text-xs text-slate-300 h-32 overflow-y-auto">
                {logs.map((log, idx) => (
                  <div key={idx} className="mb-1">
                    <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                    <span className={log.type === 'info' ? 'text-blue-300' : 'text-emerald-400'}>
                      {log.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Test Cases */}
          <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-700 bg-slate-800/80 flex items-center justify-between">
              <h3 className="font-semibold text-slate-200">Test Specifications</h3>
              <div className="flex space-x-2">
                <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                  <Check size={12} className="mr-1" /> {passedTests} Pass
                </span>
                <span className="flex items-center text-xs font-medium text-red-400 bg-red-400/10 px-2 py-1 rounded">
                  <XCircle size={12} className="mr-1" /> {failedTests} Fail
                </span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {data.cases.map((testCase, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-lg border border-transparent hover:border-slate-700 hover:bg-slate-700/30 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {testCase.status === 'pass' ? (
                          <CheckCircle2 size={18} className="text-emerald-400" />
                        ) : (
                          <XCircle size={18} className="text-red-400" />
                        )}
                      </div>
                      <div>
                        <span className={`text-sm font-medium ${testCase.status === 'fail' ? 'text-red-300' : 'text-slate-300'}`}>
                          {testCase.name}
                        </span>
                        {testCase.error && (
                          <div className="mt-2 text-xs font-mono text-red-400/80 bg-red-950/30 p-2 rounded border border-red-900/30">
                            {testCase.error}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-500 whitespace-nowrap ml-4">
                      {testCase.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('unit');

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 flex flex-col md:flex-row overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-slate-900/50 border-r border-slate-800 flex-shrink-0 flex flex-col">
        <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Terminal size={18} />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            DevTest Pro
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2 mt-4">
            Test Suites
          </div>
          <SidebarItem 
            active={activeTab === 'unit'} 
            icon={Beaker} 
            label="單元測試 (Client/Server)" 
            onClick={() => setActiveTab('unit')} 
          />
          <SidebarItem 
            active={activeTab === 'api'} 
            icon={Globe} 
            label="系統測試 (Web API)" 
            onClick={() => setActiveTab('api')} 
          />
          <SidebarItem 
            active={activeTab === 'e2e'} 
            icon={MonitorPlay} 
            label="E2E 測試 (Playwright)" 
            onClick={() => setActiveTab('e2e')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-center space-x-2">
          <LayoutTemplate size={14} />
          <span>v2.4.1 (Stable)</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#0B1120] to-[#0B1120]">
        
        {/* Decorative background grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWUzYTg1IiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-20 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 h-full">
          <TestRunner key={activeTab} data={TEST_DATA[activeTab]} />
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress-stripes {
          from { background-position: 1rem 0; }
          to { background-position: 0 0; }
        }
      `}} />
    </div>
  );
}