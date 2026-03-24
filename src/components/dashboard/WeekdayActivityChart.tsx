'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface WeekdayData {
  weekday: number
  post_count: number
  comment_count: number
}

const WEEKDAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

export function WeekdayActivityChart({ data }: { data: WeekdayData[] }) {
  // 요일별로 게시글/댓글 합산
  const merged = Array.from({ length: 7 }, (_, i) => {
    const items = data.filter((d) => d.weekday === i)
    return {
      weekday: WEEKDAY_NAMES[i],
      post_count: items.reduce((sum, d) => sum + Number(d.post_count), 0),
      comment_count: items.reduce((sum, d) => sum + Number(d.comment_count), 0),
    }
  })

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={merged}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="weekday" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" allowDecimals={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
          <Legend />
          <Bar dataKey="post_count" name="게시글" fill="#6366f1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="comment_count" name="댓글" fill="#06b6d4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
