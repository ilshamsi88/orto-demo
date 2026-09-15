import type { Booking } from '../types'

const OPEN_HOUR = 8
const CLOSE_HOUR = 20
const STEP_MINS = 30

export interface Slot {
  time: string
  available: boolean
  reason?: 'booked' | 'past' | 'full'
}

export function nextDays(count: number): string[] {
  const out: string[] = []
  const d = new Date()
  for (let i = 0; i < count; i++) {
    out.push(d.toISOString().slice(0, 10))
    d.setDate(d.getDate() + 1)
  }
  return out
}

/** Deterministic per-date "already busy" slots so the calendar looks like a real diary. */
function pseudoBusy(date: string, time: string): boolean {
  const seed = [...`${date}${time}`].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 9973, 7)
  return seed % 7 === 0
}

export function slotsFor(date: string, bookings: Booking[], durationMins: number): Slot[] {
  const taken = new Set(
    bookings.filter((b) => b.date === date && b.status !== 'Completed').map((b) => b.time),
  )
  const slots: Slot[] = []
  const now = Date.now()

  for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
    for (let m = 0; m < 60; m += STEP_MINS) {
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      const startsAt = new Date(`${date}T${time}:00`).getTime()

      // A job must finish before closing time.
      const endsAt = startsAt + durationMins * 60_000
      const closesAt = new Date(`${date}T${String(CLOSE_HOUR).padStart(2, '0')}:00:00`).getTime()

      let available = true
      let reason: Slot['reason']
      if (startsAt < now + 60 * 60_000) {
        available = false
        reason = 'past'
      } else if (endsAt > closesAt) {
        available = false
        reason = 'full'
      } else if (taken.has(time) || pseudoBusy(date, time)) {
        available = false
        reason = 'booked'
      }

      slots.push({ time, available, reason })
    }
  }
  return slots
}
