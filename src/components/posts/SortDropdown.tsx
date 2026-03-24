'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { SortType } from '@/types/database'

const sortOptions: { value: SortType; label: string }[] = [
  { value: 'latest', label: '최신순' },
  { value: 'most_comments', label: '댓글 많은 순' },
  { value: 'most_likes', label: '좋아요 많은 순' },
]

export function SortDropdown({ currentSort }: { currentSort: SortType }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (value: SortType) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    params.delete('page')
    router.push(`/?${params.toString()}`)
  }

  return (
    <select
      value={currentSort}
      onChange={(e) => handleChange(e.target.value as SortType)}
      className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] cursor-pointer hover:border-slate-300 transition-colors appearance-none pr-8 bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20width%3d%2212%22%20height%3d%2212%22%20viewBox%3d%220%200%2012%2012%22%3e%3cpath%20fill%3d%22%2364748b%22%20d%3d%22M2%204l4%204%204-4%22%2f%3e%3c%2fsvg%3e')] bg-no-repeat bg-[center_right_0.5rem]"
    >
      {sortOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}
