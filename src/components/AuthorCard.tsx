export default function AuthorCard() {
  return (
    <div className="author-card relative rounded-2xl overflow-hidden">
      {/* Decorative glow blobs */}
      <div className="absolute top-0 left-1/4 w-48 h-24 bg-accent/[0.15] rounded-full blur-[60px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-40 h-20 bg-purple-500/[0.10] rounded-full blur-[50px] translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-32 h-32 bg-mint/[0.08] rounded-full blur-[50px] translate-x-1/2" />

      <div className="relative p-5 sm:p-6">
        {/* Header row */}
        <div className="flex items-center gap-4 mb-5">
          <img
            src="https://atighahaffsncaxggkdk.supabase.co/storage/v1/object/public/images/site_settings/optimized_ad090f23-54bb-47dd-830b-b9814e720eb9_default_instructor_avatar_url.webp"
            alt="html_cat"
            className="author-avatar-ring w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold tracking-tight" style={{ color: 'var(--theme-text)' }}>html_cat</p>
            <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>切版職人 · 全端開發者</p>
          </div>
          <div className="hidden sm:flex gap-1.5">
            <span className="text-[11px] px-2 py-1 rounded-md font-medium" style={{ color: 'var(--color-accent)', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>IG 3K+</span>
            <span className="text-[11px] px-2 py-1 rounded-md font-medium" style={{ color: 'var(--color-accent)', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>Threads 2K+</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { val: '3', label: '產品上線', color: 'text-accent' },
            { val: '5K+', label: '月活用戶', color: 'text-purple-400' },
            { val: '100W+', label: '總流量', color: 'text-mint' },
          ].map(({ val, label, color }) => (
            <div key={label} className="author-stat-card rounded-xl py-2.5 text-center">
              <p className={`text-xl font-bold ${color}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>{val}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--theme-text-muted)' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[11px] font-medium text-accent/80 bg-accent-soft rounded-full px-2.5 py-0.5 border border-accent/15">線上課程 · 六位數營收</span>
          <span className="text-[11px] font-medium text-purple-300/80 bg-purple-500/10 rounded-full px-2.5 py-0.5 border border-purple-400/15">10+ 開發工具</span>
          <span className="text-[11px] font-medium text-mint/80 bg-mint-soft rounded-full px-2.5 py-0.5 border border-mint/15">技術文章作者</span>
        </div>

        {/* Mobile badges */}
        <div className="flex sm:hidden gap-1.5 mt-3">
          <span className="text-[11px] px-2 py-1 rounded-md font-medium" style={{ color: 'var(--color-accent)', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>IG 3K+</span>
          <span className="text-[11px] px-2 py-1 rounded-md font-medium" style={{ color: 'var(--color-accent)', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>Threads 2K+</span>
        </div>
      </div>
    </div>
  )
}
