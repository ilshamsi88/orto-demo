import type { Booking } from '../types'
import { mapsLink } from './format'

/** yyyymmddThhmmss in local time — no timezone suffix, so calendars read it as wall clock. */
function stamp(date: string, time: string, addMinutes = 0): string {
  const d = new Date(`${date}T${time}:00`)
  d.setMinutes(d.getMinutes() + addMinutes)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}00`
  )
}

function escape(text: string): string {
  return text.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n')
}

export function bookingToIcs(b: Booking): string {
  const duration = b.service.durationMins + b.addOns.length * 15
  const description = [
    `Order ${b.orderNumber}`,
    `Vehicle: ${b.car.makeModel} (${b.car.plate})`,
    b.addOns.length ? `Add-ons: ${b.addOns.map((a) => a.name).join(', ')}` : '',
    `Total: AED ${b.total}`,
    mapsLink(b.location.lat, b.location.lng),
  ]
    .filter(Boolean)
    .join('\n')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Detailing Lab//Booking//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${b.id}@detailinglab`,
    `DTSTAMP:${stamp(b.date, b.time)}`,
    `DTSTART:${stamp(b.date, b.time)}`,
    `DTEND:${stamp(b.date, b.time, duration)}`,
    `SUMMARY:${escape(`Detailing Lab — ${b.service.name}`)}`,
    `DESCRIPTION:${escape(description)}`,
    `LOCATION:${escape(b.location.address)}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Car wash in 1 hour',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

/** Triggers a download of the .ics so the booking lands in the phone's calendar. */
export function downloadIcs(b: Booking): void {
  const blob = new Blob([bookingToIcs(b)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `detailing-lab-${b.orderNumber}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
