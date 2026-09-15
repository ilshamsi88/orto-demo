import type { AppState } from '../types'
import { INITIAL_STATE } from '../data/seed'

const KEY = 'detailing-lab:v1'

/** localStorage can throw in private mode, so every access is guarded. */
export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return INITIAL_STATE
    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      customer: parsed.customer ?? null,
      cars: parsed.cars ?? [],
      locations: parsed.locations ?? [],
      // Services can be edited in admin, but a fresh install gets the seed list.
      services: parsed.services?.length ? parsed.services : INITIAL_STATE.services,
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
