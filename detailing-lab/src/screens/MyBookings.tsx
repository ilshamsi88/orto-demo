import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import { EmptyState, NavBar, Photo, Screen } from '../components/Layout'
import { StatusBadge } from '../components/Status'
import { Calendar, ChevronRight } from '../components/Icons'
import { useApp } from '../store/AppContext'
import type { Booking } from '../types'
import { imageFor } from '../data/images'
import { aed, isPast, relativeDay, shortDate, time12 } from '../lib/format'

export default function MyBookings() {
  const { bookings, resetDraft, setDraft, cancelBooking } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null)

  const upcoming = bookings
    .filter((b) => b.status !== 'Completed' && !isPast(b.date, b.time))
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
  const past = bookings
    .filter((b) => b.status === 'Completed' || isPast(b.date, b.time))
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))

  function startReschedule(b: Booking) {
    resetDraft()
    setDraft({ rescheduleId: b.id, serviceId: b.service.id, date: b.date })
    navigate('/book/time')
  }

  const list = tab === 'upcoming' ? upcoming : past

  return (
    <>
      <StatusBar />
      <NavBar title="My Bookings" />
      <Screen withTabBar>
        <div className="flex gap-2 px-5 pb-1">
          {(['upcoming', 'past'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`chip capitalize ${tab === t ? 'chip-on' : 'chip-off'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <EmptyState
            icon={<Calendar className="h-7 w-7" />}
            title={tab === 'upcoming' ? 'No upcoming washes' : 'No past washes yet'}
            body={
              tab === 'upcoming'
                ? 'Book a wash and it will show up here with live status updates.'
                : 'Once a wash is completed it moves here for your records.'
            }
            action={
              tab === 'upcoming' ? (
                <button
                  className="btn-primary !py-3.5"
                  onClick={() => {
                    resetDraft()
                    navigate('/services')
                  }}
                >
                  Book a Service
                </button>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-3 px-5 pt-4">
            {list.map((b) => (
              <div key={b.id} className="card overflow-hidden">
                <button
                  onClick={() => navigate(`/bookings/${b.id}`)}
                  className="flex w-full items-center gap-3.5 p-3 text-left"
                >
                  <Photo src={imageFor(b.service.image)} className="h-[64px] w-[78px] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[15px] font-semibold text-white">
                      {b.service.name}
                    </div>
                    <div className="mt-0.5 text-[12.5px] text-white/45">{b.car.type}</div>
                    <div className="text-[12.5px] text-white/45">
                      {relativeDay(b.date) ?? shortDate(b.date)}, {time12(b.time)}
                    </div>
                    <div className="truncate text-[12.5px] text-white/45">
                      {b.location.address}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="text-[14px] font-bold text-white">{aed(b.total)}</span>
                    <ChevronRight className="h-4 w-4 text-white/25" />
                  </div>
                </button>

                <div className="flex items-center justify-between border-t border-ink-700/50 px-3 py-2.5">
                  <StatusBadge status={b.status} />
                  <span className="text-[11.5px] text-white/30">{b.orderNumber}</span>
                </div>

                {tab === 'upcoming' && (
                  <div className="border-t border-ink-700/50 p-3">
                    {confirmCancel === b.id ? (
                      <div className="animate-sheet">
                        <p className="mb-2.5 text-[12.5px] text-white/60">
                          Cancel this booking? Free up to 2 hours before your slot.
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setConfirmCancel(null)}
                            className="flex-1 rounded-xl border border-ink-700 bg-ink-800 py-2.5 text-[13.5px] font-semibold text-white active:scale-[0.98]"
                          >
                            Keep it
                          </button>
                          <button
                            onClick={() => {
                              cancelBooking(b.id)
                              setConfirmCancel(null)
                            }}
                            className="flex-1 rounded-xl bg-rose-500/90 py-2.5 text-[13.5px] font-semibold text-white active:scale-[0.98]"
                          >
                            Yes, cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startReschedule(b)}
                          className="flex-1 rounded-xl border border-blush-400/50 py-2.5 text-[13.5px] font-semibold text-blush-400 active:scale-[0.98]"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => setConfirmCancel(b.id)}
                          className="flex-1 rounded-xl border border-ink-700 bg-ink-800 py-2.5 text-[13.5px] font-semibold text-white/70 active:scale-[0.98]"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'upcoming' && past.length > 0 && (
          <div className="px-5 pt-7">
            <h2 className="mb-3 text-[15px] font-semibold text-white">Past Bookings</h2>
            <div className="space-y-3">
              {past.slice(0, 3).map((b) => (
                <button
                  key={b.id}
                  onClick={() => navigate(`/bookings/${b.id}`)}
                  className="card flex w-full items-center gap-3.5 p-3 text-left transition active:scale-[0.99]"
                >
                  <Photo src={imageFor(b.service.image)} className="h-[58px] w-[72px] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14.5px] font-semibold text-white">
                      {b.service.name}
                    </div>
                    <div className="mt-0.5 text-[12px] text-white/45">{b.car.type}</div>
                    <div className="text-[12px] text-white/45">
                      {shortDate(b.date)}, {time12(b.time)}
                    </div>
                    <div className="mt-1.5">
                      <StatusBadge status={b.status} />
                    </div>
                  </div>
                  <span className="shrink-0 text-[13.5px] font-bold text-white">
                    {aed(b.total)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="h-4" />
      </Screen>
    </>
  )
}
