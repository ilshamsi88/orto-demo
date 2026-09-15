import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { BottomBar, Screen } from '../components/Layout'
import { DetailRow, PriceRow } from '../components/DetailRow'
import { Calendar, Car, Check, Droplet, Pin, WhatsApp } from '../components/Icons'
import { useApp } from '../store/AppContext'
import { aed, longDate, time12 } from '../lib/format'
import { buildMessage, notifyOwner, type NotifyResult } from '../lib/whatsapp'

export default function Confirmation() {
  const { id } = useParams<{ id: string }>()
  const { bookings, markNotified, resetDraft } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [notify, setNotify] = useState<NotifyResult | null>(
    (location.state as { notify?: NotifyResult } | null)?.notify ?? null,
  )
  const [showMessage, setShowMessage] = useState(false)
  const [resending, setResending] = useState(false)

  // The booking is placed, so the in-progress draft can go. Doing it here rather
  // than on the payment screen keeps that screen's completeness guard intact.
  useEffect(() => {
    resetDraft()
  }, [resetDraft])

  const booking = bookings.find((b) => b.id === id)
  if (!booking) return <Navigate to="/home" replace />

  async function resend() {
    if (!booking) return
    setResending(true)
    const result = await notifyOwner(booking)
    markNotified(booking.id, result.channel)
    setNotify(result)
    setResending(false)
  }

  const messagePreview = notify?.message ?? buildMessage(booking)

  return (
    <>
      <Screen className="px-5" >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[340px] bg-[radial-gradient(110%_60%_at_50%_0%,rgba(16,185,129,0.16),transparent_70%)]" />

        <div
          className="relative flex flex-col items-center pb-2 text-center"
          style={{ paddingTop: 'calc(var(--safe-top) + 40px)' }}
        >
          <div className="animate-pop flex h-[76px] w-[76px] items-center justify-center rounded-full bg-emerald-400 shadow-[0_0_50px_-8px_rgba(52,211,153,0.6)]">
            <Check className="h-10 w-10 text-ink-950" strokeWidth={3} />
          </div>
          <h1 className="mt-6 text-[27px] font-bold tracking-tight text-white">Booking confirmed</h1>
          <p className="mt-2 max-w-[280px] text-[14.5px] leading-relaxed text-white/50">
            You're all set. We'll message you before the detailer sets off.
          </p>
          <div className="mt-4 rounded-full border border-ink-700 bg-ink-850 px-4 py-2 text-[13.5px] font-semibold tracking-wide text-white">
            Order <span className="text-aqua-400">{booking.orderNumber}</span>
          </div>
        </div>

        {/* WhatsApp notification receipt — the owner-facing half of the flow */}
        <div
          className={`relative mt-7 rounded-2xl border p-4 ${
            notify?.ok === false
              ? 'border-rose-400/30 bg-rose-400/[0.07]'
              : 'border-emerald-400/25 bg-emerald-400/[0.06]'
          }`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                notify?.ok === false ? 'bg-rose-400/15 text-rose-300' : 'bg-emerald-400/15 text-emerald-300'
              }`}
            >
              <WhatsApp className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[14.5px] font-semibold text-white">
                {notify?.ok === false
                  ? 'WhatsApp notification failed'
                  : notify?.channel === 'simulated'
                    ? 'WhatsApp notification ready'
                    : 'Shop notified on WhatsApp'}
              </div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-white/50">
                {notify?.ok === false
                  ? notify.detail || 'Could not reach the notification service.'
                  : notify?.channel === 'link'
                    ? 'WhatsApp opened with the full booking details ready to send.'
                    : notify?.channel === 'api'
                      ? 'Sent automatically to the shop owner with all booking details.'
                      : 'No owner number is configured yet — the exact message is below.'}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-4">
                <button
                  onClick={() => setShowMessage(!showMessage)}
                  className="text-[13px] font-semibold text-aqua-400 active:opacity-60"
                >
                  {showMessage ? 'Hide message' : 'View message'}
                </button>
                <button
                  onClick={resend}
                  disabled={resending}
                  className="text-[13px] font-semibold text-aqua-400 active:opacity-60 disabled:opacity-40"
                >
                  {resending ? 'Sending…' : 'Send again'}
                </button>
              </div>
            </div>
          </div>

          {showMessage && (
            <pre className="animate-sheet mt-3.5 max-h-[260px] overflow-auto whitespace-pre-wrap rounded-xl border border-ink-700 bg-ink-950/70 p-3.5 font-sans text-[12.5px] leading-relaxed text-white/70">
              {messagePreview}
            </pre>
          )}
        </div>

        <div className="card mt-3 divide-y divide-ink-700/50 overflow-hidden">
          <DetailRow
            icon={<Droplet className="h-[18px] w-[18px]" />}
            label="Service"
            value={booking.service.name}
          />
          <DetailRow
            icon={<Calendar className="h-[18px] w-[18px]" />}
            label="Date & time"
            value={time12(booking.time)}
            sub={longDate(booking.date)}
          />
          <DetailRow
            icon={<Pin className="h-[18px] w-[18px]" />}
            label="Location"
            value={booking.location.label}
            sub={booking.location.address}
          />
          <DetailRow
            icon={<Car className="h-[18px] w-[18px]" />}
            label="Car"
            value={booking.car.makeModel}
            sub={`${booking.car.type} · ${booking.car.color} · Plate ${booking.car.plate}`}
          />
        </div>

        <div className="card mt-3 p-4">
          <PriceRow label="Total paid" value={aed(booking.total)} strong />
        </div>

        <div className="h-32" />
      </Screen>

      <BottomBar>
        <div className="space-y-2.5">
          <button className="btn-primary" onClick={() => navigate(`/bookings/${booking.id}`)}>
            Track this booking
          </button>
          <button
            className="w-full py-2 text-[14.5px] font-semibold text-white/50"
            onClick={() => navigate('/home')}
          >
            Back to home
          </button>
        </div>
      </BottomBar>
    </>
  )
}
