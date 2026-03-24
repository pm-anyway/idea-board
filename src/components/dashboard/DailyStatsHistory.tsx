'use client'

import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface DailyStats {
  date: string
  total_posts: number
  total_comments: number
  total_likes: number
  total_users: number
  new_posts: number
  new_comments: number
  new_likes: number
  new_users: number
  dau: number
}

type ViewMode = 'cumulative' | 'daily' | 'dau'

export function DailyStatsHistory({ data }: { data: DailyStats[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>('daily')

  if (data.length === 0) {
    return (
      <p className="text-sm text-slate-400 text-center py-8">
        아직 수집된 데이터가 없습니다. 내일부터 자동으로 기록됩니다.
      </p>
    )
  }

  const formatted = data.map((d) => ({
    ...d,
    date: d.date.slice(5), // MM-DD
  }))

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {[
          { key: 'daily' as ViewMode, label: '일별 신규' },
          { key: 'cumulative' as ViewMode, label: '누적 추이' },
          { key: 'dau' as ViewMode, label: 'DAU' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setViewMode(tab.key)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${viewMode === tab.key ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'cumulative' ? (
            <AreaChart data={formatted}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Legend />
              <Area type="monotone" dataKey="total_posts" name="총 게시글" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="total_comments" name="총 댓글" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="total_users" name="총 사용자" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          ) : viewMode === 'dau' ? (
            <AreaChart data={formatted}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Area type="monotone" dataKey="dau" name="DAU" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          ) : (
            <AreaChart data={formatted}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Legend />
              <Area type="monotone" dataKey="new_posts" name="신규 게시글" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="new_comments" name="신규 댓글" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="new_users" name="신규 사용자" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
