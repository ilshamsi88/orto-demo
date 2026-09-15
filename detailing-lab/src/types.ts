export type CarType = 'Sedan' | 'SUV' | '4x4' | 'Other'

export const CAR_TYPES: CarType[] = ['Sedan', 'SUV', '4x4', 'Other']

/** Larger vehicles take longer and use more product. */
export const SIZE_SURCHARGE: Record<CarType, number> = {
  Sedan: 0,
  SUV: 30,
  '4x4': 40,
  Other: 20,
}

export type ServiceCategory = 'wash' | 'detailing'

export interface Service {
  id: string
  name: string
  description: string
  includes: string[]
  price: number
  durationMins: number
  category: ServiceCategory
  image: string
  popular?: boolean
}

export interface AddOn {
  id: string
  name: string
  price: number
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

export type PaymentMethod = 'card' | 'apple' | 'cash'

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  card: 'Credit / Debit Card',
  apple: 'Apple Pay',
  cash: 'Cash on Arrival',
}

export interface Booking {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  service: Pick<Service, 'id' | 'name' | 'price' | 'durationMins' | 'image'>
  addOns: AddOn[]
  car: Car
  location: AppLocation
  date: string // yyyy-mm-dd
  time: string // HH:mm (24h)
  sizeSurcharge: number
  total: number
  paymentMethod: PaymentMethod
  status: BookingStatus
  createdAt: string
  cancelledAt?: string
  notifiedAt?: string
  notifyChannel?: 'link' | 'api' | 'simulated'
}

export interface Customer {
  name: string
  phone: string
  email?: string
}

/** Everything the demo persists between sessions. */
export interface AppState {
  customer: Customer | null
  cars: Car[]
  locations: AppLocation[]
  services: Service[]
  addOns: AddOn[]
  bookings: Booking[]
}
