import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import { Photo, Screen, Section } from '../components/Layout'
import { StatusBadge } from '../components/Status'
import {
  ArrowRight,
  Badge,
  Bell,
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  Leaf,
  Pin,
  Shield,
} from '../components/Icons'
import { useApp } from '../store/AppContext'
import { IMAGES, imageFor } from '../data/images'
import { isPast, relativeDay, shortDate, time12 } from '../lib/format'

const TRUST = [
  { Icon: Pin, title: 'Convenient', body: 'At Your Location' },
  { Icon: Badge, title: 'Professional', body: '& Trained Staff' },
  { Icon: Shield, title: 'Premium', body: 'Products' },
  { Icon: Leaf, title: 'Eco-Friendly', body: 'Water Saving' },
]

export default function Home() {
  const { bookings, resetDraft } = useApp()
  const navigate = useNavigate()

  const upcoming = bookings
    .filter((b) => b.status !== 'Completed' && !isPast(b.date, b.time))
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0]

  function startBooking() {
    resetDraft()
    navigate('/services')
  }

  return (
    <>
      <StatusBar />
      <Screen withTabBar>
        <div className="flex items-center justify-between px-5 pb-2 pt-1">
          <button className="flex items-center gap-1.5 text-[15px] font-medium text-white active:opacity-60">
            <Pin className="h-[17px] w-[17px] text-blush-400" />
            Dubai
            <ChevronDown className="h-4 w-4 text-white/40" />
          </button>
          <button
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center text-white/70 active:opacity-60"
          >
            <Bell className="h-[21px] w-[21px]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blush-400" />
          </button>
        </div>

        <div className="px-5 pt-3">
          <h1 className="font-display text-[34px] font-bold leading-[1.08] tracking-tight text-blush-400">
            Premium
            <br />
            Car Care
            <br />
            At Your Doorstep
          </h1>
          <p className="mt-3 max-w-[250px] text-[13.5px] leading-relaxed text-white/45">
            Professional car wash and detailing service anywhere in Dubai.
          </p>
        </div>

        <div className="px-5 pt-5">
          <div className="relative overflow-hidden rounded-2xl border border-ink-700/70">
            <img src={IMAGES.heroVan} alt="" className="h-[200px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <button className="btn-primary" onClick={startBooking}>
                Book a Service
                <ArrowRight className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 px-5 pt-3.5">
          {TRUST.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-1.5 rounded-2xl border border-ink-700/70 bg-ink-850 px-3 py-4 text-center"
            >
              <Icon className="h-[19px] w-[19px] text-blush-400" />
              <div className="text-[13px] font-semibold leading-tight text-white">{title}</div>
              <div className="text-[11.5px] leading-tight text-white/40">{body}</div>
            </div>
          ))}
        </div>

        {upcoming && (
          <Section
            title="Next Appointment"
            action={
              <button
                onClick={() => navigate('/bookings')}
                className="text-[13px] font-semibold text-blush-400 active:opacity-60"
              >
                See all
              </button>
            }
          >
            <button
              onClick={() => navigate(`/bookings/${upcoming.id}`)}
              className="card flex w-full items-center gap-3.5 p-3 text-left transition active:scale-[0.99]"
            >
              <Photo src={imageFor(upcoming.service.image)} className="h-[62px] w-[78px] shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-semibold text-white">
                  {upcoming.service.name}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-white/45">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-blush-400" />
                    {relativeDay(upcoming.date) ?? shortDate(upcoming.date)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-blush-400" />
                    {time12(upcoming.time)}
                  </span>
                </div>
                <div className="mt-1.5">
                  <StatusBadge status={upcoming.status} />
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-white/25" />
            </button>
          </Section>
        )}

        <div className="h-4" />
      </Screen>
    </>
  )
}
