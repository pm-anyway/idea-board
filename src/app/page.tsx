import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { PostList } from '@/components/posts/PostList'
import type { SortType } from '@/types/database'

interface HomeProps {
  searchParams: Promise<{ sort?: string; page?: string }>
}

export default async function Home({ searchParams }: HomeProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const params = await searchParams
  const sort = (params.sort as SortType) || 'latest'
  const page = parseInt(params.page || '1', 10)
  const pageSize = 20

  // 정렬 조건
  let orderColumn: string
  switch (sort) {
    case 'most_likes': orderColumn = 'like_count'; break
    case 'most_comments': orderColumn = 'comment_count'; break
    default: orderColumn = 'created_at'
  }

  // 게시글 목록 조회
  const { data: posts, count } = await supabase
    .from('posts')
    .select('*, author:profiles!posts_author_id_fkey(id, full_name, avatar_url, email)', { count: 'exact' })
    .order(orderColumn, { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  // 내가 좋아요한 게시글
  const { data: myLikes } = await supabase
    .from('likes')
    .select('post_id')
    .eq('user_id', user.id)
    .not('post_id', 'is', null)

  const likedPostIds = new Set(myLikes?.map(l => l.post_id) || [])

  const postsWithLike = (posts || []).map(post => ({
    ...post,
    user_liked: likedPostIds.has(post.id),
  }))

  const totalPages = Math.ceil((count || 0) / pageSize)

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <PostList
          posts={postsWithLike}
          currentSort={sort}
          currentPage={page}
          totalPages={totalPages}
          totalCount={count || 0}
        />
      </main>
    </div>
  )
}
