import type { AppState } from '../types'
import { INITIAL_STATE } from '../data/seed'

const KEY = 'detailing-lab:v2'

/** localStorage can throw in private mode, so every access is guarded. */
export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return INITIAL_STATE
    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      city: parsed.city ?? INITIAL_STATE.city,
      customer: parsed.customer ?? null,
      cars: parsed.cars ?? [],
      locations: parsed.locations ?? [],
      // `??`, not a truthiness check on length: an owner who deliberately deletes
      // every service in admin must not have the seed list reappear on reload.
      // Only genuinely absent keys (older or corrupt saves) fall back to the seed.
      services: parsed.services ?? INITIAL_STATE.services,
      addOns: parsed.addOns ?? INITIAL_STATE.addOns,
      bookings: parsed.bookings ?? INITIAL_STATE.bookings,
    }
  } catch {
    return INITIAL_STATE
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Demo still works in-memory if storage is unavailable.
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}

export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}
