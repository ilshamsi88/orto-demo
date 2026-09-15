/**
 * The DETAILINGLAB wordmark, drawn as monoline vector paths rather than set in a
 * font.
 *
 * Why paths and not a webfont: the mark has to render identically in the app, in
 * the favicon, in the PWA manifest icon and in a social card. A webfont is a
 * network dependency that silently falls back to a generic sans — which for a
 * logo is worse than wrong, it looks broken. Paths also let the same letterforms
 * build the DL monogram.
 *
 * The letterforms follow the original: wide geometric caps, uniform stroke,
 * 20°-cut corners, flat-apex A. Closest typeface match is the Eurostile /
 * Good Times family; Orbitron is the nearest free equivalent.
 *
 * Grid: cap height 100, y=0 at cap line, y=100 at baseline. Stroke centrelines
 * are inset 5 units, so a 10-unit stroke sits flush inside the glyph box.
 */

export const CAP_HEIGHT = 100
export const STROKE = 9
export const LETTER_GAP = 29

interface Glyph {
  /** Advance width on the 100-unit cap-height grid. */
  w: number
  /** Monoline path, stroked not filled. */
  d: string
}

export const GLYPHS: Record<string, Glyph> = {
  D: { w: 86, d: 'M5,5 H62 L81,24 V76 L62,95 H5 Z' },
  E: { w: 78, d: 'M73,5 H5 V95 H73 M5,50 H61' },
  T: { w: 82, d: 'M5,5 H77 M41,5 V95' },
  A: { w: 88, d: 'M5,95 V24 L24,5 H64 L83,24 V95 M5,63 H83' },
  I: { w: 18, d: 'M9,5 V95' },
  L: { w: 76, d: 'M5,5 V95 H71' },
  N: { w: 86, d: 'M5,95 V5 L81,95 V5' },
  G: { w: 88, d: 'M83,24 L64,5 H24 L5,24 V76 L24,95 H64 L83,76 V54 H46' },
  B: { w: 84, d: 'M5,95 V5 H60 L79,22 V33 L62,50 H5 M5,50 H62 L79,67 V78 L60,95 H5' },
}

export interface LaidOutGlyph {
  key: string
  x: number
  d: string
}

/** Lays a word out left to right and reports its total width on the 100-unit grid. */
export function layout(word: string, gap = LETTER_GAP): { glyphs: LaidOutGlyph[]; width: number } {
  let x = 0
  const glyphs: LaidOutGlyph[] = []
  for (let i = 0; i < word.length; i++) {
    const g = GLYPHS[word[i]]
    if (!g) continue
    glyphs.push({ key: `${word[i]}-${i}`, x, d: g.d })
    x += g.w + (i === word.length - 1 ? 0 : gap)
  }
  return { glyphs, width: x }
}

export const WORDMARK = layout('DETAILINGLAB')
export const MONOGRAM = layout('DL')

/** The four-pointed sparkle, taller than it is wide, as in the original. */
export function sparklePath(rx: number, ry: number): string {
  const cx1 = rx * 0.12
  const cy1 = ry * 0.36
  const cx2 = rx * 0.44
  const cy2 = ry * 0.1
  return (
    `M0,${-ry} C${cx1},${-cy1} ${cx2},${-cy2} ${rx},0 ` +
    `C${cx2},${cy2} ${cx1},${cy1} 0,${ry} ` +
    `C${-cx1},${cy1} ${-cx2},${cy2} ${-rx},0 ` +
    `C${-cx2},${-cy2} ${-cx1},${-cy1} 0,${-ry} Z`
  )
}

/**
 * Point on a circle in SVG coordinates (y down): 0° is east, 90° south,
 * 270° north.
 */
export function pointOn(cx: number, cy: number, r: number, deg: number): [number, number] {
  const t = (deg * Math.PI) / 180
  return [cx + r * Math.cos(t), cy + r * Math.sin(t)]
}

/**
 * The badge's broken ring: two arcs with gaps at left and right, so the wordmark
 * can pass straight through them. `topGap`/`bottomGap` are the vertical offsets
 * of the break points as a fraction of the radius.
 */
export function brokenRing(
  cx: number,
  cy: number,
  r: number,
  topGap = 0.25,
  bottomGap = 0.3,
): { top: string; bottom: string } {
  const topDy = -topGap * r
  const topDx = Math.sqrt(Math.max(r * r - topDy * topDy, 0))
  const botDy = bottomGap * r
  const botDx = Math.sqrt(Math.max(r * r - botDy * botDy, 0))

  return {
    top:
      `M${cx - topDx},${cy + topDy} A${r},${r} 0 0 1 ${cx + topDx},${cy + topDy}`,
    bottom:
      `M${cx + botDx},${cy + botDy} A${r},${r} 0 0 1 ${cx - botDx},${cy + botDy}`,
  }
}
