import { useCallback, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Post, SortType } from '@/types/database'

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)

  const fetchPosts = useCallback(async (sort: SortType = 'latest', page = 1, pageSize = 20) => {
    setLoading(true)
    const supabase = createClient()

    let orderCol: string
    switch (sort) {
      case 'most_likes': orderCol = 'like_count'; break
      case 'most_comments': orderCol = 'comment_count'; break
      default: orderCol = 'created_at'
    }

    const { data } = await supabase
      .from('posts')
      .select('*, author:profiles!posts_author_id_fkey(id, full_name, avatar_url, email)')
      .order(orderCol, { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    setPosts(data || [])
    setLoading(false)
  }, [])

  return { posts, loading, fetchPosts }
}
