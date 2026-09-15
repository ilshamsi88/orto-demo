import { useId } from 'react'
import {
  MONOGRAM,
  STROKE,
  WORDMARK,
  brokenRing,
  sparklePath,
} from './brand/glyphs'

export type LogoVariant = 'crest' | 'lockup' | 'monogram'

interface LogoProps {
  /**
   * crest    — the full badge. Needs ~180px+ to stay legible.
   * lockup   — wordmark + subline, no ring. For headers and nav bars.
   * monogram — DL in the broken ring. The only variant that survives an app icon.
   */
  variant?: LogoVariant
  /** Rendered width in px. Height follows the variant's aspect ratio. */
  width?: number
  className?: string
  /**
   * Flat rose instead of the metallic gradient. The gradient needs area to read;
   * below ~40px it turns to noise, so small sizes go flat.
   */
  flat?: boolean
  /** Extra stroke weight for very small sizes. 1 = normal. */
  weight?: number
  /** Monogram only: drop the ring, leaving just DL. For 16-24px. */
  bare?: boolean
  title?: string
}

const ROSE = '#F2A9A0'

export default function Logo({
  variant = 'crest',
  width,
  className = '',
  flat = false,
  weight = 1,
  bare = false,
  title = 'Detailing Lab',
}: LogoProps) {
  const uid = useId().replace(/:/g, '')
  const gid = `dl-gold-${uid}`
  const paint = flat ? ROSE : `url(#${gid})`

  if (variant === 'monogram')
    return <Monogram {...{ gid, paint, width, className, weight, title, bare }} />
  if (variant === 'lockup') return <Lockup {...{ gid, paint, width, className, weight, title }} />
  return <Crest {...{ gid, paint, width, className, weight, title }} />
}

/**
 * Rose gold: light-dark-light banding is what reads as metal.
 *
 * userSpaceOnUse, not the default objectBoundingBox — the I and T stems are
 * zero-width paths, and SVG does not paint an objectBoundingBox gradient onto a
 * box that is empty in one dimension, so those strokes came out invisible. User
 * space also runs one continuous sheen across the whole mark instead of
 * restarting it inside every letter, which is how real metal reads.
 */
function GoldDefs({ id, x2, y2 }: { id: string; x2: number; y2: number }) {
  return (
    <defs>
      <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={x2} y2={y2}>
        <stop offset="0" stopColor="#FBDDD8" />
        <stop offset="0.28" stopColor="#F2A9A0" />
        <stop offset="0.5" stopColor="#C97F78" />
        <stop offset="0.72" stopColor="#F7C5BE" />
        <stop offset="1" stopColor="#D68A82" />
      </linearGradient>
    </defs>
  )
}

interface PartProps {
  gid: string
  paint: string
  width?: number
  className?: string
  weight: number
  title: string
  bare?: boolean
}

/* ------------------------------------------------------------------ crest */

