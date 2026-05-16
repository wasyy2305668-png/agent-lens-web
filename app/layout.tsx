import './globals.css'
import Script from 'next/script'

// 1. 全球搜尋引擎最佳化（SEO）設定
export const metadata = {
  title: 'AgentLens - 1s HTML to Markdown API',
  description: 'Strip website HTML bloat into clean, LLM-ready Markdown in 1 second. Save 90%+ OpenAI token costs.',
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
    <html lang="en">
      <head>
        {/* 🟢 A. Google Ads 全域基礎追蹤碼 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18167524631"
          strategy="afterInteractive"
        />
        <Script id="google-ads-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18167524631');
          `}
        </Script>

        {/* 🎯 B. 網頁瀏覽（Page View）成功轉換回報碼 */}
        <Script id="google-ads-conversion" strategy="afterInteractive">
          {`
            gtag('event', 'conversion', {
              'send_to': 'AW-18167524631/cH0wCKwymq4cEJfa-dZD',
              'value': 1.0,
              'currency': 'TWD'
            });
          `}
        </Script>
      </head>
      
      <body className="antialiased">
        {/* 這裡會自動渲染你 page.tsx 裡寫的 Playground 內容 */}
        {children}
      </body>
    </html>
  )
}