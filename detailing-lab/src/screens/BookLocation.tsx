import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomBar, NavBar, Screen } from '../components/Layout'
import BookingSteps from '../components/BookingSteps'
import MapPicker, { DEFAULT_CENTER, type LatLng } from '../components/MapPicker'
import { Check, Pin, Plus } from '../components/Icons'
import { useApp } from '../store/AppContext'
import { geocode } from '../lib/geocode'

const LABELS = ['Home', 'Office', 'Other']

export default function BookLocation() {
  const { locations, addLocation, draft, setDraft } = useApp()
  const navigate = useNavigate()
  const [adding, setAdding] = useState(locations.length === 0)
  const [label, setLabel] = useState('Home')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [point, setPoint] = useState<LatLng>(DEFAULT_CENTER)
  const [searching, setSearching] = useState(false)
  const [searchNote, setSearchNote] = useState('')

  const canSave = address.trim().length >= 5

  async function findOnMap() {
    setSearching(true)
    setSearchNote('')
    const hit = await geocode(address)
    setSearching(false)
    if (hit) {
      setPoint({ lat: hit.lat, lng: hit.lng })
      setSearchNote('Pin moved — drag it to the exact gate or parking bay.')
    } else {
      setSearchNote("Couldn't find that address. Drop the pin on the map instead.")
    }
  }

  function save() {
    if (!canSave) return
    const created = addLocation({
      label,
      address: address.trim(),
      lat: point.lat,
      lng: point.lng,
      notes: notes.trim() || undefined,
    })
    setDraft({ locationId: created.id })
    setAddress('')
    setNotes('')
    setAdding(false)
  }

  return (
    <>
      <NavBar title="Where To?" back />
      <BookingSteps current={2} />
      <Screen className="px-5">
        {locations.length > 0 && (
          <div className="space-y-2.5 pt-1">
            {locations.map((l) => {
              const isSelected = draft.locationId === l.id
              return (
                <button
                  key={l.id}
                  onClick={() => setDraft({ locationId: l.id })}
                  className={`flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? 'border-aqua-500/60 bg-aqua-500/[0.07] shadow-glow'
                      : 'border-ink-700/70 bg-ink-850'
                  }`}
                >
                  <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ink-700 bg-ink-800 text-aqua-400">
                    <Pin className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[15.5px] font-semibold text-white">{l.label}</div>
                    <div className="mt-0.5 text-[13px] leading-relaxed text-white/45">
                      {l.address}
                    </div>
                    {l.notes && (
                      <div className="mt-1 text-[12.5px] italic text-white/30">{l.notes}</div>
                    )}
                  </div>
                  {isSelected && (
                    <span className="mt-1 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-aqua-400">
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
            Add another address
          </button>
        ) : (
          <div className="card mt-3 space-y-4 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-white">Add an address</h3>
              {locations.length > 0 && (
                <button
                  onClick={() => setAdding(false)}
                  className="text-[13px] font-semibold text-white/45"
                >
                  Cancel
                </button>
              )}
            </div>

            <div>
              <span className="label">Save as</span>
              <div className="flex gap-2">
                {LABELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLabel(l)}
                    className={`flex-1 rounded-xl border px-3 py-2.5 text-[14px] font-medium transition ${
                      label === l
                        ? 'border-aqua-500/60 bg-aqua-500/12 text-aqua-400'
                        : 'border-ink-700 bg-ink-800 text-white/60'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label" htmlFor="address">
                Address
              </label>
              <textarea
                id="address"
                className="field min-h-[76px] resize-none"
                placeholder="Building, street, area, city"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <button
                onClick={findOnMap}
                disabled={address.trim().length < 3 || searching}
                className="mt-2 text-[13px] font-semibold text-aqua-400 disabled:opacity-40"
              >
                {searching ? 'Searching…' : 'Find this address on the map'}
              </button>
              {searchNote && <p className="mt-1.5 text-[12.5px] text-white/40">{searchNote}</p>}
            </div>

            <div>
              <span className="label">Drop the pin</span>
              <MapPicker value={point} onChange={setPoint} className="h-[230px]" />
              <p className="mt-2 text-[12px] text-white/30">
                Pin: {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
              </p>
            </div>

            <div>
              <label className="label" htmlFor="notes">
                Notes for the detailer <span className="font-normal opacity-60">(optional)</span>
              </label>
              <input
                id="notes"
                className="field"
                placeholder="e.g. Basement P2, bay 118"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button className="btn-ghost !py-3.5" disabled={!canSave} onClick={save}>
              Save address
            </button>
          </div>
        )}

        <div className="h-36" />
      </Screen>

      <BottomBar>
        <button
          className="btn-primary"
          disabled={!draft.locationId}
          onClick={() => navigate('/book/time')}
        >
          Continue
        </button>
      </BottomBar>
    </>
  )
}
