import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmptyState, NavBar, Screen } from '../components/Layout'
import { StatusBadge } from '../components/Status'
import { Calendar, ChevronRight, Clock, Pin } from '../components/Icons'
import { useApp } from '../store/AppContext'
import { aed, isPast, relativeDay, shortDate, time12 } from '../lib/format'

export default function MyBookings() {
  const { bookings, resetDraft } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'upcoming' | 'previous'>('upcoming')

  const sorted = [...bookings].sort((a, b) =>
    `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`),
  )
  const upcoming = sorted
    .filter((b) => b.status !== 'Completed' && !isPast(b.date, b.time))
    .reverse()
  const previous = sorted.filter((b) => b.status === 'Completed' || isPast(b.date, b.time))

  const list = tab === 'upcoming' ? upcoming : previous

  return (
    <>
      <NavBar title="My Bookings" large />
      <Screen withTabBar>
        <div className="px-5 pb-1">
          <div className="flex rounded-xl border border-ink-700 bg-ink-850 p-1">
            {(['upcoming', 'previous'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-lg py-2.5 text-[14px] font-semibold capitalize transition ${
                  tab === t ? 'bg-ink-700 text-white' : 'text-white/45'
                }`}
              >
                {t}
                <span className="ml-1.5 text-[12px] opacity-50">
                  {t === 'upcoming' ? upcoming.length : previous.length}
                </span>
              </button>
            ))}
          </div>
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
                    navigate('/book/service')
                  }}
                >
                  Book a Wash
                </button>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-2.5 px-5 pt-4">
            {list.map((b) => (
              <button
                key={b.id}
                onClick={() => navigate(`/bookings/${b.id}`)}
                className="card w-full p-4 text-left transition active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-[16px] font-semibold text-white">
                      {b.service.name}
                    </div>
                    <div className="mt-0.5 truncate text-[13px] text-white/45">
                      {b.car.makeModel} · {b.car.plate}
                    </div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                <div className="mt-3.5 flex items-center justify-between border-t border-ink-700/60 pt-3">
                  <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[12.5px] text-white/50">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-aqua-400" />
                      {relativeDay(b.date) ?? shortDate(b.date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-aqua-400" />
                      {time12(b.time)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Pin className="h-3.5 w-3.5 text-aqua-400" />
                      {b.location.label}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 pl-2">
                    <span className="text-[14px] font-bold text-white">{aed(b.total)}</span>
                    <ChevronRight className="h-4 w-4 text-white/25" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="h-4" />
      </Screen>
    </>
  )
}
