'use client'

import { useState } from 'react'

interface SurveyResponse {
  readonly id: string
  readonly email: string
  readonly name: string
  readonly answers: Record<string, string | string[]>
  readonly submittedAt: string
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [total, setTotal] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'stats' | 'contacts' | 'feedback'>('stats')
  const [copied, setCopied] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? '登入失敗')
        setLoading(false)
        return
      }

      setResponses(data.responses)
      setTotal(data.total)
      setAuthed(true)
    } catch {
      setError('連線失敗')
    } finally {
      setLoading(false)
    }
  }

  function countAnswers(questionId: string): Record<string, number> {
    const counts: Record<string, number> = {}
    for (const r of responses) {
      const val = r.answers[questionId]
      if (!val) continue
      const values = Array.isArray(val) ? val : [val]
      for (const v of values) {
        counts[v] = (counts[v] ?? 0) + 1
      }
    }
    return counts
  }

  function copyText(text: string, label: string) {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 1500)
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="rounded-2xl p-8 w-full max-w-sm space-y-4" style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-surface)' }}>
          <h2 className="text-xl font-bold text-center" style={{ color: 'var(--theme-text)' }}>管理員登入</h2>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="輸入密碼"
            className="w-full themed-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 rounded-xl font-semibold transition-colors text-white text-sm"
          >
            {loading ? '驗證中...' : '登入'}
          </button>
        </form>
      </div>
    )
  }

  const donutQuestions: readonly { readonly id: string; readonly label: string }[] = [
    { id: 'interest', label: '課程興趣' },
    { id: 'ai_usage', label: 'AI 使用頻率' },
    { id: 'subscribe', label: '月訂閱 $200 體驗 Claude Code' },
  ]

  const barQuestions: readonly { readonly id: string; readonly label: string }[] = [
    { id: 'tools', label: '使用過的工具' },
    { id: 'topics', label: '想學的主題' },
  ]

  const donutColors = ['#3b82f6', '#a855f7', '#34d399', '#f59e0b', '#f43f5e', '#06b6d4', '#6366f1']

  const barColors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-indigo-500',
  ]

  const tabs = [
    { key: 'stats' as const, label: '統計總覽' },
    { key: 'contacts' as const, label: `聯絡人 (${total})` },
    { key: 'feedback' as const, label: '文字回饋' },
  ]

  const allEmails = responses.map(r => r.email).join('\n')
  const allThreads = responses.map(r => r.name).join('\n')

  return (
    <main className="min-h-screen px-4 py-8 sm:py-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--theme-text)' }}>問卷後台</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--theme-text-muted)' }}>共 {total} 份回覆</p>
        </div>
        <div className="text-right text-xs" style={{ color: 'var(--theme-text-faint)' }}>
          survey.isnowfriend.com
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="rounded-xl p-4 text-center" style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-surface)' }}>
          <p className="text-3xl font-bold text-blue-400">{total}</p>
          <p className="text-[11px] mt-1" style={{ color: 'var(--theme-text-muted)' }}>總回覆</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-surface)' }}>
          <p className="text-3xl font-bold text-emerald-400">
            {total > 0 ? Math.round((countAnswers('interest')['非常有興趣'] ?? 0) / total * 100) : 0}%
          </p>
          <p className="text-[11px] mt-1" style={{ color: 'var(--theme-text-muted)' }}>非常有興趣</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-surface)' }}>
          <p className="text-3xl font-bold text-purple-400">
            {total > 0 ? Math.round(((countAnswers('subscribe')['非常有興趣'] ?? 0) + (countAnswers('subscribe')['會想試試看'] ?? 0)) / total * 100) : 0}%
          </p>
          <p className="text-[11px] mt-1" style={{ color: 'var(--theme-text-muted)' }}>訂閱意願</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-surface)' }}>
          <p className="text-3xl font-bold text-amber-400">
            {responses.filter(r => r.answers.feedback).length}
          </p>
          <p className="text-[11px] mt-1" style={{ color: 'var(--theme-text-muted)' }}>文字回饋</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 pb-px" style={{ borderBottom: '1px solid var(--theme-border)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-2.5 text-sm transition-all rounded-t-lg"
            style={tab === t.key
              ? { color: 'var(--theme-text)', background: 'var(--theme-surface-hover)', border: '1px solid var(--theme-border)', borderBottom: '1px solid transparent', marginBottom: '-1px' }
              : { color: 'var(--theme-text-muted)' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Stats tab */}
      {tab === 'stats' && (
        <div className="space-y-4">
          {/* Donut charts for single-select questions */}
          <div className="grid gap-4 sm:grid-cols-3">
            {donutQuestions.map(({ id: qId, label }) => {
              const counts = countAnswers(qId)
              const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
              if (entries.length === 0) return null
              const totalAnswers = entries.reduce((sum, e) => sum + e[1], 0)

              // SVG donut math
              const radius = 52
              const circumference = 2 * Math.PI * radius
              let cumulativeOffset = 0

              return (
                <div key={qId} className="rounded-xl p-5" style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-surface)' }}>
                  <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--theme-text-tertiary)' }}>{label}</h3>

                  {/* Donut */}
                  <div className="flex justify-center mb-4">
                    <div className="relative w-32 h-32">
                      <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
                        {entries.map(([, count], i) => {
                          const pct = totalAnswers > 0 ? count / totalAnswers : 0
                          const dashLength = pct * circumference
                          const gap = circumference - dashLength
                          const offset = cumulativeOffset
                          cumulativeOffset += dashLength
                          return (
                            <circle
                              key={i}
                              cx="64" cy="64" r={radius}
                              fill="none"
                              stroke={donutColors[i % donutColors.length]}
                              strokeWidth="18"
                              strokeDasharray={`${dashLength} ${gap}`}
                              strokeDashoffset={-offset}
                              strokeLinecap="butt"
                              className="transition-all duration-500"
                            />
                          )
                        })}
                        {/* Inner track */}
                        <circle cx="64" cy="64" r={radius} fill="none" stroke="var(--theme-bar-track)" strokeWidth="18" className="-z-10" style={{ zIndex: -1 }} />
                      </svg>
                      {/* Center label */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold" style={{ color: 'var(--theme-text)', fontFamily: "'JetBrains Mono', monospace" }}>{totalAnswers}</span>
                        <span className="text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>回覆</span>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-1.5">
                    {entries.map(([val, count], i) => {
                      const pct = totalAnswers > 0 ? Math.round((count / totalAnswers) * 100) : 0
                      return (
                        <div key={val} className="flex items-center gap-2 text-xs">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: donutColors[i % donutColors.length] }} />
                          <span className="truncate flex-1" style={{ color: 'var(--theme-text-secondary)' }}>{val}</span>
                          <span className="shrink-0 tabular-nums" style={{ color: 'var(--theme-text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{pct}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bar charts for multi-select questions */}
          <div className="grid gap-4 sm:grid-cols-2">
            {barQuestions.map(({ id: qId, label }) => {
              const counts = countAnswers(qId)
              const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
              if (entries.length === 0) return null
              const maxCount = Math.max(...entries.map(e => e[1]))
              return (
                <div key={qId} className="rounded-xl p-5" style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-surface)' }}>
                  <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--theme-text-tertiary)' }}>{label}</h3>
                  <p className="text-[10px] mb-4" style={{ color: 'var(--theme-text-faint)' }}>可複選，共 {total} 人填答</p>
                  <div className="space-y-2.5">
                    {entries.map(([val, count], i) => {
                      const barWidth = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0
                      return (
                        <div key={val}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="truncate mr-2" style={{ color: 'var(--theme-text-secondary)' }}>{val}</span>
                            <span className="shrink-0 tabular-nums" style={{ color: 'var(--theme-text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{count} 人</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--theme-bar-track)' }}>
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${barColors[i % barColors.length]}`}
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Contacts tab */}
      {tab === 'contacts' && (
        <div className="space-y-4">
          {/* Bulk copy buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => copyText(allEmails, 'email')}
              className="text-xs rounded-lg px-3 py-2 transition-all"
              style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)', color: 'var(--theme-text-tertiary)' }}
            >
              {copied === 'email' ? '已複製!' : '複製全部 Email'}
            </button>
            <button
              onClick={() => copyText(allThreads, 'threads')}
              className="text-xs rounded-lg px-3 py-2 transition-all"
              style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)', color: 'var(--theme-text-tertiary)' }}
            >
              {copied === 'threads' ? '已複製!' : '複製全部 Threads'}
            </button>
          </div>

          {/* Contact list */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-surface)' }}>
            {responses.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm" style={{ color: 'var(--theme-text-faint)' }}>目前沒有回覆</div>
            ) : (
              responses.map((r, i) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 px-4 py-3 transition-colors"
                  style={{ borderBottom: '1px solid var(--theme-border)' }}
                >
                  <span className="text-xs w-6 shrink-0 text-right" style={{ color: 'var(--theme-text-faint)' }}>{i + 1}</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium truncate" style={{ color: 'var(--theme-text-secondary)' }}>{r.name}</span>
                      {r.answers.interest === '非常有興趣' && <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded shrink-0">超有興趣</span>}
                      {r.answers.interest === '有點興趣' && <span className="text-[9px] bg-blue-500/15 text-blue-400 px-1.5 py-0.5 rounded shrink-0">有興趣</span>}
                    </div>
                    <p className="text-xs truncate" style={{ color: 'var(--theme-text-muted)' }}>{r.email}</p>
                  </div>

                  <div className="text-[10px] shrink-0" style={{ color: 'var(--theme-text-faint)' }}>
                    {new Date(r.submittedAt).toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Feedback tab */}
      {tab === 'feedback' && (
        <div className="space-y-3">
          {responses.filter(r => r.answers.feedback).length === 0 ? (
            <div className="rounded-xl p-8 text-center text-sm" style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-surface)', color: 'var(--theme-text-faint)' }}>
              暫無文字回饋
            </div>
          ) : (
            responses
              .filter(r => r.answers.feedback)
              .map(r => (
                <div key={r.id} className="rounded-xl p-4" style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-surface)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: 'var(--theme-text-tertiary)' }}>{r.name}</span>
                    <span className="text-[10px]" style={{ color: 'var(--theme-text-faint)' }}>
                      {new Date(r.submittedAt).toLocaleString('zh-TW')}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>{r.answers.feedback}</p>
                </div>
              ))
          )}
        </div>
      )}

      {/* Raw data */}
      <details className="mt-8 rounded-xl p-5" style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-surface)' }}>
        <summary className="cursor-pointer text-xs transition-colors" style={{ color: 'var(--theme-text-faint)' }}>
          原始 JSON ({total} 筆)
        </summary>
        <pre className="mt-4 text-[10px] overflow-x-auto leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
          {JSON.stringify(responses, null, 2)}
        </pre>
      </details>
    </main>
  )
}
