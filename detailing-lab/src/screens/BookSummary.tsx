import { Navigate, useNavigate } from 'react-router-dom'
import { BottomBar, NavBar, Screen } from '../components/Layout'
import BookingSteps from '../components/BookingSteps'
import { DetailRow, PriceRow } from '../components/DetailRow'
import { Calendar, Car, Droplet, Pin, User } from '../components/Icons'
import { useApp } from '../store/AppContext'
import { aed, duration, longDate, time12 } from '../lib/format'

export default function BookSummary() {
  const { customer, services, cars, locations, draft, priceFor } = useApp()
  const navigate = useNavigate()

  const service = services.find((s) => s.id === draft.serviceId)
  const car = cars.find((c) => c.id === draft.carId)
  const location = locations.find((l) => l.id === draft.locationId)

  // Someone deep-linked or refreshed mid-flow — send them back to the start.
  if (!service || !car || !location || !draft.date || !draft.time) {
    return <Navigate to="/book/service" replace />
  }

  const { base, surcharge, total } = priceFor(draft.serviceId, draft.carId)

  return (
    <>
      <NavBar title="Booking Summary" back />
      <BookingSteps current={4} />
      <Screen className="px-5">
        <div className="card divide-y divide-ink-700/50 overflow-hidden">
          <DetailRow
            icon={<Droplet className="h-[18px] w-[18px]" />}
            label="Service"
            value={service.name}
            sub={duration(service.durationMins)}
            editTo="/book/service"
          />
          <DetailRow
            icon={<Car className="h-[18px] w-[18px]" />}
            label="Car"
            value={car.makeModel}
            sub={`${car.type} · ${car.color} · Plate ${car.plate}`}
            editTo="/book/car"
          />
          <DetailRow
            icon={<Pin className="h-[18px] w-[18px]" />}
            label="Location"
            value={location.label}
            sub={
              <>
                {location.address}
                {location.notes ? <div className="italic opacity-70">{location.notes}</div> : null}
              </>
            }
            editTo="/book/location"
          />
          <DetailRow
            icon={<Calendar className="h-[18px] w-[18px]" />}
            label="Date & time"
            value={time12(draft.time)}
            sub={longDate(draft.date)}
            editTo="/book/time"
          />
          <DetailRow
            icon={<User className="h-[18px] w-[18px]" />}
            label="Contact"
            value={customer?.name ?? ''}
            sub={customer?.phone}
          />
        </div>

        <div className="card mt-3 space-y-2.5 p-4">
          <PriceRow label={service.name} value={aed(base)} />
          {surcharge > 0 && (
            <PriceRow label={`${car.type} size supplement`} value={`+ ${aed(surcharge)}`} />
          )}
          <PriceRow label="Call-out fee" value="Free" muted />
          <PriceRow label="Total" value={aed(total)} strong />
        </div>

        <p className="px-1 pt-4 text-[12.5px] leading-relaxed text-white/35">
          Free cancellation up to 2 hours before your slot. Our detailer will call you on arrival.
        </p>

        <div className="h-28" />
      </Screen>

      <BottomBar>
        <button className="btn-primary" onClick={() => navigate('/book/payment')}>
          Confirm booking · {aed(total)}
        </button>
      </BottomBar>
    </>
  )
}
