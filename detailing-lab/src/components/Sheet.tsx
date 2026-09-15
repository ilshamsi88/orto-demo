import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { X } from './Icons'

/** iOS-style bottom sheet: tap the backdrop or the close button to dismiss. */
export default function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="absolute inset-0 z-[60]">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/60 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-label={title}
        className="animate-sheet absolute inset-x-0 bottom-0 max-h-[78%] overflow-y-auto rounded-t-3xl border-t border-ink-700 bg-ink-900"
        style={{ paddingBottom: 'calc(20px + var(--safe-bottom))' }}
      >
        <div className="sticky top-0 z-10 bg-ink-900/95 pt-2.5 backdrop-blur">
          <div className="mx-auto h-1 w-10 rounded-full bg-white/20" />
          <div className="flex items-center justify-between px-5 py-3.5">
            <h2 className="text-[17px] font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-800 text-white/60 active:opacity-60"
            >
              <X className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
        <div className="px-5">{children}</div>
      </div>
    </div>
  )
}
