import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function DetailRow({
  icon,
  label,
  value,
  sub,
  editTo,
}: {
  icon: ReactNode
  label: string
  value: ReactNode
  sub?: ReactNode
  editTo?: string
}) {
  return (
    <div className="flex items-start gap-3.5 px-4 py-3.5">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink-700 bg-ink-800 text-aqua-400">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[12px] font-medium uppercase tracking-wide text-white/35">{label}</div>
        <div className="mt-0.5 text-[15px] font-medium leading-snug text-white">{value}</div>
        {sub ? <div className="mt-0.5 text-[13px] leading-relaxed text-white/45">{sub}</div> : null}
      </div>
      {editTo ? (
        <Link
          to={editTo}
          className="shrink-0 pt-1 text-[13px] font-semibold text-aqua-400 active:opacity-60"
        >
          Edit
        </Link>
      ) : null}
    </div>
  )
}

export function PriceRow({
  label,
  value,
  strong = false,
  muted = false,
}: {
  label: string
  value: string
  strong?: boolean
  muted?: boolean
}) {
  return (
    <div
      className={`flex items-baseline justify-between ${
        strong ? 'border-t border-ink-700/60 pt-3 mt-1' : ''
      }`}
    >
      <span
        className={
          strong
            ? 'text-[15px] font-semibold text-white'
            : `text-[14px] ${muted ? 'text-white/40' : 'text-white/55'}`
        }
      >
        {label}
      </span>
      <span
        className={
          strong ? 'text-[20px] font-bold text-white' : `text-[14px] ${muted ? 'text-white/40' : 'text-white/75'}`
        }
      >
        {value}
      </span>
    </div>
  )
}
