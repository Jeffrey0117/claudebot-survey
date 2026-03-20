interface CouponCardProps {
  readonly code: string
  readonly amount: number
  readonly currency: string
  readonly label: string
}

export default function CouponCard({ code, amount, currency, label }: CouponCardProps) {
  const holes = Array.from({ length: 8 })

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Coupon ticket */}
      <div className="relative coupon-pattern rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.06) 0%, rgba(59,130,246,0.04) 100%)', border: '1px solid var(--theme-border)' }}>
        {/* Shimmer overlay */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="coupon-shimmer absolute inset-0" style={{ background: `linear-gradient(to right, transparent, var(--theme-shimmer), transparent)` }} />
        </div>

        {/* Perforation edges */}
        <div className="coupon-edge-left">
          {holes.map((_, i) => <div key={i} className="coupon-hole" />)}
        </div>
        <div className="coupon-edge-right">
          {holes.map((_, i) => <div key={i} className="coupon-hole" />)}
        </div>

        <div className="relative px-8 sm:px-12 py-8 sm:py-10">
          {/* Top label */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--theme-text-muted)' }}>
              Course Coupon
            </span>
            <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--theme-text-faint)' }}>
              #2025
            </span>
          </div>

          {/* Amount */}
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-lg text-mint/60 font-medium">{currency}</span>
              <span className="text-6xl sm:text-7xl font-black text-mint tracking-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{amount}</span>
            </div>
            <p className="text-sm mt-2" style={{ color: 'var(--theme-text-tertiary)' }}>{label}</p>
          </div>

          {/* Dashed separator */}
          <div className="my-6" style={{ borderTop: '2px dashed var(--theme-border)' }} />

          {/* Code */}
          <div className="text-center space-y-3">
            <p className="text-xs tracking-wider uppercase" style={{ color: 'var(--theme-text-muted)' }}>折扣碼</p>
            <div className="inline-block border border-mint/20 rounded-lg px-6 py-3" style={{ background: 'var(--theme-surface)' }}>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-[0.15em] text-mint code-glow" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {code}
              </span>
            </div>
          </div>

          {/* Bottom info */}
          <div className="mt-8 flex items-center justify-between text-xs" style={{ color: 'var(--theme-text-faint)' }}>
            <span>使用 Claude Code 開發</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>html_cat</span>
          </div>
        </div>
      </div>

      {/* Instructions below coupon */}
      <div className="mt-5 text-center space-y-2">
        <p className="text-sm" style={{ color: 'var(--theme-text-tertiary)' }}>請截圖或記住折扣碼，購課時可折抵 {currency}{amount}</p>
      </div>
    </div>
  )
}
