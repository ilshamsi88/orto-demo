import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomBar, NavBar, Screen } from '../components/Layout'
import BookingSteps from '../components/BookingSteps'
import { Check, ChevronRight, Clock, Sparkle } from '../components/Icons'
import { useApp } from '../store/AppContext'
import { aed, duration } from '../lib/format'

export default function BookService() {
  const { services, draft, setDraft } = useApp()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState<string | null>(null)

  const active = services.filter((s) => !s.archived)
  const selected = draft.serviceId

  return (
    <>
      <NavBar title="Choose a Service" back />
      <BookingSteps current={0} />
      <Screen className="px-5">
        <p className="pb-4 pt-1 text-[14px] leading-relaxed text-white/45">
          Prices shown are for a sedan. Larger vehicles have a small size supplement, added at the
          summary step.
        </p>

        <div className="space-y-3 pb-6">
          {active.map((s) => {
            const isSelected = selected === s.id
            const isOpen = expanded === s.id
            return (
              <div
                key={s.id}
                className={`overflow-hidden rounded-2xl border transition ${
                  isSelected
                    ? 'border-aqua-500/60 bg-aqua-500/[0.07] shadow-glow'
                    : 'border-ink-700/70 bg-ink-850'
                }`}
              >
                <button
                  onClick={() => setDraft({ serviceId: s.id })}
                  className="flex w-full items-start gap-3.5 p-4 text-left"
                >
                  <span
                    className={`mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 transition ${
                      isSelected ? 'border-aqua-400 bg-aqua-400' : 'border-ink-600'
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 text-ink-950" strokeWidth={3.2} />}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[16px] font-semibold text-white">{s.name}</span>
                      {s.popular && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-aqua-500/25 bg-aqua-500/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-aqua-400">
                          <Sparkle className="h-2.5 w-2.5" />
                          Most booked
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/50">
                      {s.description}
                    </p>
                    <div className="mt-2.5 flex items-center gap-3">
                      <span className="text-[17px] font-bold text-white">{aed(s.price)}</span>
                      <span className="inline-flex items-center gap-1.5 text-[12.5px] text-white/40">
                        <Clock className="h-3.5 w-3.5" />
                        {duration(s.durationMins)}
                      </span>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setExpanded(isOpen ? null : s.id)}
                  className="flex w-full items-center justify-between border-t border-ink-700/60 px-4 py-3 text-left"
                >
                  <span className="text-[13px] font-semibold text-aqua-400">
                    {isOpen ? "Hide what's included" : "What's included"}
                  </span>
                  <ChevronRight
                    className={`h-4 w-4 text-aqua-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                  />
                </button>

                {isOpen && (
                  <ul className="space-y-2 border-t border-ink-700/60 px-4 py-3.5">
                    {s.includes.map((line) => (
                      <li key={line} className="flex items-start gap-2.5 text-[13.5px] text-white/65">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" strokeWidth={2.4} />
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
        <div className="h-24" />
      </Screen>

      <BottomBar>
        <button
          className="btn-primary"
          disabled={!selected}
          onClick={() => navigate('/book/car')}
        >
          Continue
        </button>
      </BottomBar>
    </>
  )
}
