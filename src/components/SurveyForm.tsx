'use client'

import { useState } from 'react'

interface Question {
  readonly id: string
  readonly label: string
  readonly type: 'radio' | 'checkbox' | 'text'
  readonly options?: readonly string[]
  readonly required?: boolean
}

const QUESTIONS: readonly Question[] = [
  {
    id: 'interest',
    label: '你對「用 AI 打造個人開發工作流」這門課有興趣嗎？',
    type: 'radio',
    options: ['非常有興趣', '有點興趣', '還好', '沒興趣'],
    required: true,
  },
  {
    id: 'ai_usage',
    label: '你目前使用 AI 輔助開發的頻率？',
    type: 'radio',
    options: ['每天都用', '一週幾次', '偶爾用', '還沒用過'],
    required: true,
  },
  {
    id: 'tools',
    label: '你目前用過哪些 AI 開發工具？（可多選）',
    type: 'checkbox',
    options: ['ChatGPT', 'Claude', 'GitHub Copilot', 'Cursor', 'Claude Code CLI', '其他'],
    required: true,
  },
  {
    id: 'topics',
    label: '你最想學哪些主題？（可多選）',
    type: 'checkbox',
    options: [
      'Telegram Bot 開發',
      'Claude Code CLI 進階用法',
      '多機協作（Remote Pairing）',
      '語音輸入開發流程',
      'Plugin 系統設計',
      'AI Directive 系統',
      '自動化部署',
    ],
    required: true,
  },
  {
    id: 'format',
    label: '你偏好的上課方式？',
    type: 'radio',
    options: ['錄播影片', '直播教學'],
    required: true,
  },
  {
    id: 'feedback',
    label: '其他想法或建議（選填）',
    type: 'text',
  },
]

interface Props {
  readonly onSubmit: (data: { threadsAccount: string; email: string; answers: Record<string, string | string[]> }) => Promise<void>
}

export default function SurveyForm({ onSubmit }: Props) {
  const [threadsAccount, setThreadsAccount] = useState('')
  const [email, setEmail] = useState('')
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [submitting, setSubmitting] = useState(false)

  function handleRadio(qId: string, value: string) {
    setAnswers(prev => ({ ...prev, [qId]: value }))
  }

  function handleCheckbox(qId: string, value: string, checked: boolean) {
    setAnswers(prev => {
      const current = (prev[qId] as string[] | undefined) ?? []
      const next = checked
        ? [...current, value]
        : current.filter(v => v !== value)
      return { ...prev, [qId]: next }
    })
  }

  function handleText(qId: string, value: string) {
    setAnswers(prev => ({ ...prev, [qId]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!threadsAccount.trim()) {
      alert('請輸入你的 Threads 帳號')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert('請輸入有效的 Email')
      return
    }

    for (const q of QUESTIONS) {
      if (!q.required) continue
      const val = answers[q.id]
      if (!val || (Array.isArray(val) && val.length === 0)) {
        alert(`請回答：${q.label}`)
        return
      }
    }

    setSubmitting(true)
    try {
      await onSubmit({ threadsAccount: threadsAccount.trim(), email: email.trim().toLowerCase(), answers })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Identity */}
      <div className="rounded-2xl border border-white/[0.06] p-5 sm:p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <p className="text-sm font-medium text-white/50 tracking-wide">基本資料</p>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-white/30 mb-1.5">
              Threads 帳號 <span className="text-red-400/70">*</span>
            </label>
            <input
              type="text"
              value={threadsAccount}
              onChange={e => setThreadsAccount(e.target.value)}
              placeholder="@your_account"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-white/30 mb-1.5">
              Email <span className="text-red-400/70">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      {QUESTIONS.map((q, idx) => (
        <div
          key={q.id}
          className="rounded-2xl border border-white/[0.06] p-5 sm:p-6"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <p className="text-sm font-medium mb-4 text-white/80">
            <span className="text-accent/60 mr-1.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{String(idx + 1).padStart(2, '0')}</span>
            {q.label}
            {q.required && <span className="text-red-400/50 ml-1 text-xs">*</span>}
          </p>

          {q.type === 'radio' && q.options && (
            <div className="space-y-1">
              {q.options.map(opt => {
                const selected = answers[q.id] === opt
                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-sm ${
                      selected
                        ? 'bg-accent/[0.08] text-white/90'
                        : 'hover:bg-white/[0.03] text-white/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      checked={selected}
                      onChange={() => handleRadio(q.id, opt)}
                    />
                    <span>{opt}</span>
                  </label>
                )
              })}
            </div>
          )}

          {q.type === 'checkbox' && q.options && (
            <div className="space-y-1">
              {q.options.map(opt => {
                const checked = ((answers[q.id] as string[] | undefined) ?? []).includes(opt)
                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-sm ${
                      checked
                        ? 'bg-accent/[0.08] text-white/90'
                        : 'hover:bg-white/[0.03] text-white/60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={opt}
                      checked={checked}
                      onChange={e => handleCheckbox(q.id, opt, e.target.checked)}
                    />
                    <span>{opt}</span>
                  </label>
                )
              })}
            </div>
          )}

          {q.type === 'text' && (
            <textarea
              value={(answers[q.id] as string) ?? ''}
              onChange={e => handleText(q.id, e.target.value)}
              placeholder="請輸入..."
              rows={3}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all resize-none"
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 bg-accent hover:bg-accent/90 disabled:bg-accent/40 rounded-xl text-sm font-semibold transition-all active:scale-[0.99]"
      >
        {submitting ? '提交中...' : '送出問卷，領取折扣碼'}
      </button>
    </form>
  )
}
