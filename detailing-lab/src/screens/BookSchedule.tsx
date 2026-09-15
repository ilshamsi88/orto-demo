import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomBar, NavBar, Screen } from '../components/Layout'
import BookingSteps from '../components/BookingSteps'
import { useApp } from '../store/AppContext'
import { nextDays, slotsFor } from '../lib/slots'
import { duration, relativeDay, time12 } from '../lib/format'
import { Clock } from '../components/Icons'

export default function BookSchedule() {
  const { services, bookings, draft, setDraft } = useApp()
  const navigate = useNavigate()

  const service = services.find((s) => s.id === draft.serviceId)
  const days = useMemo(() => nextDays(14), [])
  const selectedDate = draft.date ?? days[0]

  const slots = useMemo(
    () => slotsFor(selectedDate, bookings, service?.durationMins ?? 60),
    [selectedDate, bookings, service?.durationMins],
  )

  const morning = slots.filter((s) => Number(s.time.slice(0, 2)) < 12)
  const afternoon = slots.filter((s) => {
    const h = Number(s.time.slice(0, 2))
    return h >= 12 && h < 17
  })
  const evening = slots.filter((s) => Number(s.time.slice(0, 2)) >= 17)

  const groups = [
    { name: 'Morning', items: morning },
    { name: 'Afternoon', items: afternoon },
    { name: 'Evening', items: evening },
  ].filter((g) => g.items.length > 0)

  const anyAvailable = slots.some((s) => s.available)

  return (
    <>
      <NavBar title="Pick a Time" back />
      <BookingSteps current={3} />
      <Screen>
        {service && (
          <div className="mx-5 mb-4 flex items-center gap-2.5 rounded-xl border border-ink-700/60 bg-ink-850 px-3.5 py-2.5 text-[13px] text-white/55">
            <Clock className="h-4 w-4 shrink-0 text-aqua-400" />
            <span>
              <span className="font-semibold text-white">{service.name}</span> takes about{' '}
              {duration(service.durationMins)}. We only show slots that fit.
            </span>
          </div>
        )}

        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-5 pb-1">
          {days.map((d) => {
            const date = new Date(`${d}T00:00:00`)
            const isSelected = selectedDate === d
            return (
              <button
                key={d}
                onClick={() => setDraft({ date: d, time: undefined })}
                className={`flex h-[72px] w-[58px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl border transition ${
                  isSelected
                    ? 'border-aqua-500/60 bg-aqua-500/12 text-white shadow-glow'
                    : 'border-ink-700 bg-ink-850 text-white/55'
                }`}
              >
                <span className="text-[10.5px] font-medium uppercase tracking-wide opacity-60">
                  {date.toLocaleDateString('en-GB', { weekday: 'short' })}
                </span>
                <span className="text-[19px] font-bold leading-none">{date.getDate()}</span>
                <span className="text-[10.5px] opacity-60">
                  {date.toLocaleDateString('en-GB', { month: 'short' })}
                </span>
              </button>
            )
          })}
        </div>

        <div className="px-5 pt-5">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/40">
            {relativeDay(selectedDate) ??
              new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
          </h2>
        </div>

        {!anyAvailable ? (
          <p className="px-5 py-10 text-center text-[14.5px] text-white/40">
            Fully booked on this day. Try another date.
          </p>
        ) : (
          groups.map((group) => (
            <div key={group.name} className="px-5 pt-4">
              <h3 className="mb-2.5 text-[12.5px] font-semibold text-white/35">{group.name}</h3>
              <div className="grid grid-cols-3 gap-2">
                {group.items.map((slot) => {
                  const isSelected = draft.time === slot.time && draft.date === selectedDate
                  return (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => setDraft({ date: selectedDate, time: slot.time })}
                      className={`rounded-xl border py-3 text-[14px] font-medium transition ${
                        isSelected
                          ? 'border-aqua-500/60 bg-aqua-500/14 text-aqua-400 shadow-glow'
                          : slot.available
                            ? 'border-ink-700 bg-ink-850 text-white/75 active:scale-[0.97]'
                            : 'border-ink-800 bg-ink-900/40 text-white/15 line-through'
                      }`}
                    >
                      {time12(slot.time)}
                    </button>
                  )
                })}
              </div>
            </div>
          ))
        )}

        <div className="h-28" />
      </Screen>

      <BottomBar>
        <button
          className="btn-primary"
          disabled={!draft.date || !draft.time}
          onClick={() => navigate('/book/summary')}
        >
          Review booking
        </button>
      </BottomBar>
    </>
  )
}
