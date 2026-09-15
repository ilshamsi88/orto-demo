import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import { NavBar, Screen } from '../components/Layout'
import {
  Bookmark,
  Calendar,
  Car as CarIcon,
  ChevronRight,
  Help,
  Pin,
  Settings,
  Tag,
  Trash,
  Wallet,
} from '../components/Icons'
import { useApp } from '../store/AppContext'
import { notifyMode, ownerNumber } from '../lib/whatsapp'

type RowKey = 'vehicles' | 'addresses' | 'payment' | 'promotions' | 'help' | 'settings'

export default function Profile() {
  const {
    customer,
    cars,
    locations,
    bookings,
    updateCustomer,
    removeCar,
    removeLocation,
    signOut,
    resetDemo,
  } = useApp()
  const navigate = useNavigate()
  const [open, setOpen] = useState<RowKey | null>(null)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(customer?.name ?? '')
  const [phone, setPhone] = useState(customer?.phone ?? '')
  const [email, setEmail] = useState(customer?.email ?? '')

  const initials = (customer?.name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')

  function save() {
    updateCustomer({ name: name.trim(), phone: phone.trim(), email: email.trim() || undefined })
    setEditing(false)
  }

  const rows: { key: RowKey; label: string; Icon: typeof CarIcon; count?: number }[] = [
    { key: 'vehicles', label: 'My Vehicles', Icon: CarIcon, count: cars.length },
    { key: 'addresses', label: 'Saved Addresses', Icon: Pin, count: locations.length },
    { key: 'payment', label: 'Payment Methods', Icon: Wallet },
    { key: 'promotions', label: 'Promotions', Icon: Tag },
    { key: 'help', label: 'Help & Support', Icon: Help },
    { key: 'settings', label: 'Settings', Icon: Settings },
  ]

  return (
    <>
      <StatusBar />
      <NavBar title="Profile" />
      <Screen withTabBar className="px-5">
        <div className="flex items-center gap-4">
          <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-blush-400 text-[19px] font-bold text-ink-950">
            {initials || 'DL'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[17px] font-semibold text-white">{customer?.name}</div>
            <div className="truncate text-[13px] text-white/45">
              {customer?.email || customer?.phone}
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="mt-2 rounded-full border border-blush-400/50 px-3.5 py-1 text-[12px] font-semibold text-blush-400 active:opacity-60"
            >
              {editing ? 'Close' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {editing && (
          <div className="card animate-sheet mt-4 space-y-3.5 p-4">
            <div>
              <label className="label" htmlFor="pname">
                Name
              </label>
              <input
                id="pname"
                className="field"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="pphone">
                Phone
              </label>
              <input
                id="pphone"
                className="field"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="pemail">
                Email
              </label>
              <input
                id="pemail"
                className="field"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="btn-primary !py-3.5" onClick={save}>
              Save changes
            </button>
          </div>
        )}

        <div className="card mt-5 divide-y divide-ink-700/50 overflow-hidden">
          {rows.map(({ key, label, Icon, count }) => (
            <div key={key}>
              <button
                onClick={() => setOpen(open === key ? null : key)}
                className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left"
              >
                <Icon className="h-[19px] w-[19px] shrink-0 text-white/55" />
                <span className="flex-1 text-[14.5px] text-white">{label}</span>
                {typeof count === 'number' && (
                  <span className="text-[13px] text-white/30">{count}</span>
                )}
                <ChevronRight
                  className={`h-4 w-4 shrink-0 text-white/25 transition-transform ${
                    open === key ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {open === key && (
                <div className="animate-sheet border-t border-ink-700/50 bg-ink-900/50 px-4 py-3.5">
                  {key === 'vehicles' &&
                    (cars.length === 0 ? (
                      <p className="text-[13px] text-white/40">
                        No vehicles yet — you'll add one on your first booking.
                      </p>
                    ) : (
                      <ul className="space-y-2.5">
                        {cars.map((c) => (
                          <li key={c.id} className="flex items-center gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-[13.5px] font-medium text-white">
                                {c.makeModel}
                              </div>
                              <div className="text-[12px] text-white/40">
                                {c.type} · {c.color} · {c.plate}
                              </div>
                            </div>
                            <button
                              onClick={() => removeCar(c.id)}
                              aria-label={`Remove ${c.makeModel}`}
                              className="p-1.5 text-white/25 active:text-rose-400"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ))}

                  {key === 'addresses' &&
                    (locations.length === 0 ? (
                      <p className="text-[13px] text-white/40">
                        No addresses yet — add one during your first booking.
                      </p>
                    ) : (
                      <ul className="space-y-2.5">
                        {locations.map((l) => (
                          <li key={l.id} className="flex items-start gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="text-[13.5px] font-medium text-white">{l.label}</div>
                              <div className="text-[12px] leading-relaxed text-white/40">
                                {l.address}
                              </div>
                            </div>
                            <button
                              onClick={() => removeLocation(l.id)}
                              aria-label={`Remove ${l.label}`}
                              className="p-1.5 text-white/25 active:text-rose-400"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ))}

                  {key === 'payment' && (
                    <p className="text-[13px] leading-relaxed text-white/40">
                      Card, Apple Pay and Cash on Arrival are offered at checkout. Stored cards
                      arrive with the live payment provider.
                    </p>
                  )}

                  {key === 'promotions' && (
                    <div className="rounded-xl border border-blush-400/30 bg-blush-400/[0.07] p-3.5">
                      <div className="text-[13.5px] font-semibold text-blush-400">
                        First wash — 20% off
                      </div>
                      <p className="mt-1 text-[12px] text-white/50">
                        Code <span className="font-semibold text-white">DLFIRST</span>. Sample
                        promotion for the demo.
                      </p>
                    </div>
                  )}

                  {key === 'help' && (
                    <div className="space-y-2 text-[13px] text-white/50">
                      <a href="tel:+97140000000" className="block font-semibold text-blush-400">
                        Call us: +971 4 000 0000
                      </a>
                      <a
                        href="https://wa.me/97140000000"
                        target="_blank"
                        rel="noreferrer"
                        className="block font-semibold text-blush-400"
                      >
                        WhatsApp support
                      </a>
                      <p>Open daily 8:00 AM – 8:00 PM.</p>
                    </div>
                  )}

                  {key === 'settings' && (
                    <div className="space-y-3">
                      <p className="text-[12.5px] leading-relaxed text-white/40">
                        WhatsApp mode:{' '}
                        <span className="font-semibold text-white">{notifyMode()}</span>
                        {ownerNumber()
                          ? ` · notifying ${ownerNumber()}`
                          : ' · no owner number set yet'}
                        <br />
                        {bookings.length} booking{bookings.length === 1 ? '' : 's'} stored on this
                        device.
                      </p>
                      <button
                        onClick={() => navigate('/admin')}
                        className="flex w-full items-center justify-between rounded-xl border border-ink-700 bg-ink-850 px-3.5 py-3 text-[13.5px] font-semibold text-white active:scale-[0.99]"
                      >
                        Open Admin Dashboard
                        <ChevronRight className="h-4 w-4 text-white/30" />
                      </button>
                      <button
                        onClick={() => {
                          resetDemo()
                          navigate('/welcome', { replace: true })
                        }}
                        className="w-full rounded-xl border border-ink-700 bg-ink-850 px-3.5 py-3 text-left text-[13.5px] font-semibold text-rose-400 active:scale-[0.99]"
                      >
                        Reset demo data
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={() => navigate('/bookings')}
            className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left"
          >
            <Calendar className="h-[19px] w-[19px] shrink-0 text-white/55" />
            <span className="flex-1 text-[14.5px] text-white">My Bookings</span>
            <span className="text-[13px] text-white/30">{bookings.length}</span>
            <ChevronRight className="h-4 w-4 shrink-0 text-white/25" />
          </button>
        </div>

        <button
          className="btn-outline mt-5"
          onClick={() => {
            signOut()
            navigate('/welcome', { replace: true })
          }}
        >
          <Bookmark className="hidden" />
          Log Out
        </button>

        <div className="h-6" />
      </Screen>
    </>
  )
}
