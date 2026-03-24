'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface AnonymousRatioPieProps {
  anonymous: number
  named: number
}

const COLORS = ['#6366f1', '#e2e8f0']

export function AnonymousRatioPie({ anonymous, named }: AnonymousRatioPieProps) {
  const total = anonymous + named
  if (total === 0) {
    return <p className="text-sm text-slate-400 text-center py-8">데이터가 없습니다.</p>
  }

  const data = [
    { name: '실명', value: named },
    { name: '익명', value: anonymous },
  ]

  return (
    <div className="h-64 flex items-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            dataKey="value"
            label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
