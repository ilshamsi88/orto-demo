import type { AppState, Booking, Service } from '../types'

export const SERVICES: Service[] = [
  {
    id: 'svc-express',
    name: 'Express Exterior Wash',
    description: 'A fast, spot-free outside wash. In and out while you grab a coffee.',
    includes: ['Foam pre-soak', 'Hand wash & dry', 'Wheels & tyre shine', 'Glass cleaned'],
    price: 60,
    durationMins: 30,
  },
  {
    id: 'svc-full',
    name: 'Inside & Out Wash',
    description: 'Our most booked service. Exterior wash plus a full interior clean-up.',
    includes: [
      'Everything in Express',
      'Interior vacuum',
      'Dashboard & console wipe-down',
      'Door jambs cleaned',
      'Air freshener',
    ],
    price: 120,
    durationMins: 60,
    popular: true,
  },
  {
    id: 'svc-wax',
    name: 'Premium Hand Wash & Wax',
    description: 'Deep clean with a hand-applied wax for that showroom gloss and protection.',
    includes: [
      'Everything in Inside & Out',
      'Clay bar decontamination',
      'Hand-applied carnauba wax',
      'Trim & plastic dressing',
    ],
    price: 220,
    durationMins: 90,
  },
  {
    id: 'svc-interior',
    name: 'Full Interior Detail',
    description: 'Seats, carpets and trim brought back to life. Ideal before a resale or after a road trip.',
    includes: [
      'Steam clean & shampoo',
      'Leather clean and condition',
      'Headliner & vents detailed',
      'Odour treatment',
    ],
    price: 450,
    durationMins: 180,
  },
  {
    id: 'svc-ceramic',
    name: 'Ceramic Coating',
    description: 'Multi-stage paint correction and a 12-month ceramic layer. Booked as a full-day job.',
    includes: [
      'Paint decontamination',
      'Single-stage machine polish',
      '12-month ceramic coating',
      'Aftercare kit included',
    ],
    price: 1500,
    durationMins: 360,
  },
  {
    id: 'svc-engine',
    name: 'Engine Bay Cleaning',
    description: 'Degrease, rinse and dress the engine bay. Add it on to any wash.',
    includes: ['Degrease & agitate', 'Low-pressure rinse', 'Plastic & hose dressing'],
    price: 150,
    durationMins: 45,
  },
]

function isoDaysFromNow(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

/** A couple of past jobs so "My Bookings" and the admin list are never empty on first open. */
const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: 'bkg-sample-1',
    orderNumber: 'DL-4821',
    customerName: 'Omar Al Balushi',
    customerPhone: '+971 50 220 4821',
    service: { id: 'svc-full', name: 'Inside & Out Wash', price: 120, durationMins: 60 },
    car: { id: 'car-sample-1', makeModel: 'Nissan Patrol', type: '4x4', plate: 'A 44219', color: 'White' },
    location: {
      id: 'loc-sample-1',
      label: 'Home',
      address: 'Villa 12, Al Barsha 2, Dubai',
      lat: 25.1012,
      lng: 55.1985,
    },
    date: isoDaysFromNow(-6),
    time: '10:00',
    sizeSurcharge: 30,
    total: 150,
    status: 'Completed',
    createdAt: new Date(Date.now() - 7 * 864e5).toISOString(),
  },
  {
    id: 'bkg-sample-2',
    orderNumber: 'DL-4903',
    customerName: 'Layla Haddad',
    customerPhone: '+971 55 771 0934',
    service: { id: 'svc-wax', name: 'Premium Hand Wash & Wax', price: 220, durationMins: 90 },
    car: { id: 'car-sample-2', makeModel: 'BMW 430i', type: 'Coupe', plate: 'K 90341', color: 'Black' },
    location: {
      id: 'loc-sample-2',
      label: 'Office',
      address: 'Boulevard Plaza Tower 1, Downtown Dubai',
      lat: 25.1959,
      lng: 55.2748,
    },
    date: isoDaysFromNow(1),
    time: '16:30',
    sizeSurcharge: 0,
    total: 220,
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 1 * 864e5).toISOString(),
  },
]

export const INITIAL_STATE: AppState = {
  customer: null,
  cars: [],
  locations: [],
  services: SERVICES,
  bookings: SAMPLE_BOOKINGS,
}
