import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { NavBar, Screen, Section } from '../components/Layout'
import { DetailRow, PriceRow } from '../components/DetailRow'
import { StatusBadge, StatusTracker } from '../components/Status'
import { Calendar, Car, Droplet, Phone, Pin, User } from '../components/Icons'
import { useApp } from '../store/AppContext'
import { aed, duration, longDate, mapsLink, time12 } from '../lib/format'

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>()
  const { bookings } = useApp()
  const navigate = useNavigate()

  const booking = bookings.find((b) => b.id === id)
  if (!booking) return <Navigate to="/bookings" replace />

  return (
    <>
      <NavBar title={booking.orderNumber} back={() => navigate('/bookings')} />
      <Screen withTabBar className="px-5">
        <div className="card mt-1 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[19px] font-bold leading-tight text-white">
                {booking.service.name}
              </div>
              <div className="mt-1 text-[13.5px] text-white/45">
                {duration(booking.service.durationMins)} · {aed(booking.total)}
              </div>
            </div>
            <StatusBadge status={booking.status} />
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
            />
            <DetailRow
              icon={<Car className="h-[18px] w-[18px]" />}
              label="Car"
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
                    className="mt-1 inline-block font-semibold text-aqua-400"
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
            <PriceRow label="Total" value={aed(booking.total)} strong />
          </div>
        </Section>

        <Section>
          <a
            href="tel:+97140000000"
            className="btn-ghost"
          >
            <Phone className="h-[18px] w-[18px]" />
            Call Detailing Lab
          </a>
        </Section>

        <div className="h-6" />
      </Screen>
    </>
  )
}
