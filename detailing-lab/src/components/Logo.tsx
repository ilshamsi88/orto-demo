interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Placeholder Detailing Lab wordmark + droplet mark.
 * Swap this component for the real logo file when the owner supplies it —
 * nothing else in the app references the brand directly.
 */
export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const dims = {
    sm: { mark: 22, title: 'text-[13px]', sub: 'text-[8px] tracking-[0.34em]' },
    md: { mark: 30, title: 'text-[17px]', sub: 'text-[9px] tracking-[0.38em]' },
    lg: { mark: 46, title: 'text-[26px]', sub: 'text-[11px] tracking-[0.42em]' },
  }[size]

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width={dims.mark} height={dims.mark} viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <linearGradient id="dl-mark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5EE7F5" />
            <stop offset="1" stopColor="#0EA5BE" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="23" fill="none" stroke="url(#dl-mark)" strokeWidth="1.6" opacity="0.4" />
        <path d="M24 10c0 0 10 11.6 10 18a10 10 0 11-20 0c0-6.4 10-18 10-18z" fill="url(#dl-mark)" />
        <path d="M19 30a5 5 0 005 5" stroke="#07080A" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
      </svg>
      <div className="leading-none">
        <div className={`font-semibold ${dims.title} text-white`}>
          DETAILING <span className="text-aqua-400">LAB</span>
        </div>
        <div className={`mt-1 font-medium uppercase text-white/35 ${dims.sub}`}>
          Precision Car Care
        </div>
      </div>
    </div>
  )
}
