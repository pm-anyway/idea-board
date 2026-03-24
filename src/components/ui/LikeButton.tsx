'use client'

import { useState } from 'react'
import { toggleLike } from '@/app/actions'
import { useRouter } from 'next/navigation'

interface LikeButtonProps {
  targetId: string
  targetType: 'post' | 'comment'
  initialCount: number
  initialLiked: boolean
  userId: string
  size?: 'sm' | 'md'
}

export function LikeButton({ targetId, targetType, initialCount, initialLiked, userId: _userId, size = 'md' }: LikeButtonProps) {
  const [count, setCount] = useState(initialCount)
  const [liked, setLiked] = useState(initialLiked)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    if (loading) return
    setLoading(true)

    setLiked(!liked)
    setCount(prev => liked ? Math.max(prev - 1, 0) : prev + 1)

    const result = await toggleLike(targetId, targetType, liked)
    if (result?.error) {
      setLiked(liked)
      setCount(initialCount)
    }

    router.refresh()
    setLoading(false)
  }

  const sm = size === 'sm'

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-full border transition-all duration-200 ${
        liked
          ? 'bg-red-50 border-red-200 text-red-500'
          : 'bg-white border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-400 hover:bg-red-50/50'
      } ${sm ? 'px-2.5 py-1 text-xs' : 'px-5 py-2.5 text-sm'} disabled:opacity-50`}
    >
      <svg
        className={sm ? 'w-3.5 h-3.5' : 'w-5 h-5'}
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <span className="font-semibold">{count}</span>
    </button>
  )
}
