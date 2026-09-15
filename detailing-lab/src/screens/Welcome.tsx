import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import StatusBar from '../components/StatusBar'
import { IMAGES } from '../data/images'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="relative flex h-full flex-col">
      <img
        src={IMAGES.welcome}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/75 via-ink-950/40 to-ink-950" />

      <StatusBar />

      <div className="relative flex flex-1 flex-col items-center px-7">
        <div className="mt-8">
          <Logo variant="crest" width={300} />
        </div>

        <div className="mt-auto w-full pb-8 text-center">
          <p className="text-[12px] font-medium uppercase leading-[2] tracking-[0.38em] text-white/70">
            Premium Care
            <br />
            At Your Doorstep
          </p>

          <button className="btn-primary mt-7" onClick={() => navigate('/login?mode=signup')}>
            Get Started
          </button>

          <button
            onClick={() => navigate('/login?mode=login')}
            className="mt-5 w-full text-[13px] text-white/45 transition active:opacity-60"
          >
            Already have an account?{' '}
            <span className="font-semibold text-white">Log In</span>
          </button>
        </div>
      </div>
    </div>
  )
}
