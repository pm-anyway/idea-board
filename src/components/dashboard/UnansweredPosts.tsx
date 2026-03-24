'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function UnansweredPosts({ noComment, oldUnanswered }: { noComment: any[]; oldUnanswered: any[] }) {
  const [tab, setTab] = useState<'noComment' | 'old'>('noComment')
  const posts = tab === 'noComment' ? noComment : oldUnanswered

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('noComment')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${tab === 'noComment' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          댓글 없는 게시글 ({noComment.length})
        </button>
        <button
          onClick={() => setTab('old')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${tab === 'old' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          7일 이상 미응답 ({oldUnanswered.length})
        </button>
      </div>
      {posts.length === 0 ? (
        <p className="text-sm text-slate-400 py-4 text-center">해당 게시글이 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{post.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {post.is_anonymous ? '익명' : (post.author?.[0]?.full_name || post.author?.full_name || '알 수 없음')}
                </p>
              </div>
              <span className="text-xs text-slate-400 ml-4">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ko })}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
