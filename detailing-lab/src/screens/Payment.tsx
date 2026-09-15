import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { BottomBar, NavBar, Screen } from '../components/Layout'
import { PriceRow } from '../components/DetailRow'
import { Apple, Check, CreditCard, Lock } from '../components/Icons'
import { useApp } from '../store/AppContext'
import { aed } from '../lib/format'
import { notifyMode, notifyOwner } from '../lib/whatsapp'

type Method = 'apple' | 'card'

export default function Payment() {
  const { draft, priceFor, createBooking, markNotified, services, cars, locations } = useApp()
  const navigate = useNavigate()
  const [method, setMethod] = useState<Method>('apple')
  const [busy, setBusy] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const ready =
    services.some((s) => s.id === draft.serviceId) &&
    cars.some((c) => c.id === draft.carId) &&
    locations.some((l) => l.id === draft.locationId) &&
    Boolean(draft.date && draft.time)

  // Guard against a refresh or deep link landing here with nothing to pay for —
  // but never after the booking has been placed, or we'd bounce off our own success.
  if (!ready && !submitted) return <Navigate to="/book/service" replace />

  const { base, surcharge, total } = priceFor(draft.serviceId, draft.carId)

  async function confirmAndPay() {
    if (busy) return
    setBusy(true)
    setSubmitted(true)
    setError('')
    try {
      // The booking becomes real here — this is the single confirmation point,
      // and the owner's WhatsApp fires from the same user gesture.
      const booking = createBooking()
      const result = await notifyOwner(booking)
      markNotified(booking.id, result.channel)
      navigate(`/booking-confirmed/${booking.id}`, {
        replace: true,
        state: { notify: result },
      })
    } catch (err) {
      setBusy(false)
      setSubmitted(false)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <>
      <NavBar title="Checkout" back />
      <Screen className="px-5">
        <div className="mt-1 flex items-start gap-2.5 rounded-xl border border-amber-400/25 bg-amber-400/[0.08] px-3.5 py-3 text-[12.5px] leading-relaxed text-amber-200/90">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <span className="font-semibold">Demo checkout.</span> No card is charged and no payment
            details are stored. Live payments plug in here later.
          </span>
        </div>

        <h2 className="mb-3 mt-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/40">
          Payment method
        </h2>

        <div className="space-y-2.5">
          <button
            onClick={() => setMethod('apple')}
            className={`flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition ${
              method === 'apple'
                ? 'border-aqua-500/60 bg-aqua-500/[0.07] shadow-glow'
                : 'border-ink-700/70 bg-ink-850'
            }`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-ink-950">
              <Apple className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <div className="text-[15.5px] font-semibold text-white">Apple Pay</div>
              <div className="text-[13px] text-white/45">Fastest — pay with Face ID</div>
            </div>
            {method === 'apple' && (
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-aqua-400">
                <Check className="h-3.5 w-3.5 text-ink-950" strokeWidth={3.2} />
              </span>
            )}
          </button>

          <button
            onClick={() => setMethod('card')}
            className={`flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition ${
              method === 'card'
                ? 'border-aqua-500/60 bg-aqua-500/[0.07] shadow-glow'
                : 'border-ink-700/70 bg-ink-850'
            }`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ink-600 bg-ink-800 text-white/80">
              <CreditCard className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <div className="text-[15.5px] font-semibold text-white">Credit / Debit card</div>
              <div className="text-[13px] text-white/45">Visa, Mastercard, Amex</div>
            </div>
            {method === 'card' && (
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-aqua-400">
                <Check className="h-3.5 w-3.5 text-ink-950" strokeWidth={3.2} />
              </span>
            )}
          </button>
        </div>

        {method === 'card' && (
          <div className="card mt-3 space-y-3.5 p-4">
            <div>
              <label className="label" htmlFor="cardnum">
                Card number
              </label>
              <input
                id="cardnum"
                className="field"
                placeholder="4242 4242 4242 4242"
                inputMode="numeric"
                disabled
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="label" htmlFor="exp">
                  Expiry
                </label>
                <input id="exp" className="field" placeholder="MM / YY" disabled />
              </div>
              <div className="w-[110px]">
                <label className="label" htmlFor="cvc">
                  CVC
                </label>
                <input id="cvc" className="field" placeholder="123" disabled />
              </div>
            </div>
            <p className="text-[12px] text-white/30">Disabled in the demo build.</p>
          </div>
        )}

        <div className="card mt-5 space-y-2.5 p-4">
          <PriceRow label="Service" value={aed(base)} />
          {surcharge > 0 && <PriceRow label="Size supplement" value={`+ ${aed(surcharge)}`} />}
          <PriceRow label="VAT" value="Included" muted />
          <PriceRow label="Total due" value={aed(total)} strong />
        </div>

        {error && <p className="mt-4 text-[13.5px] text-rose-400">{error}</p>}

        {notifyMode() === 'link' && (
          <p className="mt-4 px-1 text-[12px] leading-relaxed text-white/30">
            On confirm, WhatsApp opens with the booking details ready to send to the shop.
          </p>
        )}

        <div className="h-28" />
      </Screen>

      <BottomBar>
        <button className="btn-primary" onClick={confirmAndPay} disabled={busy}>
          {busy ? (
            'Confirming…'
          ) : method === 'apple' ? (
            <>
              <Apple className="h-[18px] w-[18px]" />
              Pay {aed(total)}
            </>
          ) : (
            <>Confirm &amp; pay {aed(total)}</>
          )}
        </button>
      </BottomBar>
    </>
  )
}
