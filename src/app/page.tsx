'use client'

import { useState } from 'react'
import SurveyForm from '@/components/SurveyForm'

function CouponCard() {
  const holes = Array.from({ length: 8 })

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Coupon ticket */}
      <div className="relative coupon-pattern rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.06) 0%, rgba(59,130,246,0.04) 100%)', border: '1px solid var(--theme-border)' }}>
        {/* Shimmer overlay */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="coupon-shimmer absolute inset-0" style={{ background: `linear-gradient(to right, transparent, var(--theme-shimmer), transparent)` }} />
        </div>

        {/* Perforation edges */}
        <div className="coupon-edge-left">
          {holes.map((_, i) => <div key={i} className="coupon-hole" />)}
        </div>
        <div className="coupon-edge-right">
          {holes.map((_, i) => <div key={i} className="coupon-hole" />)}
        </div>

        <div className="relative px-8 sm:px-12 py-8 sm:py-10">
          {/* Top label */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--theme-text-muted)' }}>
              Course Coupon
            </span>
            <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--theme-text-faint)' }}>
              #2025
            </span>
          </div>

          {/* Amount */}
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-lg text-mint/60 font-medium">NT$</span>
              <span className="text-6xl sm:text-7xl font-black text-mint tracking-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>200</span>
            </div>
            <p className="text-sm mt-2" style={{ color: 'var(--theme-text-tertiary)' }}>課程折抵金</p>
          </div>

          {/* Dashed separator */}
          <div className="my-6" style={{ borderTop: '2px dashed var(--theme-border)' }} />

          {/* Code */}
          <div className="text-center space-y-3">
            <p className="text-xs tracking-wider uppercase" style={{ color: 'var(--theme-text-muted)' }}>折扣碼</p>
            <div className="inline-block border border-mint/20 rounded-lg px-6 py-3" style={{ background: 'var(--theme-surface)' }}>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-[0.15em] text-mint code-glow" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                BOT200
              </span>
            </div>
          </div>

          {/* Bottom info */}
          <div className="mt-8 flex items-center justify-between text-xs" style={{ color: 'var(--theme-text-faint)' }}>
            <span>使用 Claude Code 開發</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>html_cat</span>
          </div>
        </div>
      </div>

      {/* Instructions below coupon */}
      <div className="mt-5 text-center space-y-2">
        <p className="text-sm" style={{ color: 'var(--theme-text-tertiary)' }}>請截圖或記住折扣碼，購課時可折抵 NT$200</p>
      </div>
    </div>
  )
}

function AuthorCard() {
  return (
    <div className="author-card relative rounded-2xl overflow-hidden">
      {/* Decorative glow blobs */}
      <div className="absolute top-0 left-1/4 w-48 h-24 bg-accent/[0.15] rounded-full blur-[60px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-40 h-20 bg-purple-500/[0.10] rounded-full blur-[50px] translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-32 h-32 bg-mint/[0.08] rounded-full blur-[50px] translate-x-1/2" />

      <div className="relative p-5 sm:p-6">
        {/* Header row */}
        <div className="flex items-center gap-4 mb-5">
          <img
            src="https://atighahaffsncaxggkdk.supabase.co/storage/v1/object/public/images/site_settings/optimized_ad090f23-54bb-47dd-830b-b9814e720eb9_default_instructor_avatar_url.webp"
            alt="html_cat"
            className="author-avatar-ring w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold tracking-tight" style={{ color: 'var(--theme-text)' }}>html_cat</p>
            <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>切版職人 · 全端開發者</p>
          </div>
          <div className="hidden sm:flex gap-1.5">
            <span className="text-[11px] px-2 py-1 rounded-md font-medium" style={{ color: 'var(--color-accent)', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>IG 3K+</span>
            <span className="text-[11px] px-2 py-1 rounded-md font-medium" style={{ color: 'var(--color-accent)', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>Threads 2K+</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { val: '3', label: '產品上線', color: 'text-accent' },
            { val: '5K+', label: '月活用戶', color: 'text-purple-400' },
            { val: '100W+', label: '總流量', color: 'text-mint' },
          ].map(({ val, label, color }) => (
            <div key={label} className="author-stat-card rounded-xl py-2.5 text-center">
              <p className={`text-xl font-bold ${color}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>{val}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--theme-text-muted)' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[11px] font-medium text-accent/80 bg-accent-soft rounded-full px-2.5 py-0.5 border border-accent/15">線上課程 · 六位數營收</span>
          <span className="text-[11px] font-medium text-purple-300/80 bg-purple-500/10 rounded-full px-2.5 py-0.5 border border-purple-400/15">10+ 開發工具</span>
          <span className="text-[11px] font-medium text-mint/80 bg-mint-soft rounded-full px-2.5 py-0.5 border border-mint/15">技術文章作者</span>
        </div>

        {/* Mobile badges */}
        <div className="flex sm:hidden gap-1.5 mt-3">
          <span className="text-[11px] px-2 py-1 rounded-md font-medium" style={{ color: 'var(--color-accent)', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>IG 3K+</span>
          <span className="text-[11px] px-2 py-1 rounded-md font-medium" style={{ color: 'var(--color-accent)', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>Threads 2K+</span>
        </div>
      </div>
    </div>
  )
}

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
    <main className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-14">
      {/* Hero */}
      <div className="text-center mb-8 max-w-xl">
        <div className="inline-flex items-center gap-2 bg-mint-soft text-mint rounded-full px-3.5 py-1 text-xs font-medium mb-5 border border-mint/15">
          <span>🎟️</span>
          <span>填問卷領 NT$200 折扣碼</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black mb-3 leading-tight tracking-tight">
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, var(--theme-text), var(--theme-text-secondary))' }}>使用 Claude Code</span>
          <br />
          <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">打造你的開發工作流</span>
        </h1>
        <p className="text-sm sm:text-base" style={{ color: 'var(--theme-text-tertiary)' }}>
          填完問卷立即領取折扣碼，未來課程可直接折抵
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-6">
        {/* Author */}
        <AuthorCard />

        {/* Form or Success */}
        {submitted ? (
          <div className="space-y-8 py-4">
            <CouponCard />

            <div className="rounded-2xl p-5 sm:p-6 space-y-3" style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-surface)' }}>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
                這整個問卷網站，從 UI、程式碼到自動化部署，都是用
                <span className="text-accent font-semibold"> ClaudeBot </span>
                在手機上透過 Telegram 指揮 AI 完成的。
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text-tertiary)' }}>
                這正是這門課要教的——用 Claude Code 打造屬於你的高效開發工作流。
                課程準備好後會通知你，敬請期待。
              </p>
            </div>
          </div>
        ) : (
          <SurveyForm onSubmit={handleSubmit} />
        )}
      </div>

      <footer className="mt-16 text-center text-xs" style={{ color: 'var(--theme-text-faint)' }}>
        Powered by ClaudeBot
      </footer>
    </main>
  )
}
