interface DashboardSectionProps {
  title: string
  children: React.ReactNode
}

export function DashboardSection({ title, children }: DashboardSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">{title}</h2>
      {children}
    </div>
  )
}
