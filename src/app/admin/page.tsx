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
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0b0d14' }}>
        <form onSubmit={handleLogin} className="rounded-2xl p-8 border border-white/[0.06] w-full max-w-sm space-y-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <h2 className="text-xl font-bold text-center text-white">管理員登入</h2>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="輸入密碼"
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
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

  const questionLabels: Record<string, string> = {
    interest: '課程興趣',
    ai_usage: 'AI 使用頻率',
    tools: '使用過的工具',
    topics: '想學的主題',
    subscribe: '月訂閱 $200 體驗 Claude Code',
  }

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
    <main className="min-h-screen px-4 py-8 sm:py-12 max-w-4xl mx-auto text-white" style={{ background: '#0b0d14' }}>
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">問卷後台</h1>
          <p className="text-white/30 text-sm mt-1">共 {total} 份回覆</p>
        </div>
        <div className="text-right text-xs text-white/20">
          survey.isnowfriend.com
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="rounded-xl border border-white/[0.06] p-4 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <p className="text-3xl font-bold text-blue-400">{total}</p>
          <p className="text-[11px] text-white/30 mt-1">總回覆</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] p-4 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <p className="text-3xl font-bold text-emerald-400">
            {total > 0 ? Math.round((countAnswers('interest')['非常有興趣'] ?? 0) / total * 100) : 0}%
          </p>
          <p className="text-[11px] text-white/30 mt-1">非常有興趣</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] p-4 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <p className="text-3xl font-bold text-purple-400">
            {total > 0 ? Math.round(((countAnswers('subscribe')['非常有興趣'] ?? 0) + (countAnswers('subscribe')['會想試試看'] ?? 0)) / total * 100) : 0}%
          </p>
          <p className="text-[11px] text-white/30 mt-1">訂閱意願</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] p-4 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <p className="text-3xl font-bold text-amber-400">
            {responses.filter(r => r.answers.feedback).length}
          </p>
          <p className="text-[11px] text-white/30 mt-1">文字回饋</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-white/[0.06] pb-px">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm transition-all rounded-t-lg ${
              tab === t.key
                ? 'text-white bg-white/[0.05] border border-white/[0.08] border-b-transparent -mb-px'
                : 'text-white/30 hover:text-white/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Stats tab */}
      {tab === 'stats' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(questionLabels).map(([qId, label]) => {
            const counts = countAnswers(qId)
            const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
            if (entries.length === 0) return null
            const maxCount = Math.max(...entries.map(e => e[1]))
            return (
              <div key={qId} className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <h3 className="text-sm font-medium text-white/60 mb-4">{label}</h3>
                <div className="space-y-2.5">
                  {entries.map(([val, count], i) => {
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0
                    const barWidth = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0
                    return (
                      <div key={val}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/70 truncate mr-2">{val}</span>
                          <span className="text-white/30 shrink-0">{count} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${barColors[i % barColors.length]}`}
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
      )}

      {/* Contacts tab */}
      {tab === 'contacts' && (
        <div className="space-y-4">
          {/* Bulk copy buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => copyText(allEmails, 'email')}
              className="text-xs bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg px-3 py-2 text-white/60 transition-all"
            >
              {copied === 'email' ? '已複製!' : '複製全部 Email'}
            </button>
            <button
              onClick={() => copyText(allThreads, 'threads')}
              className="text-xs bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg px-3 py-2 text-white/60 transition-all"
            >
              {copied === 'threads' ? '已複製!' : '複製全部 Threads'}
            </button>
          </div>

          {/* Contact list */}
          <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
            {responses.length === 0 ? (
              <div className="px-4 py-8 text-center text-white/20 text-sm">目前沒有回覆</div>
            ) : (
              responses.map((r, i) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-xs text-white/15 w-6 shrink-0 text-right">{i + 1}</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm text-white/80 font-medium truncate">{r.name}</span>
                      {r.answers.interest === '非常有興趣' && <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded shrink-0">超有興趣</span>}
                      {r.answers.interest === '有點興趣' && <span className="text-[9px] bg-blue-500/15 text-blue-400 px-1.5 py-0.5 rounded shrink-0">有興趣</span>}
                    </div>
                    <p className="text-xs text-white/35 truncate">{r.email}</p>
                  </div>

                  <div className="text-[10px] text-white/15 shrink-0">
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
            <div className="rounded-xl border border-white/[0.06] p-8 text-center text-white/20 text-sm" style={{ background: 'rgba(255,255,255,0.02)' }}>
              暫無文字回饋
            </div>
          ) : (
            responses
              .filter(r => r.answers.feedback)
              .map(r => (
                <div key={r.id} className="rounded-xl border border-white/[0.06] p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/50">{r.name}</span>
                    <span className="text-[10px] text-white/20">
                      {new Date(r.submittedAt).toLocaleString('zh-TW')}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{r.answers.feedback}</p>
                </div>
              ))
          )}
        </div>
      )}

      {/* Raw data */}
      <details className="mt-8 rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <summary className="cursor-pointer text-xs text-white/20 hover:text-white/40 transition-colors">
          原始 JSON ({total} 筆)
        </summary>
        <pre className="mt-4 text-[10px] text-white/25 overflow-x-auto leading-relaxed">
          {JSON.stringify(responses, null, 2)}
        </pre>
      </details>
    </main>
  )
}
