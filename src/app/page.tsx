'use client'

import { useState } from 'react'
import SurveyForm from '@/components/SurveyForm'

export default function Home() {
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(data: { threadsAccount: string; email: string; answers: Record<string, string | string[]> }) {
    const res = await fetch('/api/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const json = await res.json()
      alert(json.error ?? '提交失敗')
      return
    }

    setSubmitted(true)
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12 max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 px-4 py-1.5 rounded-full text-sm mb-6 border border-blue-500/30">
          <span className="text-xl">👨‍💻</span>
          <span className="font-medium">html_cat — 切版職人</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          用 AI 打造你的開發工作流
        </h1>
        <p className="text-white/60 text-lg">
          課程興趣調查 — 幫我了解你的需求，打造最適合的內容
        </p>
      </div>

      {/* Form */}
      <div className="w-full max-w-2xl">
        {submitted ? (
          <div className="text-center bg-white/5 backdrop-blur rounded-2xl p-12 border border-white/10 space-y-6">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-2xl font-bold mb-3">感謝你的回饋！</h2>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 text-left space-y-3">
              <p className="text-white/80 leading-relaxed">
                你知道嗎？這整個問卷網站、部署流程，都是用 <span className="text-blue-400 font-semibold">ClaudeBot</span> 開發的。
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                從設計 UI、寫程式碼、到自動化部署上線——全部在手機上用 Telegram 指揮 AI 完成。
                這正是我想在課程裡教你的：<span className="text-white/80">用 AI 打造屬於你的高效開發工作流</span>。
              </p>
            </div>

            <p className="text-white/50 text-sm pt-4">
              課程準備好後會通知你，敬請期待 ✨
            </p>
          </div>
        ) : (
          <SurveyForm onSubmit={handleSubmit} />
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-white/20 text-sm">
        <p>Powered by <span className="text-blue-400/60">ClaudeBot</span> — Not a pipe to Claude. A command center on your phone.</p>
      </footer>
    </main>
  )
}
