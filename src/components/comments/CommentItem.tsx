'use client'

import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { deleteComment } from '@/app/actions'
import { LikeButton } from '@/components/ui/LikeButton'
import { useRouter } from 'next/navigation'
import type { Comment } from '@/types/database'

interface Props {
  comment: Comment
  userId: string
}

export function CommentItem({ comment, userId }: Props) {
  const router = useRouter()
  const isAuthor = comment.author_id === userId

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: ko,
  })

  const displayName = comment.is_anonymous
    ? '익명'
    : comment.author?.full_name || comment.author?.email?.split('@')[0] || '알 수 없음'

  const handleDelete = async () => {
    await deleteComment(comment.id)
    router.refresh()
  }

  return (
    <div className="px-6 py-4 group hover:bg-slate-50/50 transition-colors">
      <div className="flex items-start gap-3">
        {comment.is_anonymous ? (
          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        ) : comment.author?.avatar_url ? (
          <img src={comment.author.avatar_url} alt="" className="w-8 h-8 rounded-full shrink-0" />
        ) : (
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-[#6366f1] text-sm font-bold shrink-0">
            {displayName.charAt(0)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-slate-700">{displayName}</span>
            <span className="text-xs text-slate-400">{timeAgo}</span>
          </div>
          <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
          <div className="flex items-center gap-3 mt-2">
            <LikeButton
              targetId={comment.id}
              targetType="comment"
              initialCount={comment.like_count}
              initialLiked={comment.user_liked ?? false}
              userId={userId}
              size="sm"
            />
            {isAuthor && (
              <button
                onClick={handleDelete}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                삭제
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
