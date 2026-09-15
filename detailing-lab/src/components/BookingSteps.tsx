export const BOOKING_STEPS = ['Service', 'Car', 'Location', 'Time', 'Confirm'] as const

/** Thin progress rail under the nav bar so the customer always knows how far in they are. */
export default function BookingSteps({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1.5 px-5 pb-3.5 pt-1">
      {BOOKING_STEPS.map((label, i) => (
        <div key={label} className="flex flex-1 flex-col gap-1.5">
          <div
            className={`h-[3px] rounded-full transition-colors duration-300 ${
              i <= current ? 'bg-aqua-400' : 'bg-ink-700'
            }`}
          />
          <span
            className={`text-[10px] font-medium transition-colors ${
              i === current ? 'text-aqua-400' : i < current ? 'text-white/40' : 'text-white/20'
            }`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
