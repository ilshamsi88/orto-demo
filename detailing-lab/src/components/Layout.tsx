import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Calendar, ChevronLeft, Home, Settings, User } from './Icons'

/**
 * Scrollable screen body with iOS safe-area padding.
 * `pad` adds the bottom tab bar clearance.
 */
export function Screen({
  children,
  className = '',
  withTabBar = false,
}: {
  children: ReactNode
  className?: string
  withTabBar?: boolean
}) {
  return (
    <div
      className={`no-scrollbar flex-1 overflow-y-auto overscroll-contain ${className}`}
      style={{ paddingBottom: withTabBar ? 'calc(88px + var(--safe-bottom))' : 'var(--safe-bottom)' }}
    >
      {children}
    </div>
  )
}

export function NavBar({
  title,
  back,
  right,
  large = false,
  transparent = false,
}: {
  title?: string
  back?: boolean | (() => void)
  right?: ReactNode
  large?: boolean
  transparent?: boolean
}) {
  const navigate = useNavigate()
  const onBack = typeof back === 'function' ? back : () => navigate(-1)

  return (
    <div
      className={`sticky top-0 z-30 ${
        transparent ? '' : 'border-b border-ink-700/50 bg-ink-950/85 backdrop-blur-xl'
      }`}
      style={{ paddingTop: 'var(--safe-top)' }}
    >
      <div className="flex h-[52px] items-center gap-2 px-2">
        <div className="flex w-16 justify-start">
          {back ? (
            <button
              onClick={onBack}
              aria-label="Back"
              className="flex items-center gap-0.5 rounded-full py-2 pl-1 pr-3 text-aqua-400 transition active:opacity-50"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="text-[16px]">Back</span>
            </button>
          ) : null}
        </div>
        <div className="flex-1 text-center text-[16px] font-semibold text-white">
          {large ? null : title}
        </div>
        <div className="flex w-16 items-center justify-end pr-1">{right}</div>
      </div>
      {large && title ? (
        <h1 className="px-5 pb-3 pt-1 text-[32px] font-bold leading-tight tracking-tight text-white">
          {title}
        </h1>
      ) : null}
    </div>
  )
}

const TABS = [
  { to: '/home', label: 'Home', Icon: Home },
  { to: '/bookings', label: 'Bookings', Icon: Calendar },
  { to: '/profile', label: 'Profile', Icon: User },
  { to: '/admin', label: 'Admin', Icon: Settings },
]

export function TabBar() {
  return (
    <nav
      className="absolute inset-x-0 bottom-0 z-40 border-t border-ink-700/60 bg-ink-950/90 backdrop-blur-xl"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <div className="flex h-[64px] items-stretch">
        {TABS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-1 pt-1.5 transition ${
                isActive ? 'text-aqua-400' : 'text-white/35'
              }`
            }
          >
            <Icon className="h-[23px] w-[23px]" />
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
      className="absolute inset-x-0 bottom-0 z-40 border-t border-ink-700/50 bg-ink-950/92 px-5 pt-3 backdrop-blur-xl"
      style={{ paddingBottom: 'calc(14px + var(--safe-bottom))' }}
    >
      {children}
    </div>
  )
}

export function Section({
  title,
  action,
  children,
}: {
  title?: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="px-5 pt-6">
      {title ? (
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/40">
            {title}
          </h2>
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
    <div className="flex flex-col items-center px-8 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-ink-700 bg-ink-850 text-white/30">
        {icon}
      </div>
      <h3 className="text-[17px] font-semibold text-white">{title}</h3>
      <p className="mt-1.5 max-w-[260px] text-[14px] leading-relaxed text-white/45">{body}</p>
      {action ? <div className="mt-6 w-full max-w-[240px]">{action}</div> : null}
    </div>
  )
}
