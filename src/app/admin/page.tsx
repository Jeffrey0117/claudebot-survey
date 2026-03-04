'use client'

import { useSession, signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'

interface SurveyResponse {
  readonly id: string
  readonly email: string
  readonly name: string
  readonly answers: Record<string, string | string[]>
  readonly submittedAt: string
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [total, setTotal] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetch('/api/admin')
        .then(r => r.json())
        .then(d => {
          if (d.error) {
            setError(d.error)
          } else {
            setResponses(d.responses)
            setTotal(d.total)
          }
          setLoading(false)
        })
        .catch(() => {
          setError('載入失敗')
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [session])

  // Aggregate stats
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

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center text-white/40">載入中...</div>
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button
          onClick={() => signIn('google')}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-500 transition-colors"
        >
          管理員登入
        </button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    )
  }

  const questionLabels: Record<string, string> = {
    interest: '課程興趣',
    ai_usage: 'AI 使用頻率',
    tools: '使用過的工具',
    topics: '想學的主題',
    format: '偏好上課方式',
  }

  return (
    <main className="min-h-screen px-4 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">📊 問卷結果</h1>
      <p className="text-white/40 mb-8">共 {total} 份回覆</p>

      {/* Stats cards */}
      <div className="grid gap-6 mb-12">
        {Object.entries(questionLabels).map(([qId, label]) => {
          const counts = countAnswers(qId)
          const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
          if (entries.length === 0) return null
          return (
            <div key={qId} className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-semibold text-blue-300 mb-4">{label}</h3>
              <div className="space-y-2">
                {entries.map(([val, count]) => {
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0
                  return (
                    <div key={val} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{val}</span>
                          <span className="text-white/40">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Text feedback */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
        <h3 className="font-semibold text-blue-300 mb-4">文字回饋</h3>
        {responses.filter(r => r.answers.feedback).length === 0 ? (
          <p className="text-white/30">暫無</p>
        ) : (
          <div className="space-y-3">
            {responses
              .filter(r => r.answers.feedback)
              .map(r => (
                <div key={r.id} className="bg-white/5 rounded-lg p-4">
                  <p className="text-white/60 text-sm mb-1">{r.name} — {new Date(r.submittedAt).toLocaleString('zh-TW')}</p>
                  <p>{r.answers.feedback}</p>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Raw data */}
      <details className="bg-white/5 rounded-xl p-6 border border-white/10">
        <summary className="cursor-pointer text-white/40 hover:text-white/60 transition-colors">
          查看原始資料 ({total} 筆)
        </summary>
        <pre className="mt-4 text-xs text-white/40 overflow-x-auto">
          {JSON.stringify(responses, null, 2)}
        </pre>
      </details>
    </main>
  )
}
