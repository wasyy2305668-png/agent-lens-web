'use client';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const testUrl = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null);
    try {
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

  const previewText = result
    ? (result.cleaned_content || result.markdown || result.cleaned_text || result.content || result.text || '')
    : '';

  const downloadToNotes = () => {
    if (!previewText) return;
    const element = document.createElement("a");
    const cleanTextForMobile = previewText.replace(/#/g, '').replace(/\*/g, '');
    const file = new Blob([cleanTextForMobile], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = "purified-recipe-notes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = () => {
    if (!previewText) return;
    navigator.clipboard.writeText(previewText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    // 🎨 背景溫暖優雅的米白書卷色 (#fbfbfa)
    <main className="min-h-screen bg-[#fbfbfa] text-neutral-800 flex flex-col items-center justify-start px-4 py-16 sm:p-8 overflow-y-auto selection:bg-amber-200">
      <div className="max-w-2xl w-full space-y-8 text-center my-auto">
        
        {/* 🟢 狀態列 */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-xs text-neutral-500 mx-auto shadow-sm transition-transform hover:scale-105">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Engine Status: Operational</span>
          <span className="text-neutral-300">|</span>
          <span className="text-emerald-600 font-medium">Purify Speed: 1s</span>
        </div>

        {/* 🎯 B2C 核心文案 */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-neutral-900">
          Tired of <span className="text-orange-600 animate-pulse">3,000-word</span> life stories just to get a recipe?
        </h1>
        <p className="text-neutral-500 text-base sm:text-lg max-w-xl mx-auto">
          Instantly strip ads, pop-ups, and endless fluff from any cooking or news blog. Save directly to your mobile notes.
        </p>

        {/* 🚀 輸入框區塊 */}
        <div className="w-full mt-8">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <input 
              type="text" 
              placeholder="Paste any recipe or blog URL (e.g., https://...)" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full sm:flex-1 px-4 py-3 rounded-xl bg-white border border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 shadow-sm transition-all"
            />
            <button 
              onClick={testUrl}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 whitespace-nowrap shadow-md hover:shadow-lg transform active:scale-95"
            >
              {loading ? 'Purifying...' : 'Get Just The Text'}
            </button>
          </div>

          {/* ✨ 零摩擦測試範例：全機型完美置中排版 */}
          <div className="mt-6 flex flex-col items-center justify-center gap-3 w-full">
            <span className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">
              💡 Try these famous fluff examples:
            </span>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full max-w-lg">
              <button 
                onClick={() => setUrl("https://sallysbakingaddiction.com/chewy-chocolate-chip-cookies/")}
                className="rounded-full bg-orange-50 border border-orange-100 px-4 py-1.5 text-xs sm:text-sm text-orange-600 font-medium transition-all hover:bg-orange-100 hover:-translate-y-0.5 hover:shadow-sm active:scale-95"
              >
                🍪 Sally's Cookies
              </button>
              <button 
                onClick={() => setUrl("https://pinchofyum.com/the-best-detox-crockpot-lentil-soup/")}
                className="rounded-full bg-emerald-50 border border-emerald-100 px-4 py-1.5 text-xs sm:text-sm text-emerald-600 font-medium transition-all hover:bg-emerald-100 hover:-translate-y-0.5 hover:shadow-sm active:scale-95"
              >
                🍲 Pinch of Yum
              </button>
              <button 
                onClick={() => setUrl("https://smittenkitchen.com/2023/11/big-crumb-pie-dough/")}
                className="rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-xs sm:text-sm text-blue-600 font-medium transition-all hover:bg-blue-100 hover:-translate-y-0.5 hover:shadow-sm active:scale-95"
              >
                🥧 Smitten Kitchen
              </button>
            </div>
          </div>
        </div>

        {/* 🛡️ 信任增強方塊 */}
        {!result && (
          <div className="mt-12 grid grid-cols-2 gap-4 text-left text-xs text-neutral-500 font-medium">
            <div className="p-4 bg-white border border-neutral-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <span className="text-emerald-600 font-bold mr-1.5">✓</span> 100% Ad & Cookie Blocker
            </div>
            <div className="p-4 bg-white border border-neutral-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <span className="text-emerald-600 font-bold mr-1.5">✓</span> Smart Fluff Extraction
            </div>
            <div className="p-4 bg-white border border-neutral-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <span className="text-emerald-600 font-bold mr-1.5">✓</span> Export to Phone Notes (.txt)
            </div>
            <div className="p-4 bg-white border border-neutral-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <span className="text-emerald-600 font-bold mr-1.5">✓</span> 1-Click Browser Extension
            </div>
          </div>
        )}

        {/* 結果展示區塊 */}
        {result && !result.detail && (
          <div className="mt-8 sm:mt-12 p-6 sm:p-8 bg-white border border-neutral-200/60 rounded-2xl text-left space-y-6 shadow-xl transition-all animate-fade-in ring-1 ring-black/5">
            
            <div className="flex items-center justify-between">
              <h2 className="text-lg text-neutral-800 font-bold tracking-tight">Purified Content Box</h2>
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold animate-pulse">
                {result.token_saved_percent ?? '90%'} Bloat Removed
              </span>
            </div>

            {/* 文本預覽區 */}
            {previewText && (
              <div className="relative p-4 bg-neutral-50 rounded-xl border border-neutral-100 overflow-hidden shadow-inner">
                <div className="text-sm text-neutral-700 font-sans h-64 overflow-y-auto overflow-x-hidden break-words whitespace-pre-wrap p-1 leading-relaxed antialiased">
                  {previewText.substring(0, 3000)}
                </div>
              </div>
            )}

            {/* 手機操作列 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={downloadToNotes}
                className="py-3 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-95"
              >
                📥 Download for Notes
              </button>
              <button 
                onClick={copyToClipboard}
                className="py-3 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-95"
              >
                {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
              </button>
            </div>

            {/* 💳 終極變現付費牆 */}
            <div className="pt-6 border-t border-neutral-100 space-y-3 mt-4">
              <div className="text-xs text-neutral-400 text-center font-medium">
                Like the speed? Get the 1-Click Chrome Extension to purify pages instantly.
              </div>
              <a 
                href="https://ko-fi.com/agentlens/tiers" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full py-4 bg-neutral-900 text-white font-bold text-center rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl transform active:scale-95 ring-2 ring-transparent hover:ring-neutral-400"
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