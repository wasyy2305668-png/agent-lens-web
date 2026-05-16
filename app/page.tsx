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
      alert("API is currently sleeping or unavailable. Try again in 30s!");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8 text-center">
        
        <h1 className="text-5xl font-bold tracking-tight">
          You are wasting <span className="text-red-500">90%</span> of your AI API budget.
        </h1>
        <p className="text-neutral-400 text-lg">
          Stop feeding LLMs raw HTML. Enter any URL to see how much context window AgentLens can save your AI Agent.
        </p>

        {/* 輸入框區塊 */}
        <div className="flex gap-4 w-full mt-8">
          <input 
            type="text" 
            placeholder="e.g., https://yahoo.com" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 focus:outline-none focus:border-green-500"
          />
          <button 
            onClick={testUrl}
            disabled={loading}
            className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Analyzing...' : 'Test Token Savings'}
          </button>
        </div>

        {/* 結果展示區塊 */}
        {result && !result.detail && (
          <div className="mt-12 p-8 bg-neutral-900 border border-neutral-800 rounded-2xl animate-fade-in text-left">
            <h2 className="text-xl text-neutral-400 mb-6">Extraction Report</h2>
            
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800/50">
                <div className="text-sm text-neutral-500">Raw HTML</div>
                <div className="text-2xl font-mono text-red-400 mt-1">{result.original_size_bytes} b</div>
              </div>
              <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800/50">
                <div className="text-sm text-neutral-500">Cleaned Markdown</div>
                <div className="text-2xl font-mono text-green-400 mt-1">{result.cleaned_size_bytes} b</div>
              </div>
              <div className="p-4 border border-green-500/30 bg-green-950/20 rounded-lg">
                <div className="text-sm text-green-500">Tokens Saved</div>
                <div className="text-3xl font-bold text-green-400 mt-1">{result.token_saved_percent}</div>
              </div>
            </div>

            {/* 自證清白的文本預覽區塊 (提取前 300 字元) */}
            {(result.cleaned_content || result.markdown) && (
              <div className="mb-8 p-4 bg-neutral-950 rounded-lg border border-neutral-800">
                <div className="text-xs text-neutral-500 mb-2 uppercase tracking-wider">Markdown Preview (What your LLM sees)</div>
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
              Get Production API Key ($29/mo)
            </a>
          </div>
        )}

      </div>
    </main>
  );
}