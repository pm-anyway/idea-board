'use client'

import { useRouter } from 'next/navigation'
import type { SortType } from '@/types/database'

interface PaginationProps {
  currentPage: number
  totalPages: number
  currentSort: SortType
}

export function Pagination({ currentPage, totalPages, currentSort }: PaginationProps) {
  const router = useRouter()

  const goToPage = (page: number) => {
    router.push(`/?sort=${currentSort}&page=${page}`)
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visible = pages.filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)

  return (
    <div className="flex justify-center items-center gap-1.5">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        이전
      </button>

      {visible.map((page, idx) => {
        const prev = visible[idx - 1]
        const showGap = prev && page - prev > 1
        return (
          <span key={page} className="flex items-center gap-1.5">
            {showGap && <span className="px-1 text-slate-300">···</span>}
            <button
              onClick={() => goToPage(page)}
              className={`w-9 h-9 text-sm rounded-xl transition-all ${
                page === currentPage
                  ? 'bg-[#6366f1] text-white font-semibold shadow-sm shadow-indigo-200'
                  : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          </span>
        )
      })}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        다음
      </button>
    </div>
  )
}
