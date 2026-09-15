import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import StatusBar from '../components/StatusBar'
import { EmptyState, NavBar, Photo, Screen } from '../components/Layout'
import { ChevronRight, Droplet, Sparkle } from '../components/Icons'
import { useApp } from '../store/AppContext'
import { imageFor } from '../data/images'
import { aed } from '../lib/format'

type Filter = 'all' | 'wash' | 'detailing' | 'addons'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'wash', label: 'Wash' },
  { key: 'detailing', label: 'Detailing' },
  { key: 'addons', label: 'Add-ons' },
]

export default function Services() {
  const { services, addOns, setDraft } = useApp()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('all')

  const visible = filter === 'addons' ? [] : services.filter((s) => filter === 'all' || s.category === filter)
  const showAddOns = (filter === 'all' || filter === 'addons') && addOns.length > 0
  const nothingToShow = visible.length === 0 && !showAddOns

  function choose(serviceId: string) {
    // Keep the vehicle and address the customer already entered, but drop any
    // chosen time (a longer service may no longer fit it) and any abandoned
    // reschedule, which would otherwise move an existing booking instead of
    // creating a new one.
    setDraft({ serviceId, time: undefined, rescheduleId: undefined })
    navigate('/book/service')
  }

  return (
    <>
      <StatusBar />
      <NavBar
        title="Our Services"
        accentTitle
        right={<Logo variant="lockup" width={118} flat />}
      />
      <Screen withTabBar>
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`chip ${filter === f.key ? 'chip-on' : 'chip-off'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {nothingToShow && (
          <EmptyState
            icon={<Droplet className="h-7 w-7" />}
            title="Nothing here yet"
            body={
              filter === 'all' || filter === 'addons'
                ? 'No services are set up yet. Add them under Admin → Services.'
                : `No ${filter} services right now. Try another category.`
            }
          />
        )}

        <div className="space-y-2.5 px-5 pt-4">
          {visible.map((s) => (
            <button
              key={s.id}
              onClick={() => choose(s.id)}
              className="card flex w-full items-center gap-3.5 p-3 text-left transition active:scale-[0.99]"
            >
              <Photo src={imageFor(s.image)} className="h-[64px] w-[80px] shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-semibold leading-tight text-white">
                    {s.name}
                  </span>
                  {s.popular && (
                    <Sparkle className="h-3.5 w-3.5 shrink-0 text-blush-400" />
                  )}
                </div>
                <div className="mt-1 text-[12.5px] leading-snug text-white/40">{s.description}</div>
                <div className="mt-1.5 text-[13px] font-semibold text-blush-400">
                  From {aed(s.price)}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-white/25" />
            </button>
          ))}

          {showAddOns && (
            <div className="card overflow-hidden">
              <div className="flex items-center gap-3.5 p-3">
                <Photo src={imageFor('addons')} className="h-[64px] w-[80px] shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-semibold text-white">Add-ons</div>
                  <div className="mt-1 text-[12.5px] text-white/40">Enhance your service</div>
                  {addOns.length > 0 && (
                    <div className="mt-1.5 text-[13px] font-semibold text-blush-400">
                      From {aed(Math.min(...addOns.map((a) => a.price)))}
                    </div>
                  )}
                </div>
              </div>
              <ul className="divide-y divide-ink-700/50 border-t border-ink-700/50">
                {addOns.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between px-4 py-2.5 text-[13.5px]"
                  >
                    <span className="text-white/70">{a.name}</span>
                    <span className="font-medium text-white/50">{aed(a.price)}</span>
                  </li>
                ))}
              </ul>
              <p className="px-4 py-3 text-[12px] text-white/35">
                Add these to any service at the first booking step.
              </p>
            </div>
          )}
        </div>

        <div className="h-4" />
      </Screen>
    </>
  )
}
