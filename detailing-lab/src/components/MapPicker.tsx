import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { Crosshair } from './Icons'

export interface LatLng {
  lat: number
  lng: number
}

/** Dubai Marina-ish — a sensible default pin for a UAE demo. */
export const DEFAULT_CENTER: LatLng = { lat: 25.2048, lng: 55.2708 }

/** DivIcon avoids Leaflet's bundled PNG markers, which break under Vite's asset handling. */
const pinIcon = L.divIcon({
  className: '',
  html: `
    <div style="position:relative;transform:translate(-50%,-100%)">
      <svg width="34" height="44" viewBox="0 0 34 44" fill="none">
        <path d="M17 43s14-16.2 14-26A14 14 0 1 0 3 17c0 9.8 14 26 14 26z" fill="#F2A9A0"/>
        <path d="M17 43s14-16.2 14-26A14 14 0 1 0 3 17c0 9.8 14 26 14 26z" stroke="#07080A" stroke-width="2"/>
        <circle cx="17" cy="17" r="5" fill="#07080A"/>
      </svg>
    </div>`,
  iconSize: [0, 0],
})

interface MapPickerProps {
  value: LatLng
  onChange: (next: LatLng) => void
  className?: string
}

export default function MapPicker({ value, onChange, className = '' }: MapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: [value.lat, value.lng],
      zoom: 14,
      zoomControl: false,
      attributionControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map)

    const marker = L.marker([value.lat, value.lng], { icon: pinIcon, draggable: true }).addTo(map)
    marker.on('dragend', () => {
      const { lat, lng } = marker.getLatLng()
      onChangeRef.current({ lat, lng })
    })
    map.on('click', (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng)
      onChangeRef.current({ lat: e.latlng.lat, lng: e.latlng.lng })
    })

    mapRef.current = map
    markerRef.current = marker

    // The map mounts inside an animating sheet; recalculate once it has settled.
    const t = setTimeout(() => map.invalidateSize(), 250)
    return () => {
      clearTimeout(t)
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
    // Mount once; external value changes are handled by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep the pin in sync when the value is changed from outside (e.g. address search).
  useEffect(() => {
    const marker = markerRef.current
    const map = mapRef.current
    if (!marker || !map) return
    const current = marker.getLatLng()
    if (Math.abs(current.lat - value.lat) < 1e-7 && Math.abs(current.lng - value.lng) < 1e-7) return
    marker.setLatLng([value.lat, value.lng])
    map.panTo([value.lat, value.lng])
  }, [value])

  function useMyLocation() {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false)
        onChangeRef.current({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        mapRef.current?.setView([pos.coords.latitude, pos.coords.longitude], 16)
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-ink-700 ${className}`}>
      <div ref={containerRef} className="h-full w-full" />
      <button
        type="button"
        onClick={useMyLocation}
        aria-label="Use my current location"
        className="absolute right-3 top-3 z-[500] flex h-10 w-10 items-center justify-center rounded-full border border-ink-600 bg-ink-900/90 text-white backdrop-blur transition active:scale-95"
      >
        <Crosshair className={`h-5 w-5 ${locating ? 'animate-spin text-blush-400' : ''}`} />
      </button>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[500] bg-gradient-to-t from-ink-950/80 to-transparent px-3 pb-6 pt-8 text-center text-[11.5px] text-white/60">
        Tap the map or drag the pin to set the exact spot
      </div>
    </div>
  )
}
