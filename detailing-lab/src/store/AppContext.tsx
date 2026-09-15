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
  AppLocation,
  AppState,
  Booking,
  BookingStatus,
  Car,
  Customer,
  Service,
} from '../types'
import { SIZE_SURCHARGE } from '../types'
import { clearState, loadState, saveState, uid } from '../lib/storage'
import { INITIAL_STATE } from '../data/seed'

/** In-progress booking, held while the customer walks through the flow. */
export interface BookingDraft {
  serviceId?: string
  carId?: string
  locationId?: string
  date?: string
  time?: string
}

interface AppContextValue extends AppState {
  draft: BookingDraft
  setDraft: (patch: Partial<BookingDraft>) => void
  resetDraft: () => void

  signIn: (customer: Customer) => void
  signOut: () => void
  updateCustomer: (patch: Partial<Customer>) => void

  addCar: (car: Omit<Car, 'id'>) => Car
  updateCar: (id: string, patch: Partial<Car>) => void
  removeCar: (id: string) => void

  addLocation: (loc: Omit<AppLocation, 'id'>) => AppLocation
  updateLocation: (id: string, patch: Partial<AppLocation>) => void
  removeLocation: (id: string) => void

  upsertService: (service: Service) => void
  removeService: (id: string) => void

  createBooking: () => Booking
  setBookingStatus: (id: string, status: BookingStatus) => void
  markNotified: (id: string, channel: Booking['notifyChannel']) => void
  resetDemo: () => void

  priceFor: (serviceId?: string, carId?: string) => { base: number; surcharge: number; total: number }
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

  // createBooking needs the freshest state without being re-created on each render.
  // Synced in an effect (not during render) so the refs are never written mid-render;
  // effects flush before any user event handler can read them.
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

  const priceFor = useCallback<AppContextValue['priceFor']>((serviceId, carId) => {
    const s = stateRef.current.services.find((x) => x.id === serviceId)
    const car = stateRef.current.cars.find((x) => x.id === carId)
    const base = s?.price ?? 0
    const surcharge = car ? SIZE_SURCHARGE[car.type] : 0
    return { base, surcharge, total: base + surcharge }
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      draft,
      setDraft,
      resetDraft,
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
      updateCar: (id, patch) =>
        setState((s) => ({
          ...s,
          cars: s.cars.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      removeCar: (id) => setState((s) => ({ ...s, cars: s.cars.filter((c) => c.id !== id) })),

      addLocation: (loc) => {
        const created: AppLocation = { ...loc, id: uid('loc') }
        setState((s) => ({ ...s, locations: [...s.locations, created] }))
        return created
      },
      updateLocation: (id, patch) =>
        setState((s) => ({
          ...s,
          locations: s.locations.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        })),
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

      createBooking: () => {
        const snapshot = stateRef.current
        const d = draftRef.current
        const service = snapshot.services.find((x) => x.id === d.serviceId)
        const car = snapshot.cars.find((x) => x.id === d.carId)
        const location = snapshot.locations.find((x) => x.id === d.locationId)
        if (!service || !car || !location || !d.date || !d.time || !snapshot.customer) {
          throw new Error('Booking is incomplete')
        }
        const surcharge = SIZE_SURCHARGE[car.type]
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
          },
          car,
          location,
          date: d.date,
          time: d.time,
          sizeSurcharge: surcharge,
          total: service.price + surcharge,
          status: 'Confirmed',
          createdAt: new Date().toISOString(),
        }
        setState((s) => ({ ...s, bookings: [booking, ...s.bookings] }))
        return booking
      },

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
    [state, draft, setDraft, resetDraft, priceFor],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
