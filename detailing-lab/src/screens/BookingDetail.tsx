import { Navigate, useNavigate, useParams } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import { NavBar, Photo, Screen, Section } from '../components/Layout'
import { DetailRow, PriceRow } from '../components/DetailRow'
import { StatusBadge, StatusTracker } from '../components/Status'
import { CalendarPlus, Calendar, Car, Droplet, Phone, Pin, User } from '../components/Icons'
import { useApp } from '../store/AppContext'
import { PAYMENT_LABELS } from '../types'
import { imageFor } from '../data/images'
import { aed, duration, longDate, mapsLink, time12 } from '../lib/format'
import { downloadIcs } from '../lib/ics'

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>()
  const { bookings } = useApp()
  const navigate = useNavigate()

  const booking = bookings.find((b) => b.id === id)
  if (!booking) return <Navigate to="/bookings" replace />

  return (
    <>
      <StatusBar />
      <NavBar title={booking.orderNumber} back={() => navigate('/bookings')} />
      <Screen withTabBar className="px-5">
        <div className="card flex items-center gap-3.5 p-3">
          <Photo src={imageFor(booking.service.image)} className="h-[64px] w-[78px] shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[17px] font-semibold leading-tight text-white">
              {booking.service.name}
            </div>
            <div className="mt-1 text-[12.5px] text-white/45">
              {duration(booking.service.durationMins)} · {aed(booking.total)}
            </div>
            <div className="mt-1.5">
              <StatusBadge status={booking.status} />
            </div>
          </div>
        </div>

        <Section title="Progress">
          <div className="card p-4">
            <StatusTracker status={booking.status} />
          </div>
        </Section>

        <Section title="Details">
          <div className="card divide-y divide-ink-700/50 overflow-hidden">
            <DetailRow
              icon={<Calendar className="h-[18px] w-[18px]" />}
              label="Date & time"
              value={time12(booking.time)}
              sub={longDate(booking.date)}
            />
            <DetailRow
              icon={<Droplet className="h-[18px] w-[18px]" />}
              label="Service"
              value={booking.service.name}
              sub={
                booking.addOns.length
                  ? `Add-ons: ${booking.addOns.map((a) => a.name).join(', ')}`
                  : undefined
              }
            />
            <DetailRow
              icon={<Car className="h-[18px] w-[18px]" />}
              label="Vehicle"
              value={booking.car.makeModel}
              sub={`${booking.car.type} · ${booking.car.color} · Plate ${booking.car.plate}`}
            />
            <DetailRow
              icon={<Pin className="h-[18px] w-[18px]" />}
              label="Location"
              value={booking.location.label}
              sub={
                <>
                  {booking.location.address}
                  {booking.location.notes ? (
                    <div className="italic opacity-70">{booking.location.notes}</div>
                  ) : null}
                  <a
                    href={mapsLink(booking.location.lat, booking.location.lng)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block font-semibold text-blush-400"
                  >
                    Open in Maps
                  </a>
                </>
              }
            />
            <DetailRow
              icon={<User className="h-[18px] w-[18px]" />}
              label="Booked by"
              value={booking.customerName}
              sub={booking.customerPhone}
            />
          </div>
        </Section>

        <Section title="Payment">
          <div className="card space-y-2.5 p-4">
            <PriceRow label={booking.service.name} value={aed(booking.service.price)} />
            {booking.sizeSurcharge > 0 && (
              <PriceRow
                label={`${booking.car.type} size supplement`}
                value={`+ ${aed(booking.sizeSurcharge)}`}
              />
            )}
            {booking.addOns.map((a) => (
              <PriceRow key={a.id} label={a.name} value={`+ ${aed(a.price)}`} />
            ))}
            <PriceRow label={PAYMENT_LABELS[booking.paymentMethod]} value="" muted />
            <PriceRow label="Total" value={aed(booking.total)} strong />
          </div>
        </Section>

        <Section>
          <div className="space-y-2.5">
            <button className="btn-outline" onClick={() => downloadIcs(booking)}>
              <CalendarPlus className="h-[18px] w-[18px]" />
              Add to Calendar
            </button>
            <a href="tel:+97140000000" className="btn-ghost">
              <Phone className="h-[18px] w-[18px]" />
              Call Detailing Lab
            </a>
          </div>
        </Section>

        <div className="h-6" />
      </Screen>
    </>
  )
}
