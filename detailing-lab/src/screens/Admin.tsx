import { useMemo, useState } from 'react'
import { NavBar, Screen, Section } from '../components/Layout'
import { StatusBadge } from '../components/Status'
import { Check, ChevronRight, Phone, Pin, Plus, Trash, WhatsApp } from '../components/Icons'
import { useApp } from '../store/AppContext'
import { BOOKING_STATUSES, type BookingStatus, type Service } from '../types'
import { aed, duration, isPast, mapsLink, shortDate, time12 } from '../lib/format'
import { uid } from '../lib/storage'

export default function Admin() {
  const [tab, setTab] = useState<'bookings' | 'services'>('bookings')

  return (
    <>
      <NavBar title="Admin" large />
      <Screen withTabBar>
        <div className="px-5 pb-1">
          <div className="flex rounded-xl border border-ink-700 bg-ink-850 p-1">
            {(['bookings', 'services'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-lg py-2.5 text-[14px] font-semibold capitalize transition ${
                  tab === t ? 'bg-ink-700 text-white' : 'text-white/45'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {tab === 'bookings' ? <AdminBookings /> : <AdminServices />}
        <div className="h-4" />
      </Screen>
    </>
  )
}

function AdminBookings() {
  const { bookings, setBookingStatus } = useApp()
  const [open, setOpen] = useState<string | null>(null)
  const [filter, setFilter] = useState<'active' | 'all'>('active')

  const rows = useMemo(() => {
    const sorted = [...bookings].sort((a, b) =>
      `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`),
    )
    return filter === 'active'
      ? sorted.filter((b) => b.status !== 'Completed' && !isPast(b.date, b.time))
      : sorted.reverse()
  }, [bookings, filter])

  const todayCount = bookings.filter(
    (b) => b.date === new Date().toISOString().slice(0, 10),
  ).length
  const revenue = bookings
    .filter((b) => b.status === 'Completed')
    .reduce((sum, b) => sum + b.total, 0)

  return (
    <>
      <Section>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: 'Today', value: String(todayCount) },
            { label: 'All bookings', value: String(bookings.length) },
            { label: 'Collected', value: aed(revenue) },
          ].map((s) => (
            <div key={s.label} className="card p-3.5">
              <div className="text-[17px] font-bold leading-tight text-white">{s.value}</div>
              <div className="mt-1 text-[11.5px] text-white/40">{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title={filter === 'active' ? 'Active Jobs' : 'All Jobs'}
        action={
          <button
            onClick={() => setFilter(filter === 'active' ? 'all' : 'active')}
            className="text-[13px] font-semibold text-aqua-400 active:opacity-60"
          >
            {filter === 'active' ? 'Show all' : 'Show active'}
          </button>
        }
      >
        {rows.length === 0 ? (
          <p className="card p-4 text-[14px] text-white/40">Nothing here right now.</p>
        ) : (
          <div className="space-y-2.5">
            {rows.map((b) => {
              const isOpen = open === b.id
              return (
                <div key={b.id} className="card overflow-hidden">
                  <button
                    onClick={() => setOpen(isOpen ? null : b.id)}
                    className="flex w-full items-start gap-3 p-4 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-bold tracking-wide text-aqua-400">
                          {b.orderNumber}
                        </span>
                        <span className="text-[12px] text-white/35">
                          {shortDate(b.date)} · {time12(b.time)}
                        </span>
                      </div>
                      <div className="mt-1 truncate text-[15.5px] font-semibold text-white">
                        {b.customerName}
                      </div>
                      <div className="mt-0.5 truncate text-[13px] text-white/45">
                        {b.service.name} · {b.car.makeModel} · {b.car.plate}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <StatusBadge status={b.status} />
                      <ChevronRight
                        className={`h-4 w-4 text-white/25 transition-transform ${
                          isOpen ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="animate-sheet space-y-4 border-t border-ink-700/60 p-4">
                      <dl className="space-y-2 text-[13.5px]">
                        {[
                          ['Phone', b.customerPhone],
                          ['Service', `${b.service.name} (${duration(b.service.durationMins)})`],
                          ['Car', `${b.car.makeModel} — ${b.car.type}, ${b.car.color}`],
                          ['Plate', b.car.plate],
                          ['Address', `${b.location.label} — ${b.location.address}`],
                          ...(b.location.notes ? [['Notes', b.location.notes]] : []),
                          ['Total', aed(b.total)],
                          [
                            'Owner notified',
                            b.notifiedAt
                              ? `Yes (${b.notifyChannel ?? 'link'})`
                              : 'Not recorded',
                          ],
                        ].map(([k, v]) => (
                          <div key={k} className="flex gap-3">
                            <dt className="w-[92px] shrink-0 text-white/35">{k}</dt>
                            <dd className="min-w-0 flex-1 text-white/80">{v}</dd>
                          </div>
                        ))}
                      </dl>

                      <div className="flex gap-2">
                        <a
                          href={`tel:${b.customerPhone.replace(/\s/g, '')}`}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-ink-700 bg-ink-800 py-2.5 text-[13.5px] font-semibold text-white active:scale-[0.98]"
                        >
                          <Phone className="h-4 w-4" />
                          Call
                        </a>
                        <a
                          href={`https://wa.me/${b.customerPhone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-ink-700 bg-ink-800 py-2.5 text-[13.5px] font-semibold text-white active:scale-[0.98]"
                        >
                          <WhatsApp className="h-4 w-4" />
                          WhatsApp
                        </a>
                        <a
                          href={mapsLink(b.location.lat, b.location.lng)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-ink-700 bg-ink-800 py-2.5 text-[13.5px] font-semibold text-white active:scale-[0.98]"
                        >
                          <Pin className="h-4 w-4" />
                          Map
                        </a>
                      </div>

                      <div>
                        <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-white/35">
                          Update status
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {BOOKING_STATUSES.map((s: BookingStatus) => (
                            <button
                              key={s}
                              onClick={() => setBookingStatus(b.id, s)}
                              className={`rounded-xl border px-3 py-2 text-[13px] font-medium transition ${
                                b.status === s
                                  ? 'border-aqua-500/60 bg-aqua-500/14 text-aqua-400'
                                  : 'border-ink-700 bg-ink-800 text-white/55 active:scale-[0.97]'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Section>
    </>
  )
}

const BLANK_SERVICE = (): Service => ({
  id: uid('svc'),
  name: '',
  description: '',
  includes: [],
  price: 0,
  durationMins: 60,
})

function AdminServices() {
  const { services, upsertService, removeService } = useApp()
  const [editing, setEditing] = useState<Service | null>(null)

  function save() {
    if (!editing || !editing.name.trim()) return
    upsertService({
      ...editing,
      name: editing.name.trim(),
      description: editing.description.trim(),
      includes: editing.includes.map((l) => l.trim()).filter(Boolean),
    })
    setEditing(null)
  }

  return (
    <Section
      title="Services & Prices"
      action={
        <button
          onClick={() => setEditing(BLANK_SERVICE())}
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-aqua-400 active:opacity-60"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      }
    >
      {editing && (
        <div className="card animate-sheet mb-3 space-y-3.5 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-white">
              {services.some((s) => s.id === editing.id) ? 'Edit service' : 'New service'}
            </h3>
            <button
              onClick={() => setEditing(null)}
              className="text-[13px] font-semibold text-white/45"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="label" htmlFor="svcname">
              Name
            </label>
            <input
              id="svcname"
              className="field"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="label" htmlFor="svcprice">
                Price (AED)
              </label>
              <input
                id="svcprice"
                className="field"
                inputMode="numeric"
                value={editing.price || ''}
                onChange={(e) =>
                  setEditing({ ...editing, price: Number(e.target.value.replace(/\D/g, '')) || 0 })
                }
              />
            </div>
            <div className="flex-1">
              <label className="label" htmlFor="svcmins">
                Duration (min)
              </label>
              <input
                id="svcmins"
                className="field"
                inputMode="numeric"
                value={editing.durationMins || ''}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    durationMins: Number(e.target.value.replace(/\D/g, '')) || 0,
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="svcdesc">
              Short description
            </label>
            <textarea
              id="svcdesc"
              className="field min-h-[70px] resize-none"
              value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
          </div>

          <div>
            <label className="label" htmlFor="svcinc">
              What's included — one per line
            </label>
            <textarea
              id="svcinc"
              className="field min-h-[96px] resize-none"
              value={editing.includes.join('\n')}
              onChange={(e) => setEditing({ ...editing, includes: e.target.value.split('\n') })}
            />
          </div>

          <label className="flex items-center gap-3 py-1">
            <button
              type="button"
              onClick={() => setEditing({ ...editing, popular: !editing.popular })}
              className={`flex h-6 w-6 items-center justify-center rounded-md border transition ${
                editing.popular ? 'border-aqua-400 bg-aqua-400' : 'border-ink-600 bg-ink-800'
              }`}
            >
              {editing.popular && <Check className="h-4 w-4 text-ink-950" strokeWidth={3} />}
            </button>
            <span className="text-[14px] text-white/70">Show "Most booked" badge</span>
          </label>

          <button className="btn-ghost !py-3.5" disabled={!editing.name.trim()} onClick={save}>
            Save service
          </button>
        </div>
      )}

      <div className="space-y-2.5">
        {services.map((s) => (
          <div key={s.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15.5px] font-semibold text-white">{s.name}</div>
                <div className="mt-0.5 text-[13px] text-white/45">
                  {aed(s.price)} · {duration(s.durationMins)}
                </div>
                <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-white/35">
                  {s.description}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <button
                  onClick={() => setEditing(s)}
                  className="text-[13px] font-semibold text-aqua-400 active:opacity-60"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeService(s.id)}
                  aria-label={`Delete ${s.name}`}
                  className="p-1 text-white/20 active:text-rose-400"
                >
                  <Trash className="h-[17px] w-[17px]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
