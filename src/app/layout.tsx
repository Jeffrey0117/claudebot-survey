import type { Metadata } from 'next'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import ThemeToggle from '@/components/ThemeToggle'

export const metadata: Metadata = {
  title: '線上問卷平台 — 快速建立與填寫問卷',
  description: '簡單好用的線上問卷工具，輕鬆建立調查表單、收集回饋與分析結果。',
  openGraph: {
    title: '線上問卷平台 — 快速建立與填寫問卷',
    description: '簡單好用的線上問卷工具，輕鬆建立調查表單、收集回饋與分析結果。',
    siteName: '線上問卷平台',
    type: 'website',
    url: 'https://survey.isnowfriend.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: '線上問卷平台 — 快速建立與填寫問卷',
    description: '簡單好用的線上問卷工具，輕鬆建立調查表單、收集回饋與分析結果。',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Noto+Sans+TC:wght@400;500;700;900&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const t = localStorage.getItem('survey-theme');
            if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
          } catch(e) {}
        `}} />
      </head>
      <body
        className="min-h-screen antialiased transition-colors duration-300"
        style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
      >
        <ThemeProvider>
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
