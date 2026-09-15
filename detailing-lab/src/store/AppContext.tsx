import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type {
  AddOn,
  AppLocation,
  AppState,
  Booking,
  BookingStatus,
  Car,
  Customer,
  PaymentMethod,
  Service,
} from '../types'
import { SIZE_SURCHARGE } from '../types'
import { clearState, loadState, saveState, uid } from '../lib/storage'
import { INITIAL_STATE } from '../data/seed'

/** In-progress booking, held while the customer walks through the five steps. */
export interface BookingDraft {
  serviceId?: string
  addOnIds?: string[]
  carId?: string
  locationId?: string
  date?: string
  time?: string
  paymentMethod?: PaymentMethod
  /** Set when an existing booking is being moved rather than a new one created. */
  rescheduleId?: string
}

export interface PriceBreakdown {
  base: number
  surcharge: number
  addOnTotal: number
  addOns: AddOn[]
  total: number
}

interface AppContextValue extends AppState {
  draft: BookingDraft
  setDraft: (patch: Partial<BookingDraft>) => void
  resetDraft: () => void
  toggleAddOn: (id: string) => void

  signIn: (customer: Customer) => void
  signOut: () => void
  updateCustomer: (patch: Partial<Customer>) => void

  addCar: (car: Omit<Car, 'id'>) => Car
  removeCar: (id: string) => void

  addLocation: (loc: Omit<AppLocation, 'id'>) => AppLocation
  removeLocation: (id: string) => void

  upsertService: (service: Service) => void
  removeService: (id: string) => void
  upsertAddOn: (addOn: AddOn) => void
  removeAddOn: (id: string) => void

  createBooking: (paymentMethod: PaymentMethod) => Booking
  rescheduleBooking: (id: string, date: string, time: string) => Booking | undefined
  cancelBooking: (id: string) => void
  setBookingStatus: (id: string, status: BookingStatus) => void
  markNotified: (id: string, channel: Booking['notifyChannel']) => void
  resetDemo: () => void

  priceFor: (draft: BookingDraft) => PriceBreakdown
}

const AppContext = createContext<AppContextValue | null>(null)

