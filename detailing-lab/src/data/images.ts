/**
 * Every image in the app resolves through this one map.
 *
 * The values are generated SVG placeholders so the demo ships without binary
 * assets. To use the real photos, drop them in `public/img/` and replace the
 * value with its path — e.g. `express: '/img/express-wash.jpg'`. Nothing else
 * in the codebase needs to change.
 */

interface PlaceholderOptions {
  /** Base hue of the bodywork, 0-360. */
  hue: number
  /** Silhouette shape. */
  shape: 'sedan' | 'suv' | 'interior' | 'detail' | 'van' | 'hero'
  /** Overall lightness, 0-1. */
  light?: number
}

function svg({ hue, shape, light = 0.5 }: PlaceholderOptions): string {
  const body =
    shape === 'suv' || shape === 'van'
      ? 'M28 150 L52 96 Q58 84 74 84 L188 84 Q204 84 214 96 L246 136 L286 144 Q300 147 300 160 L300 178 Q300 186 292 186 L30 186 Q22 186 22 178 L22 160 Q22 152 28 150 Z'
      : shape === 'interior'
        ? 'M20 186 L20 150 Q20 132 40 126 L96 110 Q118 80 150 80 L214 80 Q248 84 264 118 L296 136 Q308 144 308 162 L308 186 Z'
        : 'M24 158 L58 108 Q68 94 92 94 L186 94 Q206 94 220 106 L258 140 L292 150 Q304 154 304 166 L304 180 Q304 186 296 186 L30 186 Q22 186 22 180 L22 166 Q22 160 24 158 Z'

  const glass =
    shape === 'suv' || shape === 'van'
      ? 'M76 96 L184 96 Q194 96 200 104 L222 130 L74 130 Q66 130 66 122 L70 104 Q71 96 76 96 Z'
      : 'M92 104 L182 104 Q196 104 204 112 L228 136 L82 136 Q74 136 76 128 L84 110 Q86 104 92 104 Z'

  const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 220" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue} 14% ${Math.round(9 + light * 5)}%)"/>
      <stop offset="0.55" stop-color="hsl(${hue} 10% ${Math.round(5 + light * 3)}%)"/>
      <stop offset="1" stop-color="#070606"/>
    </linearGradient>
    <linearGradient id="paint" x1="0.1" y1="0" x2="0.9" y2="1">
      <stop offset="0" stop-color="hsl(${hue} 18% ${Math.round(26 + light * 22)}%)"/>
      <stop offset="0.5" stop-color="hsl(${hue} 14% ${Math.round(14 + light * 12)}%)"/>
      <stop offset="1" stop-color="hsl(${hue} 12% ${Math.round(8 + light * 6)}%)"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0.6">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.16"/>
      <stop offset="0.55" stop-color="#ffffff" stop-opacity="0.04"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="pool" cx="0.5" cy="1" r="0.75">
      <stop offset="0" stop-color="hsl(${hue} 30% 40%)" stop-opacity="0.32"/>
      <stop offset="1" stop-color="hsl(${hue} 30% 40%)" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="330" height="220" fill="url(#bg)"/>
  <ellipse cx="165" cy="206" rx="150" ry="42" fill="url(#pool)"/>
  <path d="${body}" fill="url(#paint)"/>
  <path d="${glass}" fill="hsl(${hue} 22% ${Math.round(30 + light * 18)}%)" opacity="0.55"/>
  <path d="${body}" fill="url(#sheen)"/>
  <circle cx="92" cy="186" r="22" fill="#0B0A0A"/>
  <circle cx="92" cy="186" r="10" fill="hsl(${hue} 8% 26%)"/>
  <circle cx="246" cy="186" r="22" fill="#0B0A0A"/>
  <circle cx="246" cy="186" r="10" fill="hsl(${hue} 8% 26%)"/>
  <rect x="290" y="150" width="16" height="7" rx="3.5" fill="#F2A9A0" opacity="0.8"/>
  <rect width="330" height="220" fill="none"/>
</svg>`

  return `data:image/svg+xml,${encodeURIComponent(s.replace(/\s+/g, ' '))}`
}

export const IMAGES: Record<string, string> = {
  // Service thumbnails
  express: svg({ hue: 210, shape: 'sedan', light: 0.62 }),
  premium: svg({ hue: 0, shape: 'sedan', light: 0.4 }),
  detailing: svg({ hue: 32, shape: 'suv', light: 0.5 }),
  interior: svg({ hue: 265, shape: 'interior', light: 0.45 }),
  ceramic: svg({ hue: 190, shape: 'sedan', light: 0.7 }),
  addons: svg({ hue: 120, shape: 'detail', light: 0.35 }),

  // Marketing
  welcome: svg({ hue: 8, shape: 'sedan', light: 0.28 }),
  heroVan: svg({ hue: 14, shape: 'van', light: 0.55 }),
}

export function imageFor(key?: string): string {
  return (key && IMAGES[key]) || IMAGES.express
}

/**
 * Portrait hero for the welcome screen. The landscape placeholders above crop
 * badly at full-screen phone aspect, so this one is drawn tall.
 */
function portraitHero(): string {
  const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="pbg" x1="0.2" y1="0" x2="0.8" y2="1">
      <stop offset="0" stop-color="#17100F"/>
      <stop offset="0.45" stop-color="#0D0A0A"/>
      <stop offset="1" stop-color="#060505"/>
    </linearGradient>
    <radialGradient id="pglow" cx="0.5" cy="0.62" r="0.55">
      <stop offset="0" stop-color="#F2A9A0" stop-opacity="0.2"/>
      <stop offset="1" stop-color="#F2A9A0" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="pbody" x1="0" y1="0" x2="1" y2="0.7">
      <stop offset="0" stop-color="#3A2E2C"/>
      <stop offset="0.45" stop-color="#1D1817"/>
      <stop offset="1" stop-color="#0C0A0A"/>
    </linearGradient>
    <linearGradient id="psheen" x1="0" y1="0" x2="1" y2="0.4">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="0.4" stop-color="#ffffff" stop-opacity="0.13"/>
      <stop offset="0.62" stop-color="#ffffff" stop-opacity="0.02"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="390" height="844" fill="url(#pbg)"/>
  <ellipse cx="195" cy="530" rx="260" ry="180" fill="url(#pglow)"/>
  <g transform="translate(0,398)">
    <path d="M-20 168 L26 76 Q42 48 86 48 L262 48 Q300 48 326 70 L392 128 L452 146 Q486 156 486 190 L486 214 Q486 228 468 228 L-18 228 Q-36 228 -36 210 L-36 186 Q-36 174 -20 168 Z" fill="url(#pbody)"/>
    <path d="M92 62 L258 62 Q282 62 296 76 L340 122 L74 122 Q58 122 62 106 L78 70 Q82 62 92 62 Z" fill="#2B2321" opacity="0.75"/>
    <path d="M-20 168 L26 76 Q42 48 86 48 L262 48 Q300 48 326 70 L392 128 L452 146 Q486 156 486 190 L486 214 Q486 228 468 228 L-18 228 Q-36 228 -36 210 L-36 186 Q-36 174 -20 168 Z" fill="url(#psheen)"/>
    <rect x="-34" y="150" width="54" height="13" rx="6.5" fill="#F2A9A0" opacity="0.85"/>
    <circle cx="96" cy="228" r="42" fill="#080707"/>
    <circle cx="96" cy="228" r="19" fill="#241E1D"/>
    <circle cx="372" cy="228" r="42" fill="#080707"/>
    <circle cx="372" cy="228" r="19" fill="#241E1D"/>
  </g>
</svg>`
  return `data:image/svg+xml,${encodeURIComponent(s.replace(/\s+/g, ' '))}`
}

IMAGES.welcome = portraitHero()
