import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'ClaudeBot 課程問卷',
  description: '用 AI 打造你的開發工作流 — 課程興趣調查',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
