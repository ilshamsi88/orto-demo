/**
 * Mock iOS status bar. Purely cosmetic — it makes the web demo read as a native
 * app in screenshots and when shown on a laptop.
 */
export default function StatusBar({ dark = false }: { dark?: boolean }) {
  const tint = dark ? 'text-white' : 'text-white'
  return (
    <div
      className={`pointer-events-none relative z-50 flex h-[44px] shrink-0 items-end justify-between px-7 pb-1.5 text-[14px] font-semibold ${tint}`}
      style={{ paddingTop: 'var(--safe-top)' }}
      aria-hidden="true"
    >
      <span className="tracking-tight">9:41</span>
      <div className="flex items-center gap-1.5">
        {/* signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0.5" width="3" height="11.5" rx="1" opacity="0.4" />
        </svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 10.8l1.9-2.3a3 3 0 00-3.8 0L8 10.8z" />
          <path
            d="M2.6 4.3a8.4 8.4 0 0110.8 0"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M4.8 6.8a5.1 5.1 0 016.4 0"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        {/* battery */}
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
          <rect x="0.6" y="0.6" width="21" height="10.8" rx="3" stroke="currentColor" opacity="0.5" />
          <rect x="2.4" y="2.4" width="17" height="7.2" rx="1.8" fill="currentColor" />
          <path d="M23.4 4.2v3.6a2 2 0 000-3.6z" fill="currentColor" opacity="0.5" />
        </svg>
      </div>
    </div>
  )
}
