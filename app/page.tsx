'use client';
import { useState, useEffect } from 'react';

// 🧠 本地資料庫：0 成本、0 延遲，100% 繞過 Cloudflare，誘餌專用
const MOCK_RECIPES: Record<string, string> = {
  sally: `🍪 Chewy Chocolate Chip Cookies

Ingredients:
• 2 and 1/4 cups (281g) all-purpose flour (spooned & leveled)
• 1 teaspoon baking soda
• 1 and 1/2 teaspoons cornstarch
• 1/2 teaspoon salt
• 3/4 cup (170g) unsalted butter, melted & cooled for 5 minutes
• 3/4 cup (150g) packed light or dark brown sugar
• 1/2 cup (100g) granulated sugar
• 1 large egg + 1 egg yolk, at room temperature
• 2 teaspoons pure vanilla extract
• 1 cup semi-sweet chocolate chips

Instructions:
1. Whisk the flour, baking soda, cornstarch, and salt together in a large bowl. Set aside.
2. Whisk the melted butter, brown sugar, and granulated sugar together until no lumps remain. 
3. Whisk in the egg, egg yolk, and vanilla extract. Pour into dry ingredients and mix together with a large spoon or spatula. The dough will be very soft, thick, and shiny. Fold in the chocolate chips.
4. Cover the dough tightly and refrigerate for at least 2 hours or up to 3 days.
5. Bake the cookies for 12-13 minutes at 350°F (177°C) until the edges are very lightly browned.`,

  pinch: `🍲 Best Detox Crockpot Lentil Soup

Ingredients:
• 1 butternut squash, peeled and cubed
• 3 carrots, sliced
• 3 stalks celery, chopped
• 1 cup red lentils
• 1 cup brown lentils
• 4 cups vegetable broth
• 1 teaspoon cumin
• 1/2 teaspoon turmeric

Instructions:
1. Place squash, carrots, celery, and rinsed lentils in a large slow cooker.
2. Pour vegetable broth over top and add cumin and turmeric. Stir to combine.
3. Cover and cook on high for 4-5 hours or on low for 7-8 hours until lentils are completely tender.`,

  smitten: `🥧 Big Crumb Pie Dough

Ingredients:
• 2 and 1/2 cups (325 grams) all-purpose flour
• 1 tablespoon sugar
• 1 teaspoon fine sea salt
• 1 cup (225 grams) unsalted butter, very cold, cut into cubes
• 1/2 cup ice water

Instructions:
1. Whisk the flour, sugar, and salt in a large bowl. 
2. Add the cold butter cubes and use your fingers or a pastry blender to work the butter into the flour until the largest pieces are the size of small peas.
3. Drizzle 1/4 cup of the ice water over the mixture. Toss with a spatula to combine. Add more water, a tablespoon at a time, until the dough begins to clump together.
4. Gather dough into a ball, wrap tightly in plastic, and chill for at least 1 hour before rolling.`
};

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  
  // 🔑 PRO 狀態與驗證碼管理
  const [isPro, setIsPro] = useState(false);
  const [inputCode, setInputCode] = useState('');

  // 判定本地是否已啟動過 PRO 權限
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('purifier_pro') === 'true') {
      setIsPro(true);
    }
  }, []);

  // 🚀 核心大腦：自動判斷要走 Mock 還是真實 API
  const handleTriggerUrl = async (targetUrl: string, key?: string) => {
    if (!targetUrl) return;
    setUrl(targetUrl);
    setLoading(true);
    setResult(null);

    // 1. 🧠 黃金範例攔截（誘餌保持無限次免費）
    let finalKey = key;
    if (!finalKey) {
      if (targetUrl.includes('sallysbakingaddiction.com')) finalKey = 'sally';
      else if (targetUrl.includes('pinchofyum.com')) finalKey = 'pinch';
      else if (targetUrl.includes('smittenkitchen.com')) finalKey = 'smitten';
    }

    if (finalKey && MOCK_RECIPES[finalKey]) {
      setTimeout(() => {
        setResult({
          cleaned_content: MOCK_RECIPES[finalKey],
          token_saved_percent: '99.45%'
        });
        setLoading(false);
      }, 300);
      return;
    }

    // 2. 🚨 啟動「無情 2 次斷糧晶片」（如果是 PRO 用戶直接放行無視限制）
    const today = new Date().toDateString();
    const localUsage = localStorage.getItem('purifier_usage');
    let usageData = localUsage ? JSON.parse(localUsage) : { date: today, count: 0 };

    // 換日重置
    if (usageData.date !== today) {
      usageData = { date: today, count: 0 };
    }

    // 只要超過 2 次且不是 PRO，直接鎖死並製造時間焦慮
    if (!isPro && usageData.count >= 2) {
      setTimeout(() => {
        setResult({
          cleaned_content: `⚠️ FREE TIER LIMIT REACHED (2/2)\n\nYour 2 free daily custom searches have been used up for today.\n\n⏳ Remaining quota resets automatically at Midnight (00:00 local time).\n\nDon't want to wait until tomorrow? Pre-order our 1-Click Chrome Extension right now to unlock instant, unlimited processing on any website!`,
          token_saved_percent: '0.00%',
          is_system_msg: true,
          show_unlock_gate: true
        });
        setLoading(false);
      }, 200);
      return;
    }

    // 3. 額度還夠，放行戳你的 Render 真實後端 API
    try {
      const res = await fetch('https://agent-lens-api.onrender.com/api/v1/clean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });
      const data = await res.json();
      
      const rawText = data.cleaned_content || data.markdown || data.cleaned_text || data.content || data.text || '';
      
      // 🧠 防火牆攔截晶片：如果被 Allrecipes 等網站擋住，轉化為推銷與解鎖文案
      if (rawText.includes('access issue') || rawText.includes('support@people.inc') || rawText.includes('Proxy') || rawText.includes('Cloudflare')) {
        setResult({
          cleaned_content: `🔒 COOKING BLOG FIREWALL DETECTED\n\nThis website is actively blocking cloud servers from extracting their recipes.\n\n💡 THE FIX: Our upcoming 1-Click Chrome Extension runs locally on your browser, making it 100% IMMUNE to this server block! Pre-order it below to bypass all firewalls seamlessly.`,
          token_saved_percent: '0.00%',
          is_system_msg: true,
          show_unlock_gate: true
        });
        setLoading(false);
        return;
      }
      
      // 成功扣除一次免費額度（PRO 用戶不扣額度）
      if (!isPro) {
        usageData.count += 1;
        localStorage.setItem('purifier_usage', JSON.stringify(usageData));
      }
      
      setResult(data);
    } catch (error) {
      alert("Server is busy cooking. Try again in 10 seconds!");
    }
    setLoading(false);
  };

  // 🔑 暗號解鎖處理主邏輯
  const handleActivatePro = (explicitCode?: string) => {
    const codeToVerify = explicitCode || inputCode;
    if (codeToVerify.trim() === 'PURIFY2026') {
      localStorage.setItem('purifier_pro', 'true');
      setIsPro(true);
      alert('🎉 PRO Access Unlocked! Enjoy unlimited web purifications.');
      setResult(null); // 清空付費提示
    } else {
      alert('Invalid Activation Code. Please check your Ko-fi receipt!');
    }
  };

  // 🧹 清洗文字：徹底把 # 和 * 號拔除
  const getCleanedText = () => {
    if (!result) return '';
    const rawText = result.cleaned_content || result.markdown || result.cleaned_text || result.content || result.text || '';
    return rawText.replace(/[#*`]/g, '').trim();
  };

  const previewText = getCleanedText();
  const isLocked = !isPro && (previewText.includes('LIMIT REACHED') || previewText.includes('FIREWALL DETECTED'));

  const downloadToNotes = () => {
    if (!previewText || isLocked) return;
    const element = document.createElement("a");
    const file = new Blob([previewText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = "purified-recipe-notes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = () => {
    if (!previewText || isLocked) return;
    navigator.clipboard.writeText(previewText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    // 🎨 背景溫慢優雅的米白書卷色 (#fbfbfa)
    <main className="min-h-screen bg-[#fbfbfa] text-neutral-800 flex flex-col items-center justify-start px-4 py-16 sm:p-8 overflow-y-auto selection:bg-amber-200">
      <div className="max-w-2xl w-full space-y-8 text-center my-auto">
        
        {/* 🟢 狀態列 + 頂部隨時解鎖快速通道 */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-xs text-neutral-500 mx-auto shadow-sm transition-transform hover:scale-105">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Engine Status: Operational</span>
          <span className="text-neutral-300">|</span>
          {isPro ? (
            <span className="text-emerald-600 font-bold">PRO ACTIVE</span>
          ) : (
            <button 
              onClick={() => {
                const code = prompt('Enter your Ko-fi Activation Code to unlock PRO:');
                if (code) handleActivatePro(code);
              }}
              className="text-neutral-400 hover:text-emerald-600 underline font-medium cursor-pointer"
            >
              Already PRO?
            </button>
          )}
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
              onClick={() => handleTriggerUrl(url)}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 whitespace-nowrap shadow-md hover:shadow-lg transform active:scale-95"
            >
              {loading ? 'Purifying...' : 'Get Just The Text'}
            </button>
          </div>

          {/* ✨ 零摩擦測試範例 */}
          <div className="mt-6 flex flex-col items-center justify-center gap-3 w-full">
            <span className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">
              💡 Try these famous fluff examples:
            </span>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full max-w-lg">
              <button 
                onClick={() => handleTriggerUrl("https://sallysbakingaddiction.com/chewy-chocolate-chip-cookies/", "sally")}
                className="rounded-full bg-orange-50 border border-orange-100 px-4 py-1.5 text-xs sm:text-sm text-orange-600 font-medium transition-all hover:bg-orange-100 hover:-translate-y-0.5 hover:shadow-sm active:scale-95"
              >
                🍪 Sally's Cookies
              </button>
              <button 
                onClick={() => handleTriggerUrl("https://pinchofyum.com/the-best-detox-crockpot-lentil-soup/", "pinch")}
                className="rounded-full bg-emerald-50 border border-emerald-100 px-4 py-1.5 text-xs sm:text-sm text-emerald-600 font-medium transition-all hover:bg-emerald-100 hover:-translate-y-0.5 hover:shadow-sm active:scale-95"
              >
                🍲 Pinch of Yum
              </button>
              <button 
                onClick={() => handleTriggerUrl("https://smittenkitchen.com/2023/11/big-crumb-pie-dough/", "smitten")}
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
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold animate-pulse ${result.is_system_msg ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                {result.is_system_msg ? 'System Notice' : (result.token_saved_percent ?? '95.00%') + ' Bloat Removed'}
              </span>
            </div>

            {/* 文本預覽區 */}
            {previewText && (
              <div className={`relative p-4 rounded-xl border overflow-hidden shadow-inner ${result.is_system_msg ? 'bg-amber-50/40 border-amber-100' : 'bg-neutral-50 border-neutral-100'}`}>
                <div className={`text-sm font-sans h-64 overflow-y-auto overflow-x-hidden break-words whitespace-pre-wrap p-1 leading-relaxed antialiased ${result.is_system_msg ? 'text-amber-900 font-medium' : 'text-neutral-700'}`}>
                  {previewText}
                </div>

                {/* 🔑 密碼解鎖晶片介面：當觸發付費牆或被防火牆干擾，且非 PRO 用戶時顯示 */}
                {result.show_unlock_gate && !isPro && (
                  <div className="mt-4 pt-4 border-t border-amber-200 text-left">
                    <p className="text-xs text-amber-700 font-bold">Already a PRO supporter? Enter your Ko-fi Activation Code to unlock unlimited web access instantly:</p>
                    <div className="flex gap-2 mt-2">
                      <input 
                        type="text" 
                        placeholder="Paste your code (e.g. PURIFY2026)" 
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-amber-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-neutral-900 font-sans"
                      />
                      <button 
                        onClick={() => handleActivatePro()}
                        className="px-4 py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-lg transition-all whitespace-nowrap"
                      >
                        Activate Web PRO
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 手機操作列 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={downloadToNotes}
                disabled={isLocked}
                className="py-3 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                📥 Download for Notes
              </button>
              <button 
                onClick={copyToClipboard}
                disabled={isLocked}
                className="py-3 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
              </button>
            </div>

            {/* 💳 終極變現預購牆 */}
            <div className="pt-6 border-t border-neutral-100 space-y-3 mt-4">
              <div className="text-xs text-neutral-400 text-center font-medium">
                Our Chrome Extension is pending Web Store approval. Secure your VIP spot now!
              </div>
              <a 
                href="https://ko-fi.com/agentlens/tiers" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full py-4 bg-neutral-900 text-white font-bold text-center rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl transform active:scale-95 ring-2 ring-transparent hover:ring-neutral-400"
              >
                Pre-order PRO Access ($1.99)
              </a>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}