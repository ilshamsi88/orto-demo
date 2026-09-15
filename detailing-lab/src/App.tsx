import type { ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { TabBar } from './components/Layout'
import { useApp } from './store/AppContext'
import Login from './screens/Login'
import Home from './screens/Home'
import BookService from './screens/BookService'
import BookCar from './screens/BookCar'
import BookLocation from './screens/BookLocation'
import BookSchedule from './screens/BookSchedule'
import BookSummary from './screens/BookSummary'
import Payment from './screens/Payment'
import Confirmation from './screens/Confirmation'
import MyBookings from './screens/MyBookings'
import BookingDetail from './screens/BookingDetail'
import Profile from './screens/Profile'
import Admin from './screens/Admin'

/** Routes that keep the bottom tab bar visible. */
const TAB_ROUTES = [/^\/home/, /^\/bookings/, /^\/profile/, /^\/admin/]

function RequireAuth({ children }: { children: ReactNode }) {
  const { customer } = useApp()
  if (!customer) return <Navigate to="/login" replace />
  return <>{children}</>
}

/**
 * On a phone the app fills the screen. On a laptop it sits inside a device frame,
 * so the demo reads as a mobile app when shown on a bigger display.
 */
function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full justify-center bg-black lg:items-center lg:bg-[#0B0C0F] lg:py-8">
      <div
        className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-ink-950
                   lg:h-[860px] lg:w-[400px] lg:rounded-[46px] lg:border-[10px] lg:border-[#1B1C21]
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

  return (
    <DeviceFrame>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />

        <Route
          path="/book/service"
          element={
            <RequireAuth>
              <BookService />
            </RequireAuth>
          }
        />
        <Route
          path="/book/car"
          element={
            <RequireAuth>
              <BookCar />
            </RequireAuth>
          }
        />
        <Route
          path="/book/location"
          element={
            <RequireAuth>
              <BookLocation />
            </RequireAuth>
          }
        />
        <Route
          path="/book/time"
          element={
            <RequireAuth>
              <BookSchedule />
            </RequireAuth>
          }
        />
        <Route
          path="/book/summary"
          element={
            <RequireAuth>
              <BookSummary />
            </RequireAuth>
          }
        />
        <Route
          path="/book/payment"
          element={
            <RequireAuth>
              <Payment />
            </RequireAuth>
          }
        />
        <Route
          path="/booking-confirmed/:id"
          element={
            <RequireAuth>
              <Confirmation />
            </RequireAuth>
          }
        />

        <Route
          path="/bookings"
          element={
            <RequireAuth>
              <MyBookings />
            </RequireAuth>
          }
        />
        <Route
          path="/bookings/:id"
          element={
            <RequireAuth>
              <BookingDetail />
            </RequireAuth>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <Admin />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>

      {showTabs && <TabBar />}
    </DeviceFrame>
  )
}
