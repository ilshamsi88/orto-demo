import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomBar, NavBar, Screen } from '../components/Layout'
import BookingSteps from '../components/BookingSteps'
import { Car as CarIcon, Check, Plus } from '../components/Icons'
import { useApp } from '../store/AppContext'
import { CAR_TYPES, SIZE_SURCHARGE, type CarType } from '../types'
import { aed } from '../lib/format'

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

export default function BookCar() {
  const { cars, addCar, draft, setDraft } = useApp()
  const navigate = useNavigate()
  const [adding, setAdding] = useState(cars.length === 0)
  const [makeModel, setMakeModel] = useState('')
  const [type, setType] = useState<CarType>('Sedan')
  const [plate, setPlate] = useState('')
  const [color, setColor] = useState('White')

  const canSave = makeModel.trim().length >= 2 && plate.trim().length >= 2

  function save() {
    if (!canSave) return
    const created = addCar({
      makeModel: makeModel.trim(),
      type,
      plate: plate.trim().toUpperCase(),
      color,
    })
    setDraft({ carId: created.id })
    setMakeModel('')
    setPlate('')
    setType('Sedan')
    setColor('White')
    setAdding(false)
  }

  return (
    <>
      <NavBar title="Your Car" back />
      <BookingSteps current={1} />
      <Screen className="px-5">
        {cars.length > 0 && (
          <div className="space-y-2.5 pt-1">
            {cars.map((c) => {
              const isSelected = draft.carId === c.id
              const swatch = COLORS.find((x) => x.name === c.color)?.hex ?? '#888'
              return (
                <button
                  key={c.id}
                  onClick={() => setDraft({ carId: c.id })}
                  className={`flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? 'border-aqua-500/60 bg-aqua-500/[0.07] shadow-glow'
                      : 'border-ink-700/70 bg-ink-850'
                  }`}
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ink-600"
                    style={{ background: `${swatch}1f` }}
                  >
                    <CarIcon className="h-5 w-5" style={{ color: swatch }} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[15.5px] font-semibold text-white">
                      {c.makeModel}
                    </div>
                    <div className="mt-0.5 text-[13px] text-white/45">
                      {c.type} · {c.color} · {c.plate}
                    </div>
                  </div>
                  {isSelected && (
                    <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-aqua-400">
                      <Check className="h-3.5 w-3.5 text-ink-950" strokeWidth={3.2} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {!adding ? (
          <button
            onClick={() => setAdding(true)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-ink-600 py-4 text-[15px] font-semibold text-aqua-400 transition active:scale-[0.99]"
          >
            <Plus className="h-4.5 w-4.5" />
            Add another car
          </button>
        ) : (
          <div className="card mt-3 space-y-4 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-white">Add your car</h3>
              {cars.length > 0 && (
                <button
                  onClick={() => setAdding(false)}
                  className="text-[13px] font-semibold text-white/45"
                >
                  Cancel
                </button>
              )}
            </div>

            <div>
              <label className="label" htmlFor="makeModel">
                Make & model
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
              <span className="label">Car type</span>
              <div className="flex flex-wrap gap-2">
                {CAR_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`rounded-xl border px-3.5 py-2.5 text-[14px] font-medium transition ${
                      type === t
                        ? 'border-aqua-500/60 bg-aqua-500/12 text-aqua-400'
                        : 'border-ink-700 bg-ink-800 text-white/60'
                    }`}
                  >
                    {t}
                    {SIZE_SURCHARGE[t] > 0 && (
                      <span className="ml-1.5 text-[11px] opacity-60">
                        +{SIZE_SURCHARGE[t]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {SIZE_SURCHARGE[type] > 0 && (
                <p className="mt-2 text-[12.5px] text-white/40">
                  {type}s carry a {aed(SIZE_SURCHARGE[type])} size supplement.
                </p>
              )}
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
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[13.5px] transition ${
                      color === c.name
                        ? 'border-aqua-500/60 bg-aqua-500/12 text-white'
                        : 'border-ink-700 bg-ink-800 text-white/55'
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

            <button className="btn-ghost !py-3.5" disabled={!canSave} onClick={save}>
              Save car
            </button>
          </div>
        )}

        <div className="h-36" />
      </Screen>

      <BottomBar>
        <button
          className="btn-primary"
          disabled={!draft.carId}
          onClick={() => navigate('/book/location')}
        >
          Continue
        </button>
      </BottomBar>
    </>
  )
}
