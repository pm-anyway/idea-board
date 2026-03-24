import { createClient } from '@/lib/supabase/server'
import { subDays } from 'date-fns'

// 요약 통계
export async function getSummaryStats() {
  const supabase = await createClient()

  const [posts, comments, likes, users] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('comments').select('*', { count: 'exact', head: true }),
    supabase.from('likes').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ])

  return {
    totalPosts: posts.count || 0,
    totalComments: comments.count || 0,
    totalLikes: likes.count || 0,
    totalUsers: users.count || 0,
  }
}

// 성장률 (최근 7일 vs 이전 7일)
export async function getGrowthStats() {
  const supabase = await createClient()
  const now = new Date()
  const sevenDaysAgo = subDays(now, 7).toISOString()
  const fourteenDaysAgo = subDays(now, 14).toISOString()

  const [recentPosts, prevPosts, recentComments, prevComments, recentLikes, prevLikes] =
    await Promise.all([
      supabase.from('posts').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
      supabase.from('posts').select('*', { count: 'exact', head: true }).gte('created_at', fourteenDaysAgo).lt('created_at', sevenDaysAgo),
      supabase.from('comments').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
      supabase.from('comments').select('*', { count: 'exact', head: true }).gte('created_at', fourteenDaysAgo).lt('created_at', sevenDaysAgo),
      supabase.from('likes').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
      supabase.from('likes').select('*', { count: 'exact', head: true }).gte('created_at', fourteenDaysAgo).lt('created_at', sevenDaysAgo),
    ])

  const calcGrowth = (recent: number, prev: number) => {
    if (prev === 0) return recent > 0 ? 100 : 0
    return Math.round(((recent - prev) / prev) * 100)
  }

  return {
    posts: { recent: recentPosts.count || 0, prev: prevPosts.count || 0, growth: calcGrowth(recentPosts.count || 0, prevPosts.count || 0) },
    comments: { recent: recentComments.count || 0, prev: prevComments.count || 0, growth: calcGrowth(recentComments.count || 0, prevComments.count || 0) },
    likes: { recent: recentLikes.count || 0, prev: prevLikes.count || 0, growth: calcGrowth(recentLikes.count || 0, prevLikes.count || 0) },
  }
}

// 익명 vs 실명 비율
export async function getAnonymousRatio() {
  const supabase = await createClient()

  const [anon, named] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('is_anonymous', true),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('is_anonymous', false),
  ])

  return { anonymous: anon.count || 0, named: named.count || 0 }
}

// 인기 게시글 TOP 10
export async function getPopularPosts() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('posts')
    .select('id, title, like_count, comment_count, view_count, is_anonymous, created_at, author:profiles!posts_author_id_fkey(full_name)')
    .order('like_count', { ascending: false })
    .limit(10)

  return data || []
}

// 최근 게시글
export async function getRecentPosts() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('posts')
    .select('id, title, like_count, comment_count, is_anonymous, created_at, author:profiles!posts_author_id_fkey(full_name)')
    .order('created_at', { ascending: false })
    .limit(10)

  return data || []
}

// 댓글 없는 게시글
export async function getUnansweredPosts() {
  const supabase = await createClient()

  const [noComment, oldUnanswered] = await Promise.all([
    supabase
      .from('posts')
      .select('id, title, created_at, is_anonymous, author:profiles!posts_author_id_fkey(full_name)')
      .eq('comment_count', 0)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('posts')
      .select('id, title, created_at, is_anonymous, author:profiles!posts_author_id_fkey(full_name)')
      .eq('comment_count', 0)
      .lt('created_at', subDays(new Date(), 7).toISOString())
      .order('created_at', { ascending: true })
      .limit(10),
  ])

  return { noComment: noComment.data || [], oldUnanswered: oldUnanswered.data || [] }
}

// RPC 기반 쿼리들
export async function getTopCommenters() {
  const supabase = await createClient()
  const { data } = await supabase.rpc('top_commenters', { limit_count: 5 })
  return data || []
}

export async function getTopLikedUsers() {
  const supabase = await createClient()
  const { data } = await supabase.rpc('top_liked_users', { limit_count: 5 })
  return data || []
}

export async function getPostsByHour() {
  const supabase = await createClient()
  const { data } = await supabase.rpc('posts_by_hour')
  return data || []
}

export async function getActivityByWeekday() {
  const supabase = await createClient()
  const { data } = await supabase.rpc('activity_by_weekday')
  return data || []
}

export async function getPostsByMonth() {
  const supabase = await createClient()
  const { data } = await supabase.rpc('posts_by_month')
  return data || []
}

export async function getDailyTrend() {
  const supabase = await createClient()
  const { data } = await supabase.rpc('daily_trend', { days: 30 })
  return data || []
}

// 일별 스냅샷 히스토리
export async function getDailyStatsHistory() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('daily_stats')
    .select('*')
    .order('date', { ascending: true })
    .limit(90)
  return data || []
}
