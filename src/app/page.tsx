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
    <main className="min-h-screen flex flex-col items-center px-4 py-10 sm:py-16">
      {/* Header */}
      <div className="text-center mb-6 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent leading-tight">
          使用 Claude Code 開發
        </h1>
        <p className="text-white/50 text-base sm:text-lg">
          課程興趣調查
        </p>
      </div>

      {/* Author card */}
      <div className="w-full max-w-2xl mb-8">
        <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur rounded-2xl p-6 border border-white/[0.08] overflow-hidden">
          {/* Subtle gradient accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative flex items-center gap-4 mb-5">
            <img
              src="https://atighahaffsncaxggkdk.supabase.co/storage/v1/object/public/images/site_settings/optimized_ad090f23-54bb-47dd-830b-b9814e720eb9_default_instructor_avatar_url.webp"
              alt="html_cat"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500/30"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xl font-bold tracking-tight">html_cat</p>
              <p className="text-white/40 text-sm">切版職人 · 全端開發者</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-white/30">
              <span className="bg-white/5 px-2 py-1 rounded-md">IG 3K+</span>
              <span className="bg-white/5 px-2 py-1 rounded-md">Threads 2K+</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-5">
            <div className="bg-white/[0.04] rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-blue-400">3</p>
              <p className="text-[11px] text-white/35 mt-0.5 leading-tight">產品上線中</p>
            </div>
            <div className="bg-white/[0.04] rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-purple-400">5K+</p>
              <p className="text-[11px] text-white/35 mt-0.5 leading-tight">月活躍用戶</p>
            </div>
            <div className="bg-white/[0.04] rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-emerald-400">100W+</p>
              <p className="text-[11px] text-white/35 mt-0.5 leading-tight">產品總流量</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <span className="bg-blue-500/10 text-blue-300/80 text-xs px-2.5 py-1 rounded-full">線上課程 · 六位數營收</span>
            <span className="bg-purple-500/10 text-purple-300/80 text-xs px-2.5 py-1 rounded-full">10+ 開發工具</span>
            <span className="bg-emerald-500/10 text-emerald-300/80 text-xs px-2.5 py-1 rounded-full">技術文章作者</span>
          </div>

          {/* Mobile social stats */}
          <div className="flex sm:hidden items-center gap-2 mt-4 text-xs text-white/30">
            <span className="bg-white/5 px-2 py-1 rounded-md">IG 3K+</span>
            <span className="bg-white/5 px-2 py-1 rounded-md">Threads 2K+</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="w-full max-w-2xl">
        {submitted ? (
          <div className="text-center bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur rounded-2xl p-10 sm:p-12 border border-white/[0.08] space-y-5">
            <div className="text-5xl">🎉</div>
            <h2 className="text-2xl font-bold">感謝你的回饋！</h2>

            <div className="bg-blue-500/[0.08] border border-blue-500/20 rounded-xl p-5 text-left space-y-2.5">
              <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                這整個問卷網站，從 UI 設計、程式碼到部署上線，都是用 <span className="text-blue-400 font-semibold">ClaudeBot</span> 在手機上完成的。
              </p>
              <p className="text-white/50 text-sm leading-relaxed">
                這正是這門課要教的——用 Claude Code 打造屬於你的開發工作流。
              </p>
            </div>

            <p className="text-white/40 text-sm pt-2">
              課程準備好後會通知你，敬請期待 ✨
            </p>
          </div>
        ) : (
          <SurveyForm onSubmit={handleSubmit} />
        )}
      </div>

      {/* Footer */}
      <footer className="mt-14 text-center text-white/15 text-xs">
        <p>Powered by <span className="text-blue-400/40">ClaudeBot</span></p>
      </footer>
    </main>
  )
}
