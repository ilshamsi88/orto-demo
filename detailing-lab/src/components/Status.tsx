import { BOOKING_STATUSES, type BookingStatus } from '../types'
import { Check } from './Icons'

const STYLES: Record<BookingStatus, { dot: string; chip: string }> = {
  Confirmed: { dot: 'bg-blush-400', chip: 'bg-blush-400/10 text-blush-400 border-blush-400/35' },
  'On the Way': { dot: 'bg-amber-400', chip: 'bg-amber-400/12 text-amber-300 border-amber-400/25' },
  Arrived: { dot: 'bg-violet-400', chip: 'bg-violet-400/12 text-violet-300 border-violet-400/25' },
  Washing: { dot: 'bg-sky-400', chip: 'bg-sky-400/12 text-sky-300 border-sky-400/25' },
  Completed: {
    dot: 'bg-emerald-400',
    chip: 'bg-emerald-400/12 text-emerald-300 border-emerald-400/25',
  },
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  const s = STYLES[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${s.chip}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  )
}

/** Vertical progress rail shown on a live booking. */
export function StatusTracker({ status }: { status: BookingStatus }) {
  const currentIndex = BOOKING_STATUSES.indexOf(status)

  return (
    <ol className="relative space-y-0">
      {BOOKING_STATUSES.map((step, i) => {
        const done = i < currentIndex
        const active = i === currentIndex
        const last = i === BOOKING_STATUSES.length - 1
        return (
          <li key={step} className="relative flex gap-3.5 pb-5 last:pb-0">
            {!last && (
              <span
                className={`absolute left-[11px] top-6 h-full w-px ${
                  done ? 'bg-blush-400/60' : 'bg-ink-700'
                }`}
              />
            )}
            <span
              className={`relative z-10 flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-full border-2 transition ${
                done
                  ? 'border-blush-500 bg-blush-500 text-ink-950'
                  : active
                    ? 'border-blush-400 bg-ink-950 text-blush-400 shadow-glow'
                    : 'border-ink-600 bg-ink-900'
              }`}
            >
              {done ? (
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              ) : active ? (
                <span className="h-2 w-2 rounded-full bg-blush-400" />
              ) : null}
            </span>
            <div className="pt-0.5">
              <div
                className={`text-[15px] ${
                  active ? 'font-semibold text-white' : done ? 'text-white/70' : 'text-white/30'
                }`}
              >
                {step}
              </div>
              {active && (
                <div className="mt-0.5 text-[12.5px] text-blush-400/80">Current status</div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
