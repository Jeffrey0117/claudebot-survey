'use client'

import { useState } from 'react'
import type { SurveyConfig } from '@/lib/types'
import SurveyForm from './SurveyForm'
import AuthorCard from './AuthorCard'
import CouponCard from './CouponCard'

interface Props {
  readonly config: SurveyConfig
}

export default function SurveyPage({ config }: Props) {
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(data: { threadsAccount: string; email: string; answers: Record<string, string | string[]> }) {
    const res = await fetch('/api/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: config.slug, ...data }),
    })

    if (!res.ok) {
      const json = await res.json()
      alert(json.error ?? '提交失敗')
      return
    }

    setSubmitted(true)
  }

  const titleLines = Array.isArray(config.title) ? config.title : [config.title]

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-14">
      {/* Hero */}
      <div className="text-center mb-8 max-w-xl">
        {config.badge && (
          <div className="inline-flex items-center gap-2 bg-mint-soft text-mint rounded-full px-3.5 py-1 text-xs font-medium mb-5 border border-mint/15">
            {config.badge.icon && <span>{config.badge.icon}</span>}
            <span>{config.badge.text}</span>
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-black mb-3 leading-tight tracking-tight">
          {titleLines.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              <span
                className={i === 0
                  ? 'bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent'
                }
                style={i === 0 ? { backgroundImage: 'linear-gradient(to right, var(--theme-text), var(--theme-text-secondary))' } : undefined}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        {config.subtitle && (
          <p className="text-sm sm:text-base" style={{ color: 'var(--theme-text-tertiary)' }}>
            {config.subtitle}
          </p>
        )}

        {config.heroExtra && (
          <div className="space-y-2 mt-4">
            {config.heroExtra.map((line, i) => {
              if (line.style === 'prominent') {
                return (
                  <p key={i} className="text-base sm:text-lg font-semibold" style={{ color: 'var(--theme-text-secondary)' }}>
                    {line.text}
                  </p>
                )
              }
              if (line.style === 'link' && line.href) {
                return (
                  <a
                    key={i}
                    href={line.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
                  >
                    {line.text}
                  </a>
                )
              }
              return (
                <p key={i} className="text-sm" style={{ color: 'var(--theme-text-tertiary)' }}>
                  {line.text}
                </p>
              )
            })}
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl space-y-6">
        {config.showAuthorCard && <AuthorCard />}

        {submitted ? (
          <div className="space-y-8 py-4">
            {config.coupon?.enabled && (
              <CouponCard
                code={config.coupon.code}
                amount={config.coupon.amount}
                currency={config.coupon.currency}
                label={config.coupon.label}
              />
            )}

            {config.successMessage.title && (
              <div className="rounded-2xl p-5 sm:p-6 text-center space-y-3" style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-surface)' }}>
                {config.successMessage.emoji && <p className="text-2xl">{config.successMessage.emoji}</p>}
                <p className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>{config.successMessage.title}</p>
                {config.successMessage.body && (
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text-tertiary)' }}>
                    {config.successMessage.body.split('\n').map((line, i) => (
                      <span key={i}>{i > 0 && <br />}{line}</span>
                    ))}
                  </p>
                )}
              </div>
            )}

            {/* Home survey special success message */}
            {config.slug === 'home' && (
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
            )}
          </div>
        ) : (
          <SurveyForm config={config} onSubmit={handleSubmit} />
        )}
      </div>

      <footer className="mt-16 text-center text-xs" style={{ color: 'var(--theme-text-faint)' }}>
        Powered by ClaudeBot
      </footer>
    </main>
  )
}
