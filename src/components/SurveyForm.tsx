'use client'

import { useState } from 'react'
import type { SurveyConfig } from '@/lib/types'

interface Props {
  readonly config: SurveyConfig
  readonly onSubmit: (data: { identity: Record<string, string>; answers: Record<string, string | string[]> }) => Promise<void>
}

export default function SurveyForm({ config, onSubmit }: Props) {
  const [identity, setIdentity] = useState<Record<string, string>>({})
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [submitting, setSubmitting] = useState(false)

  function handleIdentity(key: string, value: string) {
    setIdentity(prev => ({ ...prev, [key]: value }))
  }

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

  function handleConfirm(qId: string, checked: boolean) {
    setAnswers(prev => ({ ...prev, [qId]: checked ? '是' : '' }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    for (const field of config.identityFields) {
      if (field.required && !identity[field.key]?.trim()) {
        alert(`請輸入${field.label}`)
        return
      }
      if (field.type === 'email' && identity[field.key]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(identity[field.key])) {
          alert(`請輸入有效的 ${field.label}`)
          return
        }
      }
    }

    for (const q of config.questions) {
      if (!q.required) continue
      const val = answers[q.id]
      if (!val || (Array.isArray(val) && val.length === 0)) {
        alert(`請回答：${q.label}`)
        return
      }
    }

    setSubmitting(true)
    try {
      const trimmedIdentity = Object.fromEntries(
        Object.entries(identity).map(([k, v]) => {
          const field = config.identityFields.find(f => f.key === k)
          return [k, field?.type === 'email' ? v.trim().toLowerCase() : v.trim()]
        })
      )
      await onSubmit({ identity: trimmedIdentity, answers })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Identity */}
      <div className="rounded-2xl p-5 sm:p-6 space-y-4" style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-surface)' }}>
        <p className="text-sm font-medium tracking-wide" style={{ color: 'var(--theme-text-tertiary)' }}>
          {config.identitySectionLabel ?? '基本資料'}
        </p>

        <div className="space-y-3">
          {config.identityFields.map(field => (
            <div key={field.key}>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--theme-text-muted)' }}>
                {field.label} {field.required && <span className="text-red-400/70">*</span>}
              </label>
              <input
                type={field.type}
                value={identity[field.key] ?? ''}
                onChange={e => handleIdentity(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full themed-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/40 transition-all"
              />
              {field.hint && (
                <p className="text-[11px] mt-1.5 pl-1" style={{ color: 'var(--theme-text-faint)' }}>{field.hint}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Questions */}
      {config.questions.map((q, idx) => (
        <div
          key={q.id}
          className="rounded-2xl p-5 sm:p-6"
          style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-surface)' }}
        >
          <p className="text-sm font-medium mb-4" style={{ color: 'var(--theme-text-secondary)' }}>
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
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-sm"
                    style={{
                      background: selected ? 'var(--theme-selected-bg)' : 'transparent',
                      color: selected ? 'var(--theme-text-secondary)' : 'var(--theme-text-tertiary)',
                    }}
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
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-sm"
                    style={{
                      background: checked ? 'var(--theme-selected-bg)' : 'transparent',
                      color: checked ? 'var(--theme-text-secondary)' : 'var(--theme-text-tertiary)',
                    }}
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
              placeholder={q.placeholder ?? '請輸入...'}
              rows={3}
              className="w-full themed-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/40 transition-all resize-none"
            />
          )}

          {q.type === 'confirm' && (
            <label
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-sm"
              style={{
                background: answers[q.id] === '是' ? 'var(--theme-selected-bg)' : 'transparent',
                color: answers[q.id] === '是' ? 'var(--theme-text-secondary)' : 'var(--theme-text-tertiary)',
              }}
            >
              <input
                type="checkbox"
                checked={answers[q.id] === '是'}
                onChange={e => handleConfirm(q.id, e.target.checked)}
              />
              <span>確認</span>
            </label>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 bg-accent hover:bg-accent/90 disabled:bg-accent/40 rounded-xl text-sm font-semibold transition-all active:scale-[0.99] text-white"
      >
        {submitting ? '提交中...' : config.submitLabel}
      </button>
    </form>
  )
}
