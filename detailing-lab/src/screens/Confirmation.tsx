import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import { BottomBar, Photo, Screen } from '../components/Layout'
import { CalendarPlus, Check, WhatsApp } from '../components/Icons'
import { useApp } from '../store/AppContext'
import { imageFor } from '../data/images'
import { aed, longDate, shortDate, time12 } from '../lib/format'
import { downloadIcs } from '../lib/ics'
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
      <StatusBar />
      <Screen withBottomBar className="px-5">
        <div className="flex flex-col items-center pb-2 pt-10 text-center">
          <div className="animate-pop flex h-[68px] w-[68px] items-center justify-center rounded-full bg-blush-400">
            <Check className="h-9 w-9 text-ink-950" strokeWidth={3} />
          </div>
          <h1 className="mt-6 text-[25px] font-bold tracking-tight text-blush-400">
            Booking Confirmed!
          </h1>
          <p className="mt-2.5 max-w-[270px] text-[13.5px] leading-relaxed text-white/50">
            Your car wash has been booked. We'll see you on{' '}
            <span className="text-white">
              {shortDate(booking.date)} at {time12(booking.time)}
            </span>
            .
          </p>
        </div>

        <div className="card mt-5 p-3.5">
          <div className="flex items-center gap-3.5">
            <Photo src={imageFor(booking.service.image)} className="h-[58px] w-[72px] shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-semibold text-white">
                {booking.service.name}
              </div>
              <div className="mt-0.5 text-[12.5px] text-white/45">
                {booking.car.type} · {booking.car.plate}
              </div>
              <div className="truncate text-[12.5px] text-white/45">
                {booking.location.label} — {booking.location.address}
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-1.5 border-t border-ink-700/60 pt-3 text-[12.5px]">
            <div className="flex justify-between">
              <span className="text-white/40">Date &amp; time</span>
              <span className="text-white/80">
                {longDate(booking.date)}, {time12(booking.time)}
              </span>
            </div>
            {booking.addOns.length > 0 && (
              <div className="flex justify-between gap-4">
                <span className="shrink-0 text-white/40">Add-ons</span>
                <span className="text-right text-white/80">
                  {booking.addOns.map((a) => a.name).join(', ')}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-white/40">Order number</span>
              <span className="font-semibold text-blush-400">{booking.orderNumber}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-[14px] font-semibold text-white">Total</span>
              <span className="text-[16px] font-bold text-white">{aed(booking.total)}</span>
            </div>
          </div>
        </div>

        {/* WhatsApp receipt — the owner-facing half of the flow */}
        <div
          className={`mt-3 rounded-2xl border p-3.5 ${
            notify?.ok === false
              ? 'border-rose-400/30 bg-rose-400/[0.07]'
              : 'border-emerald-400/25 bg-emerald-400/[0.06]'
          }`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                notify?.ok === false
                  ? 'bg-rose-400/15 text-rose-300'
                  : 'bg-emerald-400/15 text-emerald-300'
              }`}
            >
              <WhatsApp className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-semibold text-white">
                {notify?.ok === false
                  ? 'WhatsApp notification failed'
                  : notify?.channel === 'simulated'
                    ? 'WhatsApp notification ready'
                    : 'Shop notified on WhatsApp'}
              </div>
              <p className="mt-0.5 text-[12px] leading-relaxed text-white/50">
                {notify?.ok === false
                  ? notify.detail || 'Could not reach the notification service.'
                  : notify?.channel === 'link'
                    ? 'WhatsApp opened with the full booking details ready to send.'
                    : notify?.channel === 'api'
                      ? 'Sent automatically to the shop owner with all booking details.'
                      : 'No owner number is configured yet — the exact message is below.'}
              </p>
              <div className="mt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => setShowMessage(!showMessage)}
                  className="text-[12.5px] font-semibold text-blush-400 active:opacity-60"
                >
                  {showMessage ? 'Hide message' : 'View message'}
                </button>
                <button
                  onClick={resend}
                  disabled={resending}
                  className="text-[12.5px] font-semibold text-blush-400 active:opacity-60 disabled:opacity-40"
                >
                  {resending ? 'Sending…' : 'Send again'}
                </button>
              </div>
            </div>
          </div>

          {showMessage && (
            <pre className="animate-sheet mt-3 max-h-[240px] overflow-auto whitespace-pre-wrap rounded-xl border border-ink-700 bg-ink-950/70 p-3.5 font-sans text-[12px] leading-relaxed text-white/70">
              {messagePreview}
            </pre>
          )}
        </div>

        <div className="h-4" />
      </Screen>

      <BottomBar>
        <div className="space-y-2.5">
          <button className="btn-outline" onClick={() => downloadIcs(booking)}>
            <CalendarPlus className="h-[18px] w-[18px]" />
            Add to Calendar
          </button>
          <button className="btn-primary" onClick={() => navigate('/bookings')}>
            View Bookings
          </button>
        </div>
      </BottomBar>
    </>
  )
}
