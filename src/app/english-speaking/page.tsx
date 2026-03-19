'use client'

import { useState } from 'react'

export default function EnglishSpeakingPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [attendConfirm, setAttendConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) {
      alert('請輸入稱謂')
      return
    }

    if (!phone.trim()) {
      alert('請輸入電話')
      return
    }

    if (!attendConfirm) {
      alert('請確認願意準時出席')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/english-speaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
        }),
      })

      if (!res.ok) {
        const json = await res.json()
        alert(json.error ?? '提交失敗')
        return
      }

      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-14">
      {/* Hero */}
      <div className="text-center mb-8 max-w-xl">
        <div className="inline-flex items-center gap-2 bg-mint-soft text-mint rounded-full px-3.5 py-1 text-xs font-medium mb-5 border border-mint/15">
          <span>🗣️</span>
          <span>English Speaking Event</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black mb-3 leading-tight tracking-tight">
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, var(--theme-text), var(--theme-text-secondary))' }}>英文口說活動</span>
        </h1>
        <div className="space-y-2 mt-4">
          <p className="text-base sm:text-lg font-semibold" style={{ color: 'var(--theme-text-secondary)' }}>
            3/22（六）19:00 - 21:00
          </p>
          <a
            href="https://maps.google.com/maps/place//data=!4m2!3m1!1s0x34693de3e741f583:0x484147b10049d5ae?entry=s&sa=X&ved=2ahUKEwiNr_Cy5auTAxXssFYBHV7iLzkQ4kB6BAgUEAA&hl=zh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
          >
            📍 查看活動地點
          </a>
        </div>
      </div>

      <div className="w-full max-w-2xl space-y-6">
        {submitted ? (
          <div className="space-y-8 py-4">
            <div className="rounded-2xl p-5 sm:p-6 text-center space-y-3" style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-surface)' }}>
              <p className="text-2xl">🎉</p>
              <p className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>報名成功！</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text-tertiary)' }}>
                感謝你的報名，3/22 當天見！<br />
                報名費 $100 現場支付即可。
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="rounded-2xl p-5 sm:p-6 space-y-4" style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-surface)' }}>
              <p className="text-sm font-medium tracking-wide" style={{ color: 'var(--theme-text-tertiary)' }}>報名資料</p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: 'var(--theme-text-muted)' }}>
                    稱謂 <span className="text-red-400/70">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="你的稱謂"
                    className="w-full themed-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: 'var(--theme-text-muted)' }}>
                    電話 <span className="text-red-400/70">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="0912-345-678"
                    className="w-full themed-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: 'var(--theme-text-muted)' }}>
                    信箱 <span className="text-xs" style={{ color: 'var(--theme-text-faint)' }}>（選填）</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full themed-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/40 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Attendance confirmation */}
            <div className="rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-surface)' }}>
              <label
                className="flex items-start gap-3 cursor-pointer"
                style={{ color: attendConfirm ? 'var(--theme-text-secondary)' : 'var(--theme-text-tertiary)' }}
              >
                <input
                  type="checkbox"
                  checked={attendConfirm}
                  onChange={e => setAttendConfirm(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded"
                />
                <span className="text-sm leading-relaxed">
                  我願意準時出席（報名費 100 現場支付即可）
                  <span className="text-red-400/70 ml-1">*</span>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-accent hover:bg-accent/90 disabled:bg-accent/40 rounded-xl text-sm font-semibold transition-all active:scale-[0.99] text-white"
            >
              {submitting ? '提交中...' : '確認報名'}
            </button>
          </form>
        )}
      </div>

      <footer className="mt-16 text-center text-xs" style={{ color: 'var(--theme-text-faint)' }}>
        Powered by ClaudeBot
      </footer>
    </main>
  )
}
