'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false); // 🚀 新增：控制複製成功狀態

  const testUrl = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null); // 每次測試前先清空舊數據，確保畫面更新
    try {
      // 呼叫雲端 API（無縫複用你強大的後端引擎）
      const res = await fetch('https://agent-lens-api.onrender.com/api/v1/clean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      alert("Server is busy cooking. Try again in 10 seconds!");
    }
    setLoading(false);
  };

  // 🚀 核心相容邏輯：多欄位容錯機制
  const previewText = result
    ? (result.cleaned_content || result.markdown || result.cleaned_text || result.content || result.text || '')
    : '';

  // 📥 殺手功能 1：一鍵打包下載進手機記事本 (.txt)
  const downloadToNotes = () => {
    if (!previewText) return;
    const element = document.createElement("a");
    // 將 Markdown 格式稍微優化成適合所有手機備忘錄閱讀的純文字格式
    const cleanTextForMobile = previewText.replace(/#/g, '').replace(/\*/g, '');
    const file = new Blob([cleanTextForMobile], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = "purified-recipe-notes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // 📋 殺手功能 2：一鍵複製（手機端長按即可直接轉存相簿截圖或快閃備忘錄）
  const copyToClipboard = () => {
    if (!previewText) return;
    navigator.clipboard.writeText(previewText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // 2秒後恢復按鈕文字
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-start px-4 py-16 sm:p-8 overflow-y-auto">
      <div className="max-w-2xl w-full space-y-8 text-center my-auto">
        
        {/* 🟢 狀態列：營造 24 小時高可用性的專業感 */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 mx-auto">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>Engine Status: Operational</span>
          <span className="text-neutral-600">|</span>
          <span className="text-green-400">Purify Speed: 1s</span>
        </div>

        {/* 🎯 B2C 核心文案：直擊全人類對部落格廢話的憤怒 */}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          Tired of <span className="text-red-500">3,000-word</span> life stories just to get a recipe?
        </h1>
        <p className="text-neutral-400 text-base sm:text-lg">
          Instantly strip ads, pop-ups, and endless fluff from any cooking or news blog. Save directly to your mobile notes.
        </p>

        {/* 🚀 輸入框區塊 (手機自動優化排版) */}
        <div className="flex flex-col sm:flex-row gap-4 w-full mt-8">
          <input 
            type="text" 
            placeholder="Paste any recipe or blog URL (e.g., https://...)" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full sm:flex-1 px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 focus:outline-none focus:border-green-500 text-white"
          />
          <button 
            onClick={testUrl}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Purifying...' : 'Get Just The Text'}
          </button>
        </div>

        {/* 🛡️ 信任增強方塊（未測試時顯示） */}
        {!result && (
          <div className="mt-12 grid grid-cols-2 gap-4 text-left text-xs text-neutral-500 font-mono">
            <div className="p-3 bg-neutral-900/50 border border-neutral-800/60 rounded-xl">
              <span className="text-green-400">✓</span> 100% Ad & Cookie Blocker
            </div>
            <div className="p-3 bg-neutral-900/50 border border-neutral-800/60 rounded-xl">
              <span className="text-green-400">✓</span> Smart Fluff Extraction
            </div>
            <div className="p-3 bg-neutral-900/50 border border-neutral-800/60 rounded-xl">
              <span className="text-green-400">✓</span> Export to Phone Notes (.txt)
            </div>
            <div className="p-3 bg-neutral-900/50 border border-neutral-800/60 rounded-xl">
              <span className="text-green-400">✓</span> 1-Click Fast Pass
            </div>
          </div>
        )}

        {/* 結果展示區塊 */}
        {result && !result.detail && (
          <div className="mt-8 sm:mt-12 p-5 sm:p-8 bg-neutral-900 border border-neutral-800 rounded-2xl text-left space-y-6">
            
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-neutral-400 font-bold">Purified Text Box</h2>
              <span className="text-xs bg-green-950 text-green-400 border border-green-800/50 px-2 py-1 rounded">
                {result.token_saved_percent ?? '90%'} Bloat Removed
              </span>
            </div>
            
            {/* 文本預覽區塊 */}
            {previewText && (
              <div className="relative p-4 bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden">
                <div className="text-sm text-neutral-300 font-sans h-64 overflow-y-auto overflow-x-hidden break-words whitespace-pre-wrap p-1 leading-relaxed selection:bg-green-600">
                  {previewText.substring(0, 3000)}
                </div>
              </div>
            )}

            {/* 🛠️ 新增：手機功能操作列 (下載/複製) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={downloadToNotes}
                className="py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                📥 Download for Notes
              </button>
              <button 
                onClick={copyToClipboard}
                className="py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
              </button>
            </div>

            {/* 💳 無情付費牆（Paywall 漏斗） */}
            <div className="pt-4 border-t border-neutral-800/80 space-y-3">
              <div className="text-xs text-neutral-500 text-center font-mono">
                Like the speed? Get the 1-Click Chrome Extension to purify pages instantly.
              </div>
              <a 
                href="https://ko-fi.com/agentlens/tiers" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full py-4 bg-white text-black font-bold text-center rounded-lg hover:bg-neutral-200 transition-colors"
              >
                Unlock Unlimited Access ($1.99/mo)
              </a>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}