import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Logo from '../components/Logo'
import StatusBar from '../components/StatusBar'
import { NavBar } from '../components/Layout'
import { useApp } from '../store/AppContext'

export default function Login() {
  const { signIn } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [mode, setMode] = useState<'signup' | 'login'>(
    params.get('mode') === 'login' ? 'login' : 'signup',
  )
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const digits = phone.replace(/\D/g, '')
  const phoneValid = digits.length >= 8
  const valid = mode === 'login' ? phoneValid : name.trim().length >= 2 && phoneValid

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) {
      setError(mode === 'login' ? 'Enter your phone number' : 'Enter your name and phone number')
      return
    }
    signIn({
      name: mode === 'login' ? name.trim() || 'Guest' : name.trim(),
      phone: `+971 ${phone.replace(/^(\+?971)?\s*/, '').trim()}`,
      email: email.trim() || undefined,
    })
    navigate('/home', { replace: true })
  }

  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <NavBar back={() => navigate('/welcome')} />

      <div className="no-scrollbar flex-1 overflow-y-auto px-6 pb-8">
        <Logo compact />

        <h1 className="mt-8 text-[27px] font-bold leading-tight tracking-tight text-white">
          {mode === 'signup' ? (
            <>
              Create your <span className="text-blush-400">account</span>
            </>
          ) : (
            <>
              Welcome <span className="text-blush-400">back</span>
            </>
          )}
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-white/45">
          We come to you — home, office or valet. Book in under a minute.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="label" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                className="field"
                placeholder="e.g. Mohammed Al Suwaidi"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError('')
                }}
              />
            </div>
          )}

          <div>
            <label className="label" htmlFor="phone">
              Phone number
            </label>
            <div className="flex items-stretch gap-2">
              <div className="flex items-center rounded-xl border border-ink-700 bg-ink-800 px-3.5 text-[16px] text-white/60">
                🇦🇪 +971
              </div>
              <input
                id="phone"
                className="field flex-1"
                placeholder="50 123 4567"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  setError('')
                }}
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="label" htmlFor="email">
                Email <span className="font-normal opacity-60">(optional)</span>
              </label>
              <input
                id="email"
                className="field"
                placeholder="you@example.com"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          {error && <p className="text-[13.5px] text-rose-400">{error}</p>}

          <button type="submit" className="btn-primary !mt-7" disabled={!valid}>
            {mode === 'signup' ? 'Create account' : 'Log in'}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'signup' ? 'login' : 'signup')
            setError('')
          }}
          className="mt-5 w-full py-2 text-center text-[14px] text-white/45 transition active:opacity-60"
        >
          {mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <span className="font-semibold text-blush-400">Log in</span>
            </>
          ) : (
            <>
              New here? <span className="font-semibold text-blush-400">Create an account</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
