'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SurveyForm from '@/components/SurveyForm'

export default function Home() {
  const { data: session, status } = useSession()
  const [submitted, setSubmitted] = useState(false)
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (session?.user?.email) {
      fetch('/api/survey')
        .then(r => r.json())
        .then(d => {
          setSubmitted(d.submitted)
          setChecking(false)
        })
        .catch(() => setChecking(false))
    } else {
      setChecking(false)
    }
  }, [session, status, router])

  async function handleSubmit(answers: Record<string, string | string[]>) {
    const res = await fetch('/api/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    })

    if (!res.ok) {
      const data = await res.json()
      alert(data.error ?? '提交失敗')
      return
    }

    setSubmitted(true)
  }

  if (status === 'loading' || checking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-white/40">載入中...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12 max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-sm mb-6">
          ✦ Powered by ClaudeBot
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          用 AI 打造你的開發工作流
        </h1>
        <p className="text-white/60 text-lg">
          課程興趣調查 — 幫我們了解你的需求，打造最適合的內容
        </p>
      </div>

      {/* Form */}
      <div className="w-full max-w-2xl">
        {submitted ? (
          <div className="text-center bg-white/5 backdrop-blur rounded-2xl p-12 border border-white/10">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-2xl font-bold mb-3">感謝你的回饋！</h2>
            <p className="text-white/60 mb-6">你的意見對我們很重要，課程準備好後會通知你</p>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-white/40 hover:text-white/60 transition-colors text-sm"
            >
              登出
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6 bg-white/5 rounded-xl p-4 border border-white/10">
              <span className="text-white/60 text-sm">{session?.user?.name} ({session?.user?.email})</span>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-white/30 hover:text-white/60 text-sm transition-colors"
              >
                登出
              </button>
            </div>
            <SurveyForm onSubmit={handleSubmit} />
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-white/20 text-sm">
        <p>Powered by <span className="text-blue-400/60">ClaudeBot</span> — Not a pipe to Claude. A command center on your phone.</p>
      </footer>
    </main>
  )
}
