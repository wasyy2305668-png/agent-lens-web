'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testUrl = async () => {
    if (!url) return;
    setLoading(true);
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
      alert("API 沒開或是壞了！");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8 text-center">
        
        <h1 className="text-5xl font-bold tracking-tight">
          你正在浪費 <span className="text-red-500">90%</span> 的 AI API 費用
        </h1>
        <p className="text-neutral-400 text-lg">
          輸入目標網址，看看 AgentLens 能幫你的 AI Agent 省下多少 Token。
        </p>

        {/* 輸入框區塊 */}
        <div className="flex gap-4 w-full mt-8">
          <input 
            type="text" 
            placeholder="輸入任何亂七八糟的網址 (例如: https://yahoo.com)" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 focus:outline-none focus:border-green-500"
          />
          <button 
            onClick={testUrl}
            disabled={loading}
            className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? '計算中...' : '測試省錢率'}
          </button>
        </div>

        {/* 結果展示區塊 */}
        {result && !result.detail && (
          <div className="mt-12 p-8 bg-neutral-900 border border-neutral-800 rounded-2xl animate-fade-in text-left">
            <h2 className="text-xl text-neutral-400 mb-6">測試報告</h2>
            
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800/50">
                <div className="text-sm text-neutral-500">原始大小</div>
                <div className="text-2xl font-mono text-red-400 mt-1">{result.original_size_bytes} b</div>
              </div>
              <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800/50">
                <div className="text-sm text-neutral-500">清洗後</div>
                <div className="text-2xl font-mono text-green-400 mt-1">{result.cleaned_size_bytes} b</div>
              </div>
              <div className="p-4 border border-green-500/30 bg-green-950/20 rounded-lg">
                <div className="text-sm text-green-500">幫你省下</div>
                <div className="text-3xl font-bold text-green-400 mt-1">{result.token_saved_percent}</div>
              </div>
            </div>

            {/* 自證清白的文本預覽區塊 (提取前 300 字元) */}
            {(result.cleaned_content || result.markdown) && (
              <div className="mb-8 p-4 bg-neutral-950 rounded-lg border border-neutral-800">
                <div className="text-xs text-neutral-500 mb-2 uppercase tracking-wider">乾淨數據預覽 (給 AI 看的精華)</div>
                <div className="text-sm text-neutral-400 font-mono h-32 overflow-y-auto break-all whitespace-pre-wrap">
                  {(result.cleaned_content || result.markdown).substring(0, 300)}...
                </div>
              </div>
            )}

            {/* 🚀 真正的印鈔機連結 */}
            <a 
              href="https://ko-fi.com/agentlens/tiers" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full py-4 bg-white text-black font-bold text-center rounded-lg hover:bg-neutral-200 transition-colors"
            >
              馬上訂閱取得 API Key ($29/mo)
            </a>
          </div>
        )}

      </div>
    </main>
  );
}