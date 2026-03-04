'use client'

import { useState } from 'react'
import SurveyForm from '@/components/SurveyForm'

export default function Home() {
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(data: { name: string; email: string; answers: Record<string, string | string[]> }) {
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
        <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-sm mb-6">
          Powered by ClaudeBot
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          用 AI 打造你的開發工作流
        </h1>
        <p className="text-white/60 text-lg">
          課程興趣調查 — 幫我們了解你的需求，打造最適合的內容
        </p>
      </div>

      {/* Form */}
      <div className="w-full max-w-2xl">
        {submitted ? (
          <div className="text-center bg-white/5 backdrop-blur rounded-2xl p-12 border border-white/10">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-2xl font-bold mb-3">感謝你的回饋！</h2>
            <p className="text-white/60 mb-6">你的意見對我們很重要，課程準備好後會通知你</p>
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