/** DL-4821 style, continuing from the highest existing number. */
function nextOrderNumber(bookings: Booking[]): string {
  const highest = bookings.reduce((max, b) => {
    const n = Number(b.orderNumber.replace(/\D/g, ''))
    return Number.isFinite(n) ? Math.max(max, n) : max
  }, 4900)
  return `DL-${highest + 1}`
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())
  const [draft, setDraftState] = useState<BookingDraft>({})

  // Persist on every change so a demo survives an accidental refresh mid-pitch.
  useEffect(() => {
    saveState(state)
  }, [state])

  // createBooking reads the freshest state without being re-created each render.
  // Synced in effects, which flush before any user event handler can read them.
  const stateRef = useRef(state)
  const draftRef = useRef(draft)
  useEffect(() => {
    stateRef.current = state
  }, [state])
  useEffect(() => {
    draftRef.current = draft
  }, [draft])

  const setDraft = useCallback((patch: Partial<BookingDraft>) => {
    setDraftState((d) => ({ ...d, ...patch }))
  }, [])

  const resetDraft = useCallback(() => setDraftState({}), [])

  const toggleAddOn = useCallback((id: string) => {
    setDraftState((d) => {
      const current = d.addOnIds ?? []
      return {
        ...d,
        addOnIds: current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
      }
    })
  }, [])

  const priceFor = useCallback<AppContextValue['priceFor']>((d) => {
    const snapshot = stateRef.current
    const service = snapshot.services.find((x) => x.id === d.serviceId)
    const car = snapshot.cars.find((x) => x.id === d.carId)
    const addOns = snapshot.addOns.filter((a) => (d.addOnIds ?? []).includes(a.id))
    const base = service?.price ?? 0
    const surcharge = car ? SIZE_SURCHARGE[car.type] : 0
    const addOnTotal = addOns.reduce((sum, a) => sum + a.price, 0)
    return { base, surcharge, addOns, addOnTotal, total: base + surcharge + addOnTotal }
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      draft,
      setDraft,
      resetDraft,
      toggleAddOn,
      priceFor,

      signIn: (customer) => setState((s) => ({ ...s, customer })),
      signOut: () => setState((s) => ({ ...s, customer: null })),
      updateCustomer: (patch) =>
        setState((s) => (s.customer ? { ...s, customer: { ...s.customer, ...patch } } : s)),

      addCar: (car) => {
        const created: Car = { ...car, id: uid('car') }
        setState((s) => ({ ...s, cars: [...s.cars, created] }))
        return created
      },
      removeCar: (id) => setState((s) => ({ ...s, cars: s.cars.filter((c) => c.id !== id) })),

      addLocation: (loc) => {
        const created: AppLocation = { ...loc, id: uid('loc') }
        setState((s) => ({ ...s, locations: [...s.locations, created] }))
        return created
      },
      removeLocation: (id) =>
        setState((s) => ({ ...s, locations: s.locations.filter((l) => l.id !== id) })),

      upsertService: (service) =>
        setState((s) => ({
          ...s,
          services: s.services.some((x) => x.id === service.id)
            ? s.services.map((x) => (x.id === service.id ? service : x))
            : [...s.services, service],
        })),
      removeService: (id) =>
        setState((s) => ({ ...s, services: s.services.filter((x) => x.id !== id) })),

      upsertAddOn: (addOn) =>
        setState((s) => ({
          ...s,
          addOns: s.addOns.some((x) => x.id === addOn.id)
            ? s.addOns.map((x) => (x.id === addOn.id ? addOn : x))
            : [...s.addOns, addOn],
        })),
      removeAddOn: (id) => setState((s) => ({ ...s, addOns: s.addOns.filter((x) => x.id !== id) })),

      createBooking: (paymentMethod) => {
        const snapshot = stateRef.current
        const d = draftRef.current
        const service = snapshot.services.find((x) => x.id === d.serviceId)
        const car = snapshot.cars.find((x) => x.id === d.carId)
        const location = snapshot.locations.find((x) => x.id === d.locationId)
        if (!service || !car || !location || !d.date || !d.time || !snapshot.customer) {
          throw new Error('Booking is incomplete')
        }
        const addOns = snapshot.addOns.filter((a) => (d.addOnIds ?? []).includes(a.id))
        const surcharge = SIZE_SURCHARGE[car.type]
        const addOnTotal = addOns.reduce((sum, a) => sum + a.price, 0)
        const booking: Booking = {
          id: uid('bkg'),
          orderNumber: nextOrderNumber(snapshot.bookings),
          customerName: snapshot.customer.name,
          customerPhone: snapshot.customer.phone,
          service: {
            id: service.id,
            name: service.name,
            price: service.price,
            durationMins: service.durationMins,
            image: service.image,
          },
          addOns,
          car,
          location,
          date: d.date,
          time: d.time,
          sizeSurcharge: surcharge,
          total: service.price + surcharge + addOnTotal,
          // Passed in explicitly: a setDraft() on the same click would not have
          // flushed into draftRef by the time this runs.
          paymentMethod,
          status: 'Confirmed',
          createdAt: new Date().toISOString(),
        }
        setState((s) => ({ ...s, bookings: [booking, ...s.bookings] }))
        return booking
      },

      rescheduleBooking: (id, date, time) => {
        const existing = stateRef.current.bookings.find((b) => b.id === id)
        if (!existing) return undefined
        const moved = { ...existing, date, time, status: 'Confirmed' as BookingStatus }
        setState((s) => ({
          ...s,
          bookings: s.bookings.map((b) => (b.id === id ? moved : b)),
        }))
        return moved
      },

      cancelBooking: (id) =>
        setState((s) => ({
          ...s,
          bookings: s.bookings.filter((b) => b.id !== id),
        })),

      setBookingStatus: (id, status) =>
        setState((s) => ({
          ...s,
          bookings: s.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
        })),

      markNotified: (id, channel) =>
        setState((s) => ({
          ...s,
          bookings: s.bookings.map((b) =>
            b.id === id ? { ...b, notifiedAt: new Date().toISOString(), notifyChannel: channel } : b,
          ),
        })),

      resetDemo: () => {
        clearState()
        setState(INITIAL_STATE)
        setDraftState({})
      },
    }),
    [state, draft, setDraft, resetDraft, toggleAddOn, priceFor],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
