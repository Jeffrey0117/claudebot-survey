import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '填問卷送 $200 折扣券 — 使用 Claude Code 開發',
  description: '填寫課程興趣問卷，立即領取 NT$200 折扣碼 BOT200！html_cat 切版職人帶你用 Claude Code 打造開發工作流。',
  openGraph: {
    title: '🎟️ 填問卷送 $200 折扣券 — Claude Code 開發課程',
    description: '填寫問卷立即領取 NT$200 折扣碼！html_cat 帶你用 Claude Code 打造高效開發工作流。',
    siteName: 'html_cat 課程問卷',
    type: 'website',
    url: 'https://survey.isnowfriend.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🎟️ 填問卷送 $200 折扣券 — Claude Code 開發課程',
    description: '填寫問卷立即領取 NT$200 折扣碼！',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Noto+Sans+TC:wght@400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body
        className="min-h-screen text-white antialiased"
        style={{
          fontFamily: "'Noto Sans TC', sans-serif",
          backgroundColor: '#0b0d14',
          backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.08), transparent)',
        }}
      >
        {children}
      </body>
    </html>
  )
}
