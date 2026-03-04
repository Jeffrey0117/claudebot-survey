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
      <div className="text-center mb-8 max-w-2xl">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          使用 Claude Code 開發
        </h1>
        <p className="text-white/60 text-lg">
          課程興趣調查 — 幫我了解你的需求，打造最適合的內容
        </p>
      </div>

      {/* Author card */}
      <div className="w-full max-w-2xl mb-10">
        <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl">
              🐱
            </div>
            <div>
              <p className="text-lg font-bold">html_cat</p>
              <p className="text-white/50 text-sm">切版職人 · 全端開發者</p>
            </div>
            <div className="ml-auto flex items-center gap-3 text-sm text-white/40">
              <span>IG 3K+</span>
              <span className="text-white/20">·</span>
              <span>Threads 2K+</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center mb-4">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xl font-bold text-blue-400">3</p>
              <p className="text-xs text-white/40 mt-1">產品上線營運中</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xl font-bold text-purple-400">5K+</p>
              <p className="text-xs text-white/40 mt-1">月活躍用戶</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xl font-bold text-green-400">100W+</p>
              <p className="text-xs text-white/40 mt-1">產品總流量</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-blue-500/15 text-blue-300 px-2.5 py-1 rounded-full">線上課程販售・學員六位數營收</span>
            <span className="bg-purple-500/15 text-purple-300 px-2.5 py-1 rounded-full">10+ 開發工具上架</span>
            <span className="bg-green-500/15 text-green-300 px-2.5 py-1 rounded-full">技術教學文章作者</span>
          </div>
        </div>
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
                這正是我想在課程裡教你的：<span className="text-white/80">用 Claude Code 打造屬於你的高效開發工作流</span>。
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
