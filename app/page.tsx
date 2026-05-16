'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testUrl = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null); // 每次測試前先清空舊數據，確保畫面更新
    try {
      // 呼叫雲端 API
      const res = await fetch('https://agent-lens-api.onrender.com/api/v1/clean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      alert("API is currently sleeping or unavailable. Try again in 30s!");
    }
    setLoading(false);
  };

  // 🚀 核心相容邏輯：多欄位容錯機制
  const previewText = result
    ? (result.cleaned_content || result.markdown || result.cleaned_text || result.content || result.text || '')
    : '';

  return (
    // 🛡️ 修正：將 p-8 改為 px-4 sm:px-8，避免手機左右留白吃掉太多空間
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-start px-4 py-16 sm:p-8 overflow-y-auto">
      <div className="max-w-2xl w-full space-y-8 text-center my-auto">
        
        {/* 🛡️ 修正：標題在手機上稍微縮小，避免單字被切斷 */}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          You are wasting <span className="text-red-500">90%</span> of your AI API budget.
        </h1>
        <p className="text-neutral-400 text-base sm:text-lg">
          Stop feeding LLMs raw HTML. Enter any URL to see how much context window AgentLens can save your AI Agent.
        </p>

        {/* 🚀 修正：輸入框區塊 (手機: 上下疊加 / 電腦: 左右並排) */}
        <div className="flex flex-col sm:flex-row gap-4 w-full mt-8">
          <input 
            type="text" 
            placeholder="e.g., https://yahoo.com" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full sm:flex-1 px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 focus:outline-none focus:border-green-500 text-white"
          />
          <button 
            onClick={testUrl}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Analyzing...' : 'Test Token Savings'}
          </button>
        </div>

        {/* 結果展示區塊 */}
        {result && !result.detail && (
          // 🛡️ 修正：手機板 padding 縮小，騰出空間給內容
          <div className="mt-8 sm:mt-12 p-5 sm:p-8 bg-neutral-900 border border-neutral-800 rounded-2xl text-left space-y-6">
            <h2 className="text-xl text-neutral-400">Extraction Report</h2>
            
            {/* 🚀 修正：數據分析方塊 (手機: 1直排 / 電腦: 3橫排) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800/50">
                <div className="text-sm text-neutral-500">Raw HTML</div>
                <div className="text-2xl font-mono text-red-400 mt-1">{result.original_size_bytes ?? '0'} b</div>
              </div>
              <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800/50">
                <div className="text-sm text-neutral-500">Cleaned Markdown</div>
                <div className="text-2xl font-mono text-green-400 mt-1">{result.cleaned_size_bytes ?? '0'} b</div>
              </div>
              <div className="p-4 border border-green-500/30 bg-green-950/20 rounded-lg">
                <div className="text-sm text-green-500">Tokens Saved</div>
                <div className="text-3xl font-bold text-green-400 mt-1">{result.token_saved_percent ?? '0%'}</div>
              </div>
            </div>

            {/* 文本預覽區塊 */}
            {previewText && (
              <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden">
                <div className="text-xs text-neutral-500 mb-2 uppercase tracking-wider">Markdown Preview (What your LLM sees)</div>
                {/* 🛡️ 確保文本不會撐爆容器 */}
                <div className="text-sm text-neutral-400 font-mono h-48 overflow-y-auto overflow-x-hidden break-words whitespace-pre-wrap p-1">
                  {previewText.substring(0, 3000)}...
                </div>
              </div>
            )}

            {/* 真正的印鈔機連結 */}
            <a 
              href="https://ko-fi.com/agentlens/tiers" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full py-4 bg-white text-black font-bold text-center rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Get Production API Key ($29/mo)
            </a>
          </div>
        )}

      </div>
    </main>
  );
}