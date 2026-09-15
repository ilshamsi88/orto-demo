import type { Booking } from '../types'
import { aed, longDate, mapsLink, time12 } from './format'

/**
 * WhatsApp notification adapter.
 *
 * Three modes, chosen by VITE_WHATSAPP_MODE so the demo works today and the real
 * integration is a credentials swap, not a rewrite:
 *
 *  - 'link'      (default) — opens a wa.me deep link pre-filled with the booking.
 *                One tap on "Send" in WhatsApp. No API account, no cost.
 *  - 'api'       — POSTs to VITE_NOTIFY_ENDPOINT, which sends via WhatsApp Cloud
 *                API or Twilio server-side. Fully automatic. See api/notify-whatsapp.js.
 *  - 'simulated' — sends nothing, just records the exact message. Useful when
 *                presenting without a phone handy.
 */
export type NotifyMode = 'link' | 'api' | 'simulated'

const MODE = (import.meta.env.VITE_WHATSAPP_MODE as NotifyMode) || 'link'
const OWNER_NUMBER = (import.meta.env.VITE_OWNER_WHATSAPP as string) || ''
const ENDPOINT = (import.meta.env.VITE_NOTIFY_ENDPOINT as string) || '/api/notify-whatsapp'

export function notifyMode(): NotifyMode {
  // Without an owner number a wa.me link has nowhere to go, so fall back to simulated.
  if (MODE === 'link' && !digitsOnly(OWNER_NUMBER)) return 'simulated'
  return MODE
}

export function ownerNumber(): string {
  return OWNER_NUMBER
}

function digitsOnly(phone: string): string {
  return phone.replace(/[^\d]/g, '')
}

/** The exact text the owner receives. Every field the owner asked for is here. */
export function buildMessage(b: Booking): string {
  return [
    '🧼 *NEW BOOKING — Detailing Lab*',
    `Order: *${b.orderNumber}*`,
    '',
    `👤 Customer: ${b.customerName}`,
    `📱 Phone: ${b.customerPhone}`,
    '',
    `🧴 Service: ${b.service.name}`,
    `🚗 Car: ${b.car.makeModel} (${b.car.type}, ${b.car.color})`,
    `🔢 Plate: ${b.car.plate}`,
    '',
    `📅 Date: ${longDate(b.date)}`,
    `⏰ Time: ${time12(b.time)}`,
    '',
    `📍 Location: ${b.location.label} — ${b.location.address}`,
    `🗺️ Map: ${mapsLink(b.location.lat, b.location.lng)}`,
    b.location.notes ? `📝 Notes: ${b.location.notes}` : '',
    '',
    `💰 Total: *${aed(b.total)}*`,
  ]
    .filter(Boolean)
    .join('\n')
}

export function waLink(b: Booking): string {
  return `https://wa.me/${digitsOnly(OWNER_NUMBER)}?text=${encodeURIComponent(buildMessage(b))}`
}

export interface NotifyResult {
  channel: NotifyMode
  ok: boolean
  message: string
  detail?: string
}

/**
 * Fire the owner notification. Called the instant a booking is confirmed.
 * Must be invoked from a user gesture so mobile Safari allows the WhatsApp handoff.
 */
export async function notifyOwner(b: Booking): Promise<NotifyResult> {
  const message = buildMessage(b)
  const mode = notifyMode()

  if (mode === 'simulated') {
    return { channel: 'simulated', ok: true, message }
  }

  if (mode === 'link') {
    // Opening in a new tab keeps the confirmation screen alive behind WhatsApp.
    window.open(waLink(b), '_blank', 'noopener')
    return { channel: 'link', ok: true, message }
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking: b, message }),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      return { channel: 'api', ok: false, message, detail: detail || `HTTP ${res.status}` }
    }
    return { channel: 'api', ok: true, message }
  } catch (err) {
    return {
      channel: 'api',
      ok: false,
      message,
      detail: err instanceof Error ? err.message : 'Network error',
    }
  }
}
