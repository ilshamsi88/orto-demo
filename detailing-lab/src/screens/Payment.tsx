import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import { BottomBar, NavBar, Photo, Screen } from '../components/Layout'
import { Apple, ArrowRight, Check, CreditCard, Wallet } from '../components/Icons'
import { useApp } from '../store/AppContext'
import { PAYMENT_LABELS, type PaymentMethod } from '../types'
import { imageFor } from '../data/images'
import { aed, shortDate, time12 } from '../lib/format'
import { notifyMode, notifyOwner } from '../lib/whatsapp'

const METHODS: { key: PaymentMethod; Icon: typeof Apple; hint: string }[] = [
  { key: 'card', Icon: CreditCard, hint: 'Visa, Mastercard, Amex' },
  { key: 'apple', Icon: Apple, hint: 'Pay with Face ID' },
  { key: 'cash', Icon: Wallet, hint: 'Pay the detailer on the day' },
]

export default function Payment() {
  const {
    draft,
    priceFor,
    createBooking,
    markNotified,
    services,
    cars,
    locations,
  } = useApp()
  const navigate = useNavigate()
  const [method, setMethod] = useState<PaymentMethod>(draft.paymentMethod ?? 'card')
  const [saveMethod, setSaveMethod] = useState(true)
  const [busy, setBusy] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const service = services.find((s) => s.id === draft.serviceId)
  const car = cars.find((c) => c.id === draft.carId)
  const location = locations.find((l) => l.id === draft.locationId)
  const ready = Boolean(service && car && location && draft.date && draft.time)

  // Guard against a refresh or deep link landing here with nothing to pay for —
  // but never after the booking has been placed, or we'd bounce off our own success.
  if (!ready && !submitted) return <Navigate to="/services" replace />

  const { base, surcharge, addOns, addOnTotal, total } = priceFor(draft)

  async function confirm() {
    if (busy) return
    setBusy(true)
    setSubmitted(true)
    setError('')
    try {
      // The booking becomes real here, and the owner's WhatsApp fires from the
      // same user gesture so mobile Safari allows the handoff.
      const booking = createBooking(method)
      const result = await notifyOwner(booking)
      markNotified(booking.id, result.channel)
      navigate(`/booking-confirmed/${booking.id}`, { replace: true, state: { notify: result } })
    } catch (err) {
      setBusy(false)
      setSubmitted(false)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <>
      <StatusBar />
      <NavBar title="Payment" subtitle="Choose your payment method" back step={[4, 5]} />
      <Screen withBottomBar className="px-5">
        <h2 className="mb-2.5 text-[15px] font-semibold text-white">Booking Summary</h2>
        <div className="card p-3.5">
          <div className="flex items-center gap-3.5">
            <Photo src={imageFor(service?.image)} className="h-[58px] w-[72px] shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-semibold text-white">{service?.name}</div>
              <div className="mt-0.5 text-[12.5px] text-white/45">
                {car?.type} · {car?.plate}
              </div>
              <div className="text-[12.5px] text-white/45">
                {draft.date ? shortDate(draft.date) : ''} · {draft.time ? time12(draft.time) : ''}
              </div>
              <div className="truncate text-[12.5px] text-white/45">{location?.address}</div>
            </div>
          </div>

          {(addOns.length > 0 || surcharge > 0) && (
            <ul className="mt-3 space-y-1.5 border-t border-ink-700/60 pt-3 text-[12.5px]">
              <li className="flex justify-between text-white/50">
                <span>{service?.name}</span>
                <span>{aed(base)}</span>
              </li>
              {surcharge > 0 && (
                <li className="flex justify-between text-white/50">
                  <span>{car?.type} size supplement</span>
                  <span>+ {aed(surcharge)}</span>
                </li>
              )}
              {addOns.map((a) => (
                <li key={a.id} className="flex justify-between text-white/50">
                  <span>{a.name}</span>
                  <span>+ {aed(a.price)}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 flex items-baseline justify-between border-t border-ink-700/60 pt-3">
            <span className="text-[13px] text-white/45">
              {addOnTotal > 0 ? `${addOns.length} add-on${addOns.length > 1 ? 's' : ''}` : 'Subtotal'}
            </span>
            <span className="text-[18px] font-bold text-white">{aed(total)}</span>
          </div>
        </div>

        <h2 className="mb-2.5 mt-6 text-[15px] font-semibold text-white">Payment Method</h2>
        <div className="card divide-y divide-ink-700/50 overflow-hidden">
          {METHODS.map(({ key, Icon, hint }) => {
            const on = method === key
            return (
              <button
                key={key}
                onClick={() => setMethod(key)}
                className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left"
              >
                <span
                  className={`flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-full border-2 transition ${
                    on ? 'border-blush-400' : 'border-ink-600'
                  }`}
                >
                  {on && <span className="h-[11px] w-[11px] rounded-full bg-blush-400" />}
                </span>
                <Icon className="h-[19px] w-[19px] shrink-0 text-white/70" />
                <div className="min-w-0 flex-1">
                  <div className="text-[14.5px] text-white">{PAYMENT_LABELS[key]}</div>
                  <div className="text-[11.5px] text-white/35">{hint}</div>
                </div>
              </button>
            )
          })}
        </div>

        <button
          onClick={() => setSaveMethod(!saveMethod)}
          className="mt-3.5 flex w-full items-center gap-3 text-left"
        >
          <span
            className={`flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-[5px] border transition ${
              saveMethod ? 'border-blush-400 bg-blush-400' : 'border-ink-600 bg-ink-800'
            }`}
          >
            {saveMethod && <Check className="h-3 w-3 text-ink-950" strokeWidth={3.4} />}
          </span>
          <span className="text-[13px] text-white/55">Save payment method for future bookings</span>
        </button>

        <div className="mt-5 flex items-baseline justify-between border-t border-ink-700/60 pt-4">
          <span className="text-[15px] font-semibold text-white">Total</span>
          <span className="text-[20px] font-bold text-white">{aed(total)}</span>
        </div>

        <p className="mt-3 text-[11.5px] leading-relaxed text-white/30">
          Demo checkout — no card is charged and no payment details are stored.
          {notifyMode() === 'link' &&
            ' On confirm, WhatsApp opens with the booking ready to send to the shop.'}
        </p>

        {error && <p className="mt-3 text-[13px] text-rose-400">{error}</p>}

        <div className="h-4" />
      </Screen>

      <BottomBar>
        <button className="btn-primary" onClick={confirm} disabled={busy}>
          {busy ? (
            'Confirming…'
          ) : (
            <>
              Confirm Booking
              <ArrowRight className="h-[18px] w-[18px]" />
            </>
          )}
        </button>
      </BottomBar>
    </>
  )
}
