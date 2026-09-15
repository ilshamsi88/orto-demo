import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { Screen, Section } from '../components/Layout'
import { StatusBadge } from '../components/Status'
import { Calendar, ChevronRight, Clock, Droplet, Pin, Sparkle } from '../components/Icons'
import { useApp } from '../store/AppContext'
import { aed, duration, isPast, relativeDay, shortDate, time12 } from '../lib/format'

export default function Home() {
  const { customer, services, bookings, resetDraft } = useApp()
  const navigate = useNavigate()

  const firstName = customer?.name.split(' ')[0] ?? 'there'
  const upcoming = bookings
    .filter((b) => b.status !== 'Completed' && !isPast(b.date, b.time))
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0]

  const activeServices = services.filter((s) => !s.archived)

  function startBooking() {
    resetDraft()
    navigate('/book/service')
  }

  return (
    <Screen withTabBar>
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-[radial-gradient(110%_60%_at_50%_0%,rgba(34,211,238,0.14),transparent_70%)]" />

        <div className="relative px-5" style={{ paddingTop: 'calc(var(--safe-top) + 16px)' }}>
          <Logo size="sm" />

          <h1 className="mt-7 text-[28px] font-bold leading-tight tracking-tight text-white">
            Hello, {firstName}.
          </h1>
          <p className="mt-1.5 text-[15px] text-white/45">
            Ready when you are — we'll come to your car.
          </p>

          <button
            onClick={startBooking}
            className="group mt-6 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-aqua-400 to-aqua-600 p-[1px] shadow-glow transition active:scale-[0.985]"
          >
            <div className="flex items-center gap-4 rounded-[15px] bg-gradient-to-br from-aqua-400 to-aqua-600 px-5 py-5 text-left">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink-950/25">
                <Droplet className="h-6 w-6 text-ink-950" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="text-[18px] font-bold text-ink-950">Book a Wash</div>
                <div className="text-[13.5px] font-medium text-ink-950/65">
                  Pick a service, we handle the rest
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-ink-950/70" strokeWidth={2.4} />
            </div>
          </button>
        </div>
      </div>

      {upcoming && (
        <Section title="Next Appointment">
          <button
            onClick={() => navigate(`/bookings/${upcoming.id}`)}
            className="card w-full p-4 text-left transition active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-[16px] font-semibold text-white">
                  {upcoming.service.name}
                </div>
                <div className="mt-0.5 truncate text-[13.5px] text-white/45">
                  {upcoming.car.makeModel} · {upcoming.car.plate}
                </div>
              </div>
              <StatusBadge status={upcoming.status} />
            </div>
            <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-ink-700/60 pt-3 text-[13px] text-white/55">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-aqua-400" />
                {relativeDay(upcoming.date) ?? shortDate(upcoming.date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-aqua-400" />
                {time12(upcoming.time)}
              </span>
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <Pin className="h-4 w-4 shrink-0 text-aqua-400" />
                <span className="truncate">{upcoming.location.label}</span>
              </span>
            </div>
          </button>
        </Section>
      )}

      <Section
        title="Our Services"
        action={
          <button
            onClick={startBooking}
            className="text-[13px] font-semibold text-aqua-400 active:opacity-60"
          >
            See all
          </button>
        }
      >
        <div className="space-y-2.5">
          {activeServices.slice(0, 4).map((s) => (
            <button
              key={s.id}
              onClick={startBooking}
              className="card flex w-full items-center gap-4 p-4 text-left transition active:scale-[0.99]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ink-700 bg-ink-800 text-aqua-400">
                <Droplet className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-[15.5px] font-semibold leading-tight text-white">
                    {s.name}
                  </span>
                  {s.popular && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-aqua-500/25 bg-aqua-500/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-aqua-400">
                      <Sparkle className="h-2.5 w-2.5" />
                      Popular
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-[13px] text-white/40">{duration(s.durationMins)}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[15px] font-bold text-white">{aed(s.price)}</div>
                <div className="text-[11px] text-white/35">from</div>
              </div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Why Detailing Lab">
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { k: 'We come to you', v: 'Home, office or valet parking' },
            { k: 'Water-saving', v: 'Under 12 litres per wash' },
            { k: 'Insured team', v: 'Trained, uniformed detailers' },
            { k: 'Pay after', v: 'No charge until the job is done' },
          ].map((item) => (
            <div key={item.k} className="card p-3.5">
              <div className="text-[13.5px] font-semibold text-white">{item.k}</div>
              <div className="mt-1 text-[12px] leading-relaxed text-white/40">{item.v}</div>
            </div>
          ))}
        </div>
      </Section>

      <div className="h-4" />
    </Screen>
  )
}
