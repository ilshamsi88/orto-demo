export type CarType = 'Sedan' | 'SUV' | '4x4' | 'Coupe' | 'Pickup' | 'Van'

export const CAR_TYPES: CarType[] = ['Sedan', 'SUV', '4x4', 'Coupe', 'Pickup', 'Van']

/** Larger vehicles take longer and use more product. */
export const SIZE_SURCHARGE: Record<CarType, number> = {
  Sedan: 0,
  Coupe: 0,
  SUV: 30,
  '4x4': 30,
  Pickup: 40,
  Van: 50,
}

export interface Service {
  id: string
  name: string
  description: string
  includes: string[]
  price: number
  durationMins: number
  popular?: boolean
  archived?: boolean
}

export interface Car {
  id: string
  makeModel: string
  type: CarType
  plate: string
  color: string
}

export interface AppLocation {
  id: string
  label: string
  address: string
  lat: number
  lng: number
  notes?: string
}

export const BOOKING_STATUSES = [
  'Confirmed',
  'On the Way',
  'Arrived',
  'Washing',
  'Completed',
] as const

export type BookingStatus = (typeof BOOKING_STATUSES)[number]

export interface Booking {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  service: Pick<Service, 'id' | 'name' | 'price' | 'durationMins'>
  car: Car
  location: AppLocation
  date: string // yyyy-mm-dd
  time: string // HH:mm (24h)
  sizeSurcharge: number
  total: number
  status: BookingStatus
  createdAt: string
  notifiedAt?: string
  notifyChannel?: 'link' | 'api' | 'simulated'
}

export interface Customer {
  name: string
  phone: string
}

/** Everything the demo persists between sessions. */
export interface AppState {
  customer: Customer | null
  cars: Car[]
  locations: AppLocation[]
  services: Service[]
  bookings: Booking[]
}
