'use client'

import { PostCard } from './PostCard'
import { SortDropdown } from './SortDropdown'
import { Pagination } from '@/components/ui/Pagination'
import type { Post, SortType } from '@/types/database'

interface PostListProps {
  posts: Post[]
  currentSort: SortType
  currentPage: number
  totalPages: number
  totalCount: number
}

export function PostList({ posts, currentSort, currentPage, totalPages, totalCount }: PostListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">전체 게시글</h1>
          <p className="text-sm text-slate-400 mt-1">
            총 <span className="font-medium text-[#6366f1]">{totalCount.toLocaleString()}</span>개
          </p>
        </div>
        <SortDropdown currentSort={currentSort} />
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-slate-500 text-lg font-medium">아직 게시글이 없습니다</p>
          <p className="text-slate-400 text-sm mt-1">첫 번째 게시글을 작성해보세요!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} currentSort={currentSort} />
        </div>
      )}
    </div>
  )
}
