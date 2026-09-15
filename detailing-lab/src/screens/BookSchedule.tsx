import { useMemo } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import { BottomBar, NavBar, Screen } from '../components/Layout'
import { ArrowRight } from '../components/Icons'
import { useApp } from '../store/AppContext'
import { nextDays, slotsFor } from '../lib/slots'
import { time12 } from '../lib/format'

export default function BookSchedule() {
  const { services, bookings, draft, setDraft, rescheduleBooking } = useApp()
  const navigate = useNavigate()

  const service = services.find((s) => s.id === draft.serviceId)
  const rescheduling = bookings.find((b) => b.id === draft.rescheduleId)
  const days = useMemo(() => nextDays(14), [])
  const selectedDate = draft.date ?? days[0]

  const durationMins = rescheduling?.service.durationMins ?? service?.durationMins ?? 60

  const slots = useMemo(
    () => slotsFor(selectedDate, bookings, durationMins, rescheduling?.id),
    [selectedDate, bookings, durationMins, rescheduling?.id],
  )

  if (!service && !rescheduling) return <Navigate to="/services" replace />

  const ready = Boolean(draft.date && draft.time)

  function next() {
    if (!ready) return
    if (rescheduling) {
      rescheduleBooking(rescheduling.id, draft.date!, draft.time!)
      navigate(`/bookings/${rescheduling.id}`, { replace: true })
      return
    }
    navigate('/book/payment')
  }

  return (
    <>
      <StatusBar />
      <NavBar
        title={rescheduling ? 'Reschedule' : 'Select Date & Time'}
        subtitle="Choose a date and available time slot"
        back
        step={rescheduling ? undefined : [3, 5]}
      />
      <Screen withBottomBar>
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-1">
          {days.map((d) => {
            const date = new Date(`${d}T00:00:00`)
            const on = selectedDate === d
            return (
              <button
                key={d}
                onClick={() => setDraft({ date: d, time: undefined })}
                className={`flex h-[74px] w-[56px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border transition ${
                  on
                    ? 'border-blush-400 bg-blush-400 text-ink-950'
                    : 'border-ink-700 bg-ink-850 text-white/55'
                }`}
              >
                <span className="text-[10.5px] font-medium uppercase tracking-wide opacity-70">
                  {date.toLocaleDateString('en-GB', { weekday: 'short' })}
                </span>
                <span className="text-[19px] font-bold leading-none">{date.getDate()}</span>
                <span className="text-[10.5px] opacity-70">
                  {date.toLocaleDateString('en-GB', { month: 'short' })}
                </span>
              </button>
            )
          })}
        </div>

        <h2 className="px-5 pb-3 pt-5 text-[15px] font-semibold text-white">Available time slots</h2>

        {slots.every((s) => !s.available) ? (
          <p className="px-5 py-10 text-center text-[14px] text-white/40">
            Fully booked on this day. Try another date.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2.5 px-5">
            {slots
              .filter((s) => s.reason !== 'full')
              .map((slot) => {
                const on = draft.time === slot.time && draft.date === selectedDate
                return (
                  <button
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => setDraft({ date: selectedDate, time: slot.time })}
                    className={`rounded-xl border py-3 text-[13.5px] font-medium transition ${
                      on
                        ? 'border-blush-400 bg-blush-400 text-ink-950'
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
        )}

        <div className="h-4" />
      </Screen>

      <BottomBar>
        <button className="btn-primary" disabled={!ready} onClick={next}>
          {rescheduling ? 'Confirm new time' : 'Next: Payment'}
          <ArrowRight className="h-[18px] w-[18px]" />
        </button>
      </BottomBar>
    </>
  )
}
