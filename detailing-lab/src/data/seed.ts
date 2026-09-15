import type { AddOn, AppState, Booking, Service } from '../types'

export const SERVICES: Service[] = [
  {
    id: 'svc-express',
    name: 'Express Wash',
    description: 'Exterior wash, wheels, dry',
    includes: ['Foam pre-soak', 'Hand wash & dry', 'Wheels & tyre shine', 'Glass cleaned'],
    price: 79,
    durationMins: 30,
    category: 'wash',
    image: 'express',
  },
  {
    id: 'svc-premium',
    name: 'Premium Wash',
    description: 'Exterior + interior cleaning',
    includes: [
      'Everything in Express',
      'Interior vacuum',
      'Dashboard & console wipe-down',
      'Door jambs cleaned',
      'Air freshener',
    ],
    price: 149,
    durationMins: 60,
    category: 'wash',
    image: 'premium',
    popular: true,
  },
  {
    id: 'svc-detailing',
    name: 'Full Detailing',
    description: 'Deep clean, polish, protect',
    includes: [
      'Everything in Premium',
      'Clay bar decontamination',
      'Machine polish',
      'Hand-applied wax',
      'Trim & plastic dressing',
    ],
    price: 299,
    durationMins: 180,
    category: 'detailing',
    image: 'detailing',
  },
  {
    id: 'svc-interior',
    name: 'Interior Detailing',
    description: 'Seats, carpets, dashboard',
    includes: [
      'Steam clean & shampoo',
      'Leather clean and condition',
      'Headliner & vents detailed',
      'Odour treatment',
    ],
    price: 199,
    durationMins: 120,
    category: 'detailing',
    image: 'interior',
  },
  {
    id: 'svc-ceramic',
    name: 'Ceramic Coating',
    description: '12-month paint protection',
    includes: [
      'Paint decontamination',
      'Single-stage machine polish',
      '12-month ceramic coating',
      'Aftercare kit included',
    ],
    price: 1500,
    durationMins: 360,
    category: 'detailing',
    image: 'ceramic',
  },
]

export const ADD_ONS: AddOn[] = [
  { id: 'add-engine', name: 'Engine Bay Clean', price: 49 },
  { id: 'add-headlight', name: 'Headlight Restoration', price: 79 },
  { id: 'add-wax', name: 'Ceramic Wax', price: 149 },
  { id: 'add-pethair', name: 'Pet Hair Removal', price: 79 },
]

function isoDaysFromNow(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

/** Sample jobs so My Bookings and the admin list are never empty on first open. */
const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: 'bkg-sample-1',
    orderNumber: 'DL-4821',
    customerName: 'Omar Al Balushi',
    customerPhone: '+971 50 220 4821',
    service: {
      id: 'svc-express',
      name: 'Express Wash',
      price: 79,
      durationMins: 30,
      image: 'express',
    },
    addOns: [],
    car: { id: 'car-sample-1', makeModel: 'Nissan Patrol', type: 'SUV', plate: 'A 44219', color: 'White' },
    location: {
      id: 'loc-sample-1',
      label: 'Home',
      address: 'JLT, Cluster D, Dubai',
      lat: 25.0693,
      lng: 55.1409,
    },
    date: isoDaysFromNow(-9),
    time: '16:00',
    sizeSurcharge: 0,
    total: 79,
    paymentMethod: 'card',
    status: 'Completed',
    createdAt: new Date(Date.now() - 10 * 864e5).toISOString(),
  },
  {
    id: 'bkg-sample-2',
    orderNumber: 'DL-4903',
    customerName: 'Layla Haddad',
    customerPhone: '+971 55 771 0934',
    service: {
      id: 'svc-premium',
      name: 'Premium Wash',
      price: 149,
      durationMins: 60,
      image: 'premium',
    },
    addOns: [],
    car: { id: 'car-sample-2', makeModel: 'BMW 430i', type: 'Sedan', plate: 'K 90341', color: 'Black' },
    location: {
      id: 'loc-sample-2',
      label: 'Office',
      address: 'Dubai Marina, Dubai',
      lat: 25.0805,
      lng: 55.1403,
    },
    date: isoDaysFromNow(1),
    time: '13:00',
    sizeSurcharge: 0,
    total: 149,
    paymentMethod: 'apple',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 1 * 864e5).toISOString(),
  },
]

export const INITIAL_STATE: AppState = {
  city: 'Dubai',
  customer: null,
  cars: [],
  locations: [],
  services: SERVICES,
  addOns: ADD_ONS,
  bookings: SAMPLE_BOOKINGS,
}
