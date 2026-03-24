'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createComment } from '@/app/actions'
import { AnonymousToggle } from '@/components/ui/AnonymousToggle'

interface Props {
  postId: string
  userId: string
}

export function CommentForm({ postId, userId: _userId }: Props) {
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || loading) return

    setLoading(true)
    await createComment(postId, content.trim(), isAnonymous)
    setContent('')
    setIsAnonymous(false)
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요..."
        rows={3}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all resize-none"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
      />
      <div className="flex items-center justify-between">
        <AnonymousToggle isAnonymous={isAnonymous} onChange={setIsAnonymous} />
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Ctrl+Enter로 등록</span>
          <button
            type="submit"
            disabled={!content.trim() || loading}
            className="px-5 py-2 bg-[#6366f1] text-white text-sm font-medium rounded-xl hover:bg-[#4f46e5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '등록 중...' : '등록'}
          </button>
        </div>
      </div>
    </form>
  )
}
