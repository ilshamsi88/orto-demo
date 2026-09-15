import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar, Screen, Section } from '../components/Layout'
import { Car as CarIcon, Check, Pin, Trash, User } from '../components/Icons'
import { useApp } from '../store/AppContext'
import { notifyMode, ownerNumber } from '../lib/whatsapp'

export default function Profile() {
  const { customer, cars, locations, updateCustomer, removeCar, removeLocation, signOut, resetDemo } =
    useApp()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(customer?.name ?? '')
  const [phone, setPhone] = useState(customer?.phone ?? '')

  function save() {
    updateCustomer({ name: name.trim(), phone: phone.trim() })
    setEditing(false)
  }

  return (
    <>
      <NavBar
        title="Profile"
        large
        right={
          editing ? (
            <button onClick={save} className="text-[15px] font-semibold text-aqua-400">
              Done
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="text-[15px] font-semibold text-aqua-400"
            >
              Edit
            </button>
          )
        }
      />
      <Screen withTabBar>
        <Section>
          <div className="card p-4">
            {editing ? (
              <div className="space-y-3.5">
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
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-ink-700 bg-ink-800 text-aqua-400">
                  <User className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[18px] font-semibold text-white">
                    {customer?.name}
                  </div>
                  <div className="mt-0.5 text-[14px] text-white/45">{customer?.phone}</div>
                </div>
              </div>
            )}
          </div>
        </Section>

        <Section title={`Saved Cars (${cars.length})`}>
          {cars.length === 0 ? (
            <p className="card p-4 text-[14px] text-white/40">
              No cars saved yet. You'll be asked for your car on your first booking.
            </p>
          ) : (
            <div className="card divide-y divide-ink-700/50 overflow-hidden">
              {cars.map((c) => (
                <div key={c.id} className="flex items-center gap-3.5 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-ink-700 bg-ink-800 text-aqua-400">
                    <CarIcon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[15px] font-semibold text-white">
                      {c.makeModel}
                    </div>
                    <div className="mt-0.5 text-[13px] text-white/45">
                      {c.type} · {c.color} · {c.plate}
                    </div>
                  </div>
                  <button
                    onClick={() => removeCar(c.id)}
                    aria-label={`Remove ${c.makeModel}`}
                    className="shrink-0 p-2 text-white/25 active:text-rose-400"
                  >
                    <Trash className="h-[18px] w-[18px]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title={`Saved Addresses (${locations.length})`}>
          {locations.length === 0 ? (
            <p className="card p-4 text-[14px] text-white/40">
              No addresses saved yet. Add one during your first booking.
            </p>
          ) : (
            <div className="card divide-y divide-ink-700/50 overflow-hidden">
              {locations.map((l) => (
                <div key={l.id} className="flex items-start gap-3.5 p-4">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-ink-700 bg-ink-800 text-aqua-400">
                    <Pin className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-semibold text-white">{l.label}</div>
                    <div className="mt-0.5 text-[13px] leading-relaxed text-white/45">
                      {l.address}
                    </div>
                  </div>
                  <button
                    onClick={() => removeLocation(l.id)}
                    aria-label={`Remove ${l.label}`}
                    className="shrink-0 p-2 text-white/25 active:text-rose-400"
                  >
                    <Trash className="h-[18px] w-[18px]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Demo Controls">
          <div className="card divide-y divide-ink-700/50 overflow-hidden">
            <div className="flex items-start gap-3 p-4">
              <Check className="mt-0.5 h-[18px] w-[18px] shrink-0 text-aqua-400" />
              <div className="text-[13px] leading-relaxed text-white/50">
                WhatsApp mode: <span className="font-semibold text-white">{notifyMode()}</span>
                {ownerNumber() ? (
                  <> · notifying {ownerNumber()}</>
                ) : (
                  <> · no owner number set yet</>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                signOut()
                navigate('/login', { replace: true })
              }}
              className="w-full p-4 text-left text-[15px] font-semibold text-white active:opacity-60"
            >
              Log out
            </button>
            <button
              onClick={() => {
                resetDemo()
                navigate('/login', { replace: true })
              }}
              className="w-full p-4 text-left text-[15px] font-semibold text-rose-400 active:opacity-60"
            >
              Reset demo data
            </button>
          </div>
        </Section>

        <div className="h-4" />
      </Screen>
    </>
  )
}
