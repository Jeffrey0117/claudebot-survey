'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      name,
      email,
      code,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('驗證碼錯誤')
      return
    }

    router.push('/')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-sm mb-6">
            ✦ Powered by ClaudeBot
          </div>
          <h1 className="text-3xl font-bold mb-2">課程問卷登入</h1>
          <p className="text-white/50">輸入驗證碼即可填寫問卷</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10 space-y-5">
          <div>
            <label className="block text-sm text-white/60 mb-1">你的名字</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="怎麼稱呼你"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">驗證碼</label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="輸入分享的驗證碼"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 rounded-xl font-semibold transition-colors"
          >
            {loading ? '驗證中...' : '開始填寫'}
          </button>
        </form>
      </div>
    </main>
  )
}
