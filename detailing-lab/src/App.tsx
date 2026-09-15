import type { ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { TabBar } from './components/Layout'
import { useApp } from './store/AppContext'
import Welcome from './screens/Welcome'
import Login from './screens/Login'
import Home from './screens/Home'
import Services from './screens/Services'
import BookService from './screens/BookService'
import BookLocation from './screens/BookLocation'
import BookSchedule from './screens/BookSchedule'
import Payment from './screens/Payment'
import Confirmation from './screens/Confirmation'
import MyBookings from './screens/MyBookings'
import BookingDetail from './screens/BookingDetail'
import Profile from './screens/Profile'
import Admin from './screens/Admin'

/** Routes that keep the bottom tab bar visible. Admin is deliberately not one. */
const TAB_ROUTES = [/^\/home/, /^\/bookings/, /^\/services/, /^\/profile/]

function RequireAuth({ children }: { children: ReactNode }) {
  const { customer } = useApp()
  if (!customer) return <Navigate to="/welcome" replace />
  return <>{children}</>
}

/**
 * On a phone the app fills the screen. On a laptop it sits inside a device frame,
 * so the demo reads as a mobile app when shown on a bigger display.
 */
function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full justify-center bg-black lg:items-center lg:bg-[#08070A] lg:py-8">
      <div
        className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-ink-950
                   lg:h-[860px] lg:w-[400px] lg:rounded-[46px] lg:border-[10px] lg:border-[#1A1717]
                   lg:shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
      >
        {children}
      </div>
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const showTabs = TAB_ROUTES.some((re) => re.test(location.pathname))

  const guarded = (el: ReactNode) => <RequireAuth>{el}</RequireAuth>

  return (
    <DeviceFrame>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />

        <Route path="/home" element={guarded(<Home />)} />
        <Route path="/services" element={guarded(<Services />)} />

        <Route path="/book/service" element={guarded(<BookService />)} />
        <Route path="/book/location" element={guarded(<BookLocation />)} />
        <Route path="/book/time" element={guarded(<BookSchedule />)} />
        <Route path="/book/payment" element={guarded(<Payment />)} />
        <Route path="/booking-confirmed/:id" element={guarded(<Confirmation />)} />

        <Route path="/bookings" element={guarded(<MyBookings />)} />
        <Route path="/bookings/:id" element={guarded(<BookingDetail />)} />

        <Route path="/profile" element={guarded(<Profile />)} />
        <Route path="/admin" element={guarded(<Admin />)} />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>

      {showTabs && <TabBar />}
    </DeviceFrame>
  )
}
