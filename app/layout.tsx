import './globals.css'

// 1. 全球搜尋引擎最佳化（SEO）設定：直擊老外搜尋痛點
export const metadata = {
  title: 'Recipe Purifier | Skip the Fluff & Ads in 1 Second',
  description: 'Tired of 3,000-word life stories just to get a recipe? Instantly strip ads, pop-ups, and endless fluff from any cooking blog. Save directly to your mobile notes.',
  keywords: 'recipe ad blocker, skip recipe backstory, just the recipe, recipe text extractor, remove fluff from recipes',
}

// 2. ⚡ 手機完美顯示的核心：強迫行動裝置瀏覽器 1:1 縮放，拒絕變形
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // 確保語言標籤是 en，明確告訴 Google 這是一個純英文網站
    <html lang="en">
      <body className="antialiased bg-[#fbfbfa]">
        {/* 這裡會自動渲染你 page.tsx 裡寫的 B2C 內容 */}
        {children}
      </body>
    </html>
  )
}