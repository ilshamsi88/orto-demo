import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import { BottomBar, NavBar, Screen } from '../components/Layout'
import MapPicker, { DEFAULT_CENTER, type LatLng } from '../components/MapPicker'
import { ArrowRight, Pin, Search } from '../components/Icons'
import { useApp } from '../store/AppContext'
import { geocode } from '../lib/geocode'

const LABELS = ['Home', 'Office', 'Other']

export default function BookLocation() {
  const { locations, addLocation, draft, setDraft } = useApp()
  const navigate = useNavigate()

  const existing = locations.find((l) => l.id === draft.locationId)
  const [label, setLabel] = useState(existing?.label ?? 'Home')
  const [address, setAddress] = useState(existing?.address ?? '')
  const [notes, setNotes] = useState(existing?.notes ?? '')
  const [point, setPoint] = useState<LatLng>(
    existing ? { lat: existing.lat, lng: existing.lng } : DEFAULT_CENTER,
  )
  const [placeName, setPlaceName] = useState(existing?.label ?? 'Dubai Marina')
  const [searching, setSearching] = useState(false)
  const [searchNote, setSearchNote] = useState('')

  if (!draft.serviceId) return <Navigate to="/services" replace />

  const ready = address.trim().length >= 5

  async function findOnMap() {
    setSearching(true)
    setSearchNote('')
    const hit = await geocode(address)
    setSearching(false)
    if (hit) {
      setPoint({ lat: hit.lat, lng: hit.lng })
      setPlaceName(hit.label.split(',')[0] || 'Selected location')
      setSearchNote('Pin moved — drag it to the exact gate or parking bay.')
    } else {
      setSearchNote("Couldn't find that address. Drop the pin on the map instead.")
    }
  }

  function applySavedAddress(id: string) {
    const l = locations.find((x) => x.id === id)
    if (!l) return
    setLabel(l.label)
    setAddress(l.address)
    setNotes(l.notes ?? '')
    setPoint({ lat: l.lat, lng: l.lng })
    setPlaceName(l.label)
    setDraft({ locationId: l.id })
  }

  function next() {
    if (!ready) return
    const trimmed = address.trim()
    const match = locations.find(
      (l) => l.address.toLowerCase() === trimmed.toLowerCase() && l.label === label,
    )
    const loc =
      match ??
      addLocation({
        label,
        address: trimmed,
        lat: point.lat,
        lng: point.lng,
        notes: notes.trim() || undefined,
      })
    setDraft({ locationId: loc.id })
    navigate('/book/time')
  }

  return (
    <>
      <StatusBar />
      <NavBar
        title="Your Location"
        subtitle="Where shall we come to?"
        back
        step={[2, 5]}
      />
      <Screen withBottomBar className="px-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/35" />
          <input
            className="field pl-11"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onBlur={() => address.trim().length >= 4 && findOnMap()}
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <button
            onClick={findOnMap}
            disabled={address.trim().length < 3 || searching}
            className="text-[12.5px] font-semibold text-blush-400 disabled:opacity-40"
          >
            {searching ? 'Searching…' : 'Find on map'}
          </button>
          <div className="flex gap-1.5">
            {LABELS.map((l) => (
              <button
                key={l}
                onClick={() => setLabel(l)}
                className={`rounded-full border px-3 py-1 text-[11.5px] font-medium transition ${
                  label === l
                    ? 'border-blush-400 bg-blush-400 text-ink-950'
                    : 'border-ink-700 bg-ink-850 text-white/50'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        {searchNote && <p className="mt-2 text-[12px] text-white/40">{searchNote}</p>}

        {locations.length > 0 && (
          <div className="no-scrollbar -mx-1 mt-3 flex gap-2 overflow-x-auto px-1">
            {locations.map((l) => (
              <button
                key={l.id}
                onClick={() => applySavedAddress(l.id)}
                className={`chip ${draft.locationId === l.id ? 'chip-on' : 'chip-off'}`}
              >
                <Pin className="mr-1 inline h-3.5 w-3.5" />
                {l.label}
              </button>
            ))}
          </div>
        )}

        <div className="relative mt-4">
          <MapPicker value={point} onChange={setPoint} className="h-[260px]" />
          {/* Place callout, matching the reference's floating label */}
          <div className="pointer-events-none absolute left-1/2 top-[24px] z-[500] -translate-x-1/2 rounded-lg bg-white px-3 py-1.5 text-center shadow-lift">
            <div className="text-[12.5px] font-semibold leading-tight text-ink-950">
              {placeName}
            </div>
            <div className="text-[10.5px] leading-tight text-ink-950/55">Dubai, UAE</div>
          </div>
        </div>

        <label className="label mt-5" htmlFor="notes">
          Add notes (optional)
        </label>
        <input
          id="notes"
          className="field"
          placeholder="e.g. Tower name, parking instructions"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="h-4" />
      </Screen>

      <BottomBar>
        <button className="btn-primary" disabled={!ready} onClick={next}>
          Next: Select Time
          <ArrowRight className="h-[18px] w-[18px]" />
        </button>
      </BottomBar>
    </>
  )
}
