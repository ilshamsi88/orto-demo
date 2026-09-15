interface LogoProps {
  size?: number
  className?: string
  /** Wordmark only, for tight headers. */
  compact?: boolean
}

/**
 * Detailing Lab crest — a circular badge wordmark.
 * Placeholder: swap this component's SVG for the real logo file when supplied.
 * Nothing else in the app draws the brand.
 */
export default function Logo({ size = 120, className = '', compact = false }: LogoProps) {
  if (compact) {
    return (
      <div className={`leading-none ${className}`}>
        <div className="font-display text-[19px] font-semibold tracking-[0.06em] text-white">
          DETAILING<span className="text-blush-400">LAB</span>
        </div>
        <div className="mt-1 text-[7.5px] font-medium uppercase tracking-[0.42em] text-white/35">
          Premium Car Care
        </div>
      </div>
    )
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Detailing Lab"
    >
      <defs>
        <path id="dl-arc-top" d="M 100,100 m -74,0 a 74,74 0 1,1 148,0" fill="none" />
        <path id="dl-arc-bottom" d="M 100,100 m -78,0 a 78,78 0 1,0 156,0" fill="none" />
      </defs>

      <circle cx="100" cy="100" r="96" fill="none" stroke="#F2A9A0" strokeWidth="1" opacity="0.32" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="#F2A9A0" strokeWidth="1.6" opacity="0.7" />

      <text
        fill="#F2A9A0"
        fontSize="11"
        letterSpacing="5.2"
        fontFamily="Georgia, serif"
        opacity="0.85"
      >
        <textPath href="#dl-arc-top" startOffset="50%" textAnchor="middle">
          PREMIUM CAR CARE
        </textPath>
      </text>

      <text
        fill="#F2A9A0"
        fontSize="10"
        letterSpacing="4.6"
        fontFamily="Georgia, serif"
        opacity="0.6"
      >
        <textPath href="#dl-arc-bottom" startOffset="50%" textAnchor="middle">
          EST. 2025
        </textPath>
      </text>

      <text
        x="100"
        y="92"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="25"
        fontFamily="Georgia, serif"
        letterSpacing="1.2"
      >
        DETAILING
      </text>
      <text
        x="100"
        y="118"
        textAnchor="middle"
        fill="#F2A9A0"
        fontSize="25"
        fontFamily="Georgia, serif"
        letterSpacing="5"
      >
        LAB
      </text>

      <line x1="64" y1="128" x2="136" y2="128" stroke="#F2A9A0" strokeWidth="0.9" opacity="0.5" />
      <text
        x="100"
        y="142"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="8.5"
        letterSpacing="3.4"
        opacity="0.55"
        fontFamily="Georgia, serif"
      >
        CAR WASH / DETAILING
      </text>
    </svg>
  )
}
