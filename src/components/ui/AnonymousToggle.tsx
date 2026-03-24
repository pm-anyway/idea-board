'use client'

interface AnonymousToggleProps {
  isAnonymous: boolean
  onChange: (value: boolean) => void
}

export function AnonymousToggle({ isAnonymous, onChange }: AnonymousToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none group">
      <div className="relative">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
          isAnonymous ? 'bg-[#6366f1]' : 'bg-slate-200 group-hover:bg-slate-300'
        }`}>
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            isAnonymous ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`} />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700">익명으로 작성</p>
        <p className="text-xs text-slate-400">활성화하면 작성자가 &apos;익명&apos;으로 표시됩니다</p>
      </div>
    </label>
  )
}
