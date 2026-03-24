'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { Post } from '@/types/database'

const categoryLabels: Record<string, { label: string; color: string }> = {
  general: { label: '일반', color: 'bg-slate-100 text-slate-600' },
  announcement: { label: '공지', color: 'bg-red-50 text-red-600' },
  question: { label: '질문', color: 'bg-blue-50 text-blue-600' },
  idea: { label: '아이디어', color: 'bg-amber-50 text-amber-600' },
  feedback: { label: '피드백', color: 'bg-green-50 text-green-600' },
}

export function PostCard({ post }: { post: Post }) {
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ko,
  })

  const cat = categoryLabels[post.category] || categoryLabels.general
  const displayName = post.is_anonymous
    ? '익명'
    : post.author?.full_name || post.author?.email?.split('@')[0] || '알 수 없음'

  return (
    <Link href={`/posts/${post.id}`}>
      <article className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-200 group">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            {/* 카테고리 + 제목 */}
            <div className="flex items-center gap-2 mb-1.5">
              {post.category !== 'general' && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${cat.color}`}>
                  {cat.label}
                </span>
              )}
              <h2 className="text-[15px] font-semibold text-slate-800 group-hover:text-[#6366f1] transition-colors line-clamp-1">
                {post.title}
              </h2>
            </div>

            {/* 내용 미리보기 */}
            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
              {post.content}
            </p>

            {/* 메타 정보 */}
            <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                {post.is_anonymous ? (
                  <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : post.author?.avatar_url ? (
                  <img src={post.author.avatar_url} alt="" className="w-5 h-5 rounded-full" />
                ) : (
                  <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-[#6366f1] text-[10px] font-bold">
                    {displayName.charAt(0)}
                  </div>
                )}
                <span className="font-medium text-slate-500">{displayName}</span>
              </div>

              <span className="text-slate-300">·</span>
              <span>{timeAgo}</span>

              <div className="ml-auto flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <svg className={`w-3.5 h-3.5 ${post.user_liked ? 'text-red-500 fill-red-500' : ''}`} fill={post.user_liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {post.like_count}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {post.comment_count}
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
