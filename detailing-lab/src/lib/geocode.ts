import type { LatLng } from '../components/MapPicker'

/**
 * Address lookup via OpenStreetMap Nominatim — free and key-less, which keeps the
 * demo deployable today. If the shop later wants Google-quality UAE addresses,
 * swap this one function for the Google Geocoding API.
 */
export async function geocode(query: string): Promise<(LatLng & { label: string }) | null> {
  if (query.trim().length < 3) return null
  try {
    const url = new URL('https://nominatim.openstreetmap.org/search')
    url.searchParams.set('q', query)
    url.searchParams.set('format', 'json')
    url.searchParams.set('limit', '1')
    url.searchParams.set('countrycodes', 'ae')
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return null
    const results = (await res.json()) as Array<{
      lat: string
      lon: string
      display_name: string
    }>
    if (!results.length) return null
    return {
      lat: Number(results[0].lat),
      lng: Number(results[0].lon),
      label: results[0].display_name,
    }
  } catch {
    // Offline or rate-limited: the customer can still drop the pin by hand.
    return null
  }
}
