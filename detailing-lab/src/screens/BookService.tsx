import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import { BottomBar, NavBar, Photo, Screen } from '../components/Layout'
import {
  ArrowRight,
  Check,
  FourByFour,
  Leaf,
  OtherVehicle,
  Sedan,
  Suv,
} from '../components/Icons'
import { useApp } from '../store/AppContext'
import { CAR_TYPES, SIZE_SURCHARGE, type CarType } from '../types'
import { imageFor } from '../data/images'
import { aed, duration } from '../lib/format'

const TYPE_ICON: Record<CarType, typeof Sedan> = {
  Sedan,
  SUV: Suv,
  '4x4': FourByFour,
  Other: OtherVehicle,
}

const COLORS = [
  { name: 'White', hex: '#F4F4F5' },
  { name: 'Black', hex: '#111114' },
  { name: 'Silver', hex: '#C4C7CE' },
  { name: 'Grey', hex: '#6B7280' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Green', hex: '#15803D' },
  { name: 'Beige', hex: '#D6C3A1' },
]

export default function BookService() {
  const { services, addOns, cars, draft, setDraft, toggleAddOn, addCar, priceFor } = useApp()
  const navigate = useNavigate()

  const service = services.find((s) => s.id === draft.serviceId)
  const saved = cars.find((c) => c.id === draft.carId)

  const [type, setType] = useState<CarType>(saved?.type ?? 'Sedan')
  const [makeModel, setMakeModel] = useState(saved?.makeModel ?? '')
  const [plate, setPlate] = useState(saved?.plate ?? '')
  const [color, setColor] = useState(saved?.color ?? 'White')

  // Landed here without picking a service (refresh or deep link).
  if (!service) return <Navigate to="/services" replace />

  const selectedAddOns = draft.addOnIds ?? []
  const { total } = priceFor({ ...draft, carId: undefined })
  const runningTotal = total + SIZE_SURCHARGE[type]
  const ready = makeModel.trim().length >= 2 && plate.trim().length >= 2

  function applySavedVehicle(id: string) {
    const car = cars.find((c) => c.id === id)
    if (!car) return
    setType(car.type)
    setMakeModel(car.makeModel)
    setPlate(car.plate)
    setColor(car.color)
    setDraft({ carId: car.id })
  }

  function next() {
    if (!ready) return
    const details = { makeModel: makeModel.trim(), type, plate: plate.trim().toUpperCase(), color }
    // Reuse an identical saved vehicle rather than piling up duplicates.
    const existing = cars.find(
      (c) =>
        c.plate.toUpperCase() === details.plate &&
        c.makeModel.toLowerCase() === details.makeModel.toLowerCase(),
    )
    const car = existing ?? addCar(details)
    setDraft({ carId: car.id })
    navigate('/book/location')
  }

  return (
    <>
      <StatusBar />
      <NavBar
        title="Book a Service"
        subtitle="Select your vehicle and add-ons"
        back={() => navigate('/services')}
        step={[1, 5]}
      />
      <Screen withBottomBar className="px-5">
        <div className="card flex items-center gap-3.5 p-3">
          <Photo src={imageFor(service.image)} className="h-[56px] w-[70px] shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[15px] font-semibold text-white">{service.name}</div>
            <div className="mt-0.5 text-[12.5px] text-white/40">
              {duration(service.durationMins)} · {aed(service.price)}
            </div>
          </div>
          <button
            onClick={() => navigate('/services')}
            className="shrink-0 text-[13px] font-semibold text-blush-400 active:opacity-60"
          >
            Change
          </button>
        </div>

        <h2 className="mb-2.5 mt-6 text-[15px] font-semibold text-white">Vehicle Type</h2>
        <div className="grid grid-cols-4 gap-2">
          {CAR_TYPES.map((t) => {
            const Icon = TYPE_ICON[t]
            const on = type === t
            return (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border py-3.5 transition ${
                  on
                    ? 'border-blush-400 bg-blush-400/10 text-blush-400'
                    : 'border-ink-700 bg-ink-850 text-white/50'
                }`}
              >
                <Icon className="h-6 w-10" />
                <span className="text-[11.5px] font-medium">{t}</span>
                {SIZE_SURCHARGE[t] > 0 && (
                  <span className="text-[9.5px] opacity-60">+{SIZE_SURCHARGE[t]}</span>
                )}
              </button>
            )
          })}
        </div>

        <h2 className="mb-2.5 mt-6 text-[15px] font-semibold text-white">Vehicle Details</h2>

        {cars.length > 0 && (
          <div className="no-scrollbar -mx-1 mb-3 flex gap-2 overflow-x-auto px-1">
            {cars.map((c) => (
              <button
                key={c.id}
                onClick={() => applySavedVehicle(c.id)}
                className={`chip ${
                  draft.carId === c.id && c.plate === plate ? 'chip-on' : 'chip-off'
                }`}
              >
                {c.makeModel} · {c.plate}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-3.5">
          <div>
            <label className="label" htmlFor="makeModel">
              Make &amp; model
            </label>
            <input
              id="makeModel"
              className="field"
              placeholder="e.g. Toyota Land Cruiser"
              value={makeModel}
              onChange={(e) => setMakeModel(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="plate">
              Plate number
            </label>
            <input
              id="plate"
              className="field uppercase"
              placeholder="e.g. A 44219"
              autoCapitalize="characters"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
            />
          </div>
          <div>
            <span className="label">Colour</span>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[13px] transition ${
                    color === c.name
                      ? 'border-blush-400 bg-blush-400/10 text-white'
                      : 'border-ink-700 bg-ink-850 text-white/55'
                  }`}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-white/20"
                    style={{ background: c.hex }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <h2 className="mb-2.5 mt-6 text-[15px] font-semibold text-white">
          Add-ons <span className="font-normal text-white/35">(Optional)</span>
        </h2>
        <div className="card divide-y divide-ink-700/50 overflow-hidden">
          {addOns.map((a) => {
            const on = selectedAddOns.includes(a.id)
            return (
              <button
                key={a.id}
                onClick={() => toggleAddOn(a.id)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
              >
                <span
                  className={`flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-[6px] border transition ${
                    on ? 'border-blush-400 bg-blush-400' : 'border-ink-600 bg-ink-800'
                  }`}
                >
                  {on && <Check className="h-3.5 w-3.5 text-ink-950" strokeWidth={3.2} />}
                </span>
                <span className="flex-1 text-[14.5px] text-white">{a.name}</span>
                <span className="text-[13.5px] font-medium text-white/45">{aed(a.price)}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-xl border border-ink-700/70 bg-ink-850 px-3.5 py-3">
          <Leaf className="mt-0.5 h-[18px] w-[18px] shrink-0 text-blush-400" />
          <p className="text-[12px] leading-relaxed text-white/45">
            <span className="font-semibold text-white/70">Using premium products.</span> Safe for
            your vehicle and the environment.
          </p>
        </div>

        <div className="h-4" />
      </Screen>

      <BottomBar>
        <button className="btn-primary" disabled={!ready} onClick={next}>
          Next: Location · {aed(runningTotal)}
          <ArrowRight className="h-[18px] w-[18px]" />
        </button>
      </BottomBar>
    </>
  )
}
