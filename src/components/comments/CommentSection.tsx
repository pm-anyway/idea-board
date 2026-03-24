'use client'

import { CommentItem } from './CommentItem'
import { CommentForm } from './CommentForm'
import type { Comment } from '@/types/database'

interface Props {
  postId: string
  comments: Comment[]
  userId: string
}

export function CommentSection({ postId, comments, userId }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-700">
          댓글 <span className="text-[#6366f1] ml-1">{comments.length}</span>
        </h2>
      </div>

      <div className="divide-y divide-slate-50">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">첫 번째 댓글을 작성해보세요!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} userId={userId} />
          ))
        )}
      </div>

      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30">
        <CommentForm postId={postId} userId={userId} />
      </div>
    </div>
  )
}
