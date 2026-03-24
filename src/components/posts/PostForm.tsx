'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPost, updatePost } from '@/app/actions'
import { AnonymousToggle } from '@/components/ui/AnonymousToggle'

interface PostFormProps {
  userId: string
  postId?: string
  initialTitle?: string
  initialContent?: string
  initialIsAnonymous?: boolean
  initialCategory?: string
}

const categories = [
  { value: 'general', label: '일반' },
  { value: 'question', label: '질문' },
  { value: 'idea', label: '아이디어' },
  { value: 'feedback', label: '피드백' },
]

export function PostForm({
  userId: _userId,
  postId,
  initialTitle = '',
  initialContent = '',
  initialIsAnonymous = false,
  initialCategory = 'general',
}: PostFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [category, setCategory] = useState(initialCategory)
  const [isAnonymous, setIsAnonymous] = useState(initialIsAnonymous)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { setError('제목을 입력해주세요.'); return }
    if (!content.trim()) { setError('내용을 입력해주세요.'); return }

    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.set('title', title)
    formData.set('content', content)
    formData.set('category', category)
    formData.set('is_anonymous', String(isAnonymous))

    try {
      if (postId) {
        const result = await updatePost(postId, formData)
        if (result?.error) { setError(result.error); setLoading(false); return }
      } else {
        const result = await createPost(formData)
        if (result?.error) { setError(result.error); setLoading(false); return }
      }
    } catch {
      // redirect() throws NEXT_REDIRECT - this is expected
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">카테고리</label>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-2 text-sm rounded-xl border transition-all ${
                category === cat.value
                  ? 'bg-[#6366f1] text-white border-[#6366f1] shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          maxLength={200}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all"
        />
        <div className="text-right text-xs text-slate-400 mt-1">{title.length}/200</div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          내용 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          rows={12}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all resize-none"
        />
      </div>

      {!postId && <AnonymousToggle isAnonymous={isAnonymous} onChange={setIsAnonymous} />}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-xl hover:shadow-md hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? '저장 중...' : postId ? '수정하기' : '등록하기'}
        </button>
      </div>
    </form>
  )
}