function Crest({ gid, paint, width, className, weight, title }: PartProps) {
  const CX = 700
  const CY = 430
  const R = 380
  const ring = brokenRing(CX, CY, R)

  // Wordmark sized off the radius, matching the original's proportions: it is
  // 3.2x the ring's radius wide, so it breaks through the gaps on both sides.
  const s = 1.04
  const wmW = WORDMARK.width * s
  const wmX = CX - wmW / 2
  const wmY = CY - (100 * s) / 2

  const ARC_R = 314

  return (
    <svg
      viewBox="0 0 1400 860"
      width={width}
      className={className}
      role="img"
      aria-label={title}
      style={width ? undefined : { width: '100%' }}
    >
      <GoldDefs id={gid} x2={520} y2={860} />
      <g fill="none" stroke={paint} strokeLinecap="round" strokeLinejoin="round">
        <path d={ring.top} strokeWidth={7 * weight} />
        <path d={ring.bottom} strokeWidth={7 * weight} />
      </g>

      {/* Curved supporting text */}
      <defs>
        <path
          id={`dl-arc-${title.length}-${CX}`}
          d={`M${CX - ARC_R},${CY} A${ARC_R},${ARC_R} 0 0 1 ${CX + ARC_R},${CY}`}
          fill="none"
        />
      </defs>
      <text
        fill={paint}
        fontSize="46"
        letterSpacing="19"
        fontFamily="'Helvetica Neue', Arial, sans-serif"
      >
        <textPath href={`#dl-arc-${title.length}-${CX}`} startOffset="50%" textAnchor="middle">
          PREMIUM CAR CARE
        </textPath>
      </text>

      <path d={sparklePath(30, 47)} fill={paint} transform={`translate(${CX} 283)`} />

      <g
        transform={`translate(${wmX} ${wmY}) scale(${s})`}
        fill="none"
        stroke={paint}
        strokeWidth={STROKE * weight}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {WORDMARK.glyphs.map((g) => (
          <path key={g.key} d={g.d} transform={`translate(${g.x} 0)`} />
        ))}
      </g>

      <text
        x={CX}
        y="556"
        textAnchor="middle"
        fill={paint}
        fontSize="42"
        letterSpacing="14"
        fontFamily="'Helvetica Neue', Arial, sans-serif"
      >
        CAR WASH &amp; DETAILING
      </text>

      {/* Divider with its own small sparkle */}
      <g stroke={paint} strokeWidth={4 * weight} strokeLinecap="round">
        <path d={`M${CX - 200},647 H${CX - 34}`} />
        <path d={`M${CX + 34},647 H${CX + 200}`} />
      </g>
      <path d={sparklePath(11, 17)} fill={paint} transform={`translate(${CX} 647)`} />

      <text
        x={CX}
        y="722"
        textAnchor="middle"
        fill={paint}
        fontSize="29"
        letterSpacing="8"
        fontFamily="'Helvetica Neue', Arial, sans-serif"
      >
        EST. 2026
      </text>
    </svg>
  )
}

/* ----------------------------------------------------------------- lockup */

function Lockup({ gid, paint, width, className, weight, title }: PartProps) {
  const W = 1300
  const wmX = (W - WORDMARK.width) / 2

  return (
    <svg
      viewBox="0 0 1300 290"
      width={width}
      className={className}
      role="img"
      aria-label={title}
      style={width ? undefined : { width: '100%' }}
    >
      <GoldDefs id={gid} x2={340} y2={290} />
      <path d={sparklePath(20, 32)} fill={paint} transform="translate(650 48)" />
      <g
        transform={`translate(${wmX} 108)`}
        fill="none"
        stroke={paint}
        strokeWidth={STROKE * weight}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {WORDMARK.glyphs.map((g) => (
          <path key={g.key} d={g.d} transform={`translate(${g.x} 0)`} />
        ))}
      </g>
      <text
        x="650"
        y="272"
        textAnchor="middle"
        fill={paint}
        fontSize="40"
        letterSpacing="13"
        fontFamily="'Helvetica Neue', Arial, sans-serif"
      >
        CAR WASH &amp; DETAILING
      </text>
    </svg>
  )
}

/* --------------------------------------------------------------- monogram */

function Monogram({ gid, paint, width, className, weight, title, bare }: PartProps) {
  const CX = 200
  const CY = 200
  const R = 150
  const ring = brokenRing(CX, CY, R)

  // Without the ring the monogram can fill the box, which is what buys back
  // legibility at favicon size.
  const s = bare ? 1.85 : 1.12
  const mgW = MONOGRAM.width * s
  const showSparkle = !bare && weight < 1.4 // dropped on the smallest, heaviest cut

  return (
    <svg
      viewBox="0 0 400 400"
      width={width}
      className={className}
      role="img"
      aria-label={title}
      style={width ? undefined : { width: '100%' }}
    >
      <GoldDefs id={gid} x2={170} y2={400} />
      {!bare && (
        <g fill="none" stroke={paint} strokeLinecap="round" strokeLinejoin="round">
          <path d={ring.top} strokeWidth={9 * weight} />
          <path d={ring.bottom} strokeWidth={9 * weight} />
        </g>
      )}

      {showSparkle && (
        <path d={sparklePath(16, 25)} fill={paint} transform={`translate(${CX} 100)`} />
      )}

      <g
        transform={`translate(${CX - mgW / 2} ${CY - (100 * s) / 2}) scale(${s})`}
        fill="none"
        stroke={paint}
        strokeWidth={STROKE * weight}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {MONOGRAM.glyphs.map((g) => (
          <path key={g.key} d={g.d} transform={`translate(${g.x} 0)`} />
        ))}
      </g>
    </svg>
  )
}
