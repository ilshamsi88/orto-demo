import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Calendar, ChevronLeft, Home, Sparkle, User } from './Icons'

/** Scrollable screen body with iOS safe-area padding. */
export function Screen({
  children,
  className = '',
  withTabBar = false,
  withBottomBar = false,
}: {
  children: ReactNode
  className?: string
  withTabBar?: boolean
  withBottomBar?: boolean
}) {
  const pad = withTabBar
    ? 'calc(88px + var(--safe-bottom))'
    : withBottomBar
      ? 'calc(104px + var(--safe-bottom))'
      : 'var(--safe-bottom)'
  return (
    <div
      className={`no-scrollbar flex-1 overflow-y-auto overscroll-contain ${className}`}
      style={{ paddingBottom: pad }}
    >
      {children}
    </div>
  )
}

/**
 * Nav bar. `step` renders the reference's "Step 2/5" marker on the right.
 * `title`/`subtitle` render left-aligned, as in the mockup, not centred.
 */
export function NavBar({
  title,
  subtitle,
  back,
  right,
  step,
  accentTitle = false,
}: {
  title?: string
  subtitle?: string
  back?: boolean | (() => void)
  right?: ReactNode
  step?: [number, number]
  accentTitle?: boolean
}) {
  const navigate = useNavigate()
  const onBack = typeof back === 'function' ? back : () => navigate(-1)

  return (
    <div className="sticky top-0 z-30 bg-ink-950/92 backdrop-blur-xl">
      <div className="flex min-h-[40px] items-center gap-3 px-5 pt-1">
        {back ? (
          <button
            onClick={onBack}
            aria-label="Back"
            className="-ml-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition active:opacity-50"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        ) : null}
        <div className="flex-1" />
        {step ? (
          <span className="shrink-0 text-[12.5px] font-medium text-white/40">
            Step {step[0]}/{step[1]}
          </span>
        ) : null}
        {right}
      </div>
      {title ? (
        <div className="px-5 pb-3.5 pt-1">
          <h1
            className={`text-[26px] font-bold leading-tight tracking-tight ${
              accentTitle ? 'text-blush-400' : 'text-white'
            }`}
          >
            {title}
          </h1>
          {subtitle ? <p className="mt-1 text-[13.5px] text-white/45">{subtitle}</p> : null}
        </div>
      ) : null}
    </div>
  )
}

const TABS = [
  { to: '/home', label: 'Home', Icon: Home },
  { to: '/bookings', label: 'Bookings', Icon: Calendar },
  { to: '/services', label: 'Services', Icon: Sparkle },
  { to: '/profile', label: 'Profile', Icon: User },
]

export function TabBar() {
  return (
    <nav
      className="absolute inset-x-0 bottom-0 z-40 border-t border-ink-700/60 bg-ink-950/95 backdrop-blur-xl"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <div className="flex h-[62px] items-stretch">
        {TABS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-1 pt-1 transition ${
                isActive ? 'text-blush-400' : 'text-white/35'
              }`
            }
          >
            <Icon className="h-[22px] w-[22px]" />
            <span className="text-[10px] font-medium tracking-wide">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

/** Sticky bottom action area that sits above the home indicator. */
export function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 z-40 bg-gradient-to-t from-ink-950 via-ink-950/95 to-transparent px-5 pt-8"
      style={{ paddingBottom: 'calc(16px + var(--safe-bottom))' }}
    >
      {children}
    </div>
  )
}

export function Section({
  title,
  action,
  children,
  className = '',
}: {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`px-5 pt-6 ${className}`}>
      {title ? (
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-[15px] font-semibold text-white">{title}</h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  )
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center px-8 py-14 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-ink-700 bg-ink-850 text-white/30">
        {icon}
      </div>
      <h3 className="text-[17px] font-semibold text-white">{title}</h3>
      <p className="mt-1.5 max-w-[260px] text-[14px] leading-relaxed text-white/45">{body}</p>
      {action ? <div className="mt-6 w-full max-w-[240px]">{action}</div> : null}
    </div>
  )
}

/** Rounded photo tile used for services and booking cards. */
export function Photo({
  src,
  alt = '',
  className = '',
}: {
  src: string
  alt?: string
  className?: string
}) {
  return (
    <div className={`overflow-hidden rounded-xl bg-ink-800 ${className}`}>
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
    </div>
  )
}
