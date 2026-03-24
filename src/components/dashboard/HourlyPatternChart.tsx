'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface HourlyData {
  hour: number
  post_count: number
}

export function HourlyPatternChart({ data }: { data: HourlyData[] }) {
  // 0~23시 전체 채우기
  const full = Array.from({ length: 24 }, (_, i) => {
    const found = data.find((d) => d.hour === i)
    return { hour: `${i}시`, post_count: found ? Number(found.post_count) : 0 }
  })

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={full}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="#94a3b8" interval={1} />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" allowDecimals={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
          <Bar dataKey="post_count" name="게시글" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
