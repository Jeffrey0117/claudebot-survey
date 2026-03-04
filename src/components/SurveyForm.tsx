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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Identity fields */}
      <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10 space-y-4">
        <p className="text-lg font-medium text-white/80 mb-2">基本資料</p>
        <div>
          <label className="block text-sm text-white/50 mb-1">
            Threads 帳號 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={threadsAccount}
            onChange={e => setThreadsAccount(e.target.value)}
            placeholder="@your_threads_account"
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div>
          <label className="block text-sm text-white/50 mb-1">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {QUESTIONS.map((q, idx) => (
        <div key={q.id} className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
          <p className="text-lg font-medium mb-4">
            <span className="text-blue-400 mr-2">{idx + 1}.</span>
            {q.label}
            {q.required && <span className="text-red-400 ml-1">*</span>}
          </p>

          {q.type === 'radio' && q.options && (
            <div className="space-y-2">
              {q.options.map(opt => (
                <label key={opt} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => handleRadio(q.id, opt)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          )}

          {q.type === 'checkbox' && q.options && (
            <div className="space-y-2">
              {q.options.map(opt => (
                <label key={opt} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    value={opt}
                    checked={((answers[q.id] as string[] | undefined) ?? []).includes(opt)}
                    onChange={e => handleCheckbox(q.id, opt, e.target.checked)}
                    className="w-4 h-4 accent-blue-500 rounded"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          )}

          {q.type === 'text' && (
            <textarea
              value={(answers[q.id] as string) ?? ''}
              onChange={e => handleText(q.id, e.target.value)}
              placeholder="請輸入..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 rounded-xl text-lg font-semibold transition-colors"
      >
        {submitting ? '提交中...' : '送出問卷'}
      </button>
    </form>
  )
}
