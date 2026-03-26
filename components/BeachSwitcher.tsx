'use client'

import type { Beach } from '@/lib/types'

interface BeachSwitcherProps {
  beaches: Beach[]
  selectedId: string
  onSelect: (id: string) => void
}

export function BeachSwitcher({ beaches, selectedId, onSelect }: BeachSwitcherProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
      {beaches.map((beach) => (
        <button
          key={beach.id}
          onClick={() => onSelect(beach.id)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            beach.id === selectedId
              ? 'bg-white text-slate-900'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {beach.shortName}
        </button>
      ))}
    </div>
  )
}
