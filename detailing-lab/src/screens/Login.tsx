import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { useApp } from '../store/AppContext'
import { Sparkle } from '../components/Icons'

/** Phone-first sign-in: no passwords, matching how the shop already talks to customers. */
export default function Login() {
  const { signIn } = useApp()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'signup' | 'login'>('signup')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
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
    })
    navigate('/home', { replace: true })
  }

  return (
    <div
      className="no-scrollbar relative flex-1 overflow-y-auto"
      style={{ paddingTop: 'var(--safe-top)', paddingBottom: 'var(--safe-bottom)' }}
    >
      {/* Ambient brand glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(120%_70%_at_50%_0%,rgba(34,211,238,0.16),transparent_70%)]" />

      <div className="relative flex min-h-full flex-col px-6 pb-8 pt-14">
        <Logo size="lg" />

        <div className="mt-11">
          <h1 className="text-[30px] font-bold leading-[1.15] tracking-tight text-white">
            {mode === 'signup' ? (
              <>
                A spotless car,
                <br />
                <span className="text-white/45">without leaving the house.</span>
              </>
            ) : (
              <>
                Welcome back.
                <br />
                <span className="text-white/45">Let's get you booked.</span>
              </>
            )}
          </h1>
          <p className="mt-3.5 text-[15px] leading-relaxed text-white/45">
            We come to you — home, office or valet. Book in under a minute.
          </p>
        </div>

        <form onSubmit={submit} className="mt-9 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="label" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                className="field"
                placeholder="e.g. Ahmed Al Mansoori"
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

          {error && <p className="text-[13.5px] text-rose-400">{error}</p>}

          <button type="submit" className="btn-primary !mt-6" disabled={!valid}>
            {mode === 'signup' ? 'Create account' : 'Log in'}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'signup' ? 'login' : 'signup')
            setError('')
          }}
          className="mt-5 py-2 text-center text-[14.5px] text-white/50 transition active:opacity-60"
        >
          {mode === 'signup' ? (
            <>
              Already have an account? <span className="font-semibold text-aqua-400">Log in</span>
            </>
          ) : (
            <>
              New here? <span className="font-semibold text-aqua-400">Create an account</span>
            </>
          )}
        </button>

        <div className="mt-auto pt-10">
          <div className="flex items-center justify-center gap-2 text-[12.5px] text-white/30">
            <Sparkle className="h-4 w-4" />
            Trusted by 1,200+ drivers across Dubai
          </div>
        </div>
      </div>
    </div>
  )
}
