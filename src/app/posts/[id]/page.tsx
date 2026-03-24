import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { LikeButton } from '@/components/ui/LikeButton'
import { CommentSection } from '@/components/comments/CommentSection'
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

const categoryLabels: Record<string, { label: string; color: string }> = {
  general: { label: '일반', color: 'bg-slate-100 text-slate-600' },
  announcement: { label: '공지', color: 'bg-red-50 text-red-600' },
  question: { label: '질문', color: 'bg-blue-50 text-blue-600' },
  idea: { label: '아이디어', color: 'bg-amber-50 text-amber-600' },
  feedback: { label: '피드백', color: 'bg-green-50 text-green-600' },
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function PostDetail({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: post } = await supabase
    .from('posts')
    .select('*, author:profiles!posts_author_id_fkey(id, full_name, avatar_url, email)')
    .eq('id', id)
    .single()

  if (!post) notFound()

  // 조회수 증가
  await supabase.from('posts').update({ view_count: post.view_count + 1 }).eq('id', id)

  // 댓글 조회
  const { data: comments } = await supabase
    .from('comments')
    .select('*, author:profiles!comments_author_id_fkey(id, full_name, avatar_url, email)')
    .eq('post_id', id)
    .order('created_at', { ascending: true })

  // 내 좋아요 상태
  const { data: myPostLike } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', id)
    .maybeSingle()

  const { data: myCommentLikes } = await supabase
    .from('likes')
    .select('comment_id')
    .eq('user_id', user.id)
    .not('comment_id', 'is', null)

  const likedCommentIds = new Set(myCommentLikes?.map(l => l.comment_id) || [])
  const commentsWithLike = (comments || []).map(c => ({
    ...c,
    user_liked: likedCommentIds.has(c.id),
  }))

  const isAuthor = user.id === post.author_id
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ko })
  const cat = categoryLabels[post.category] || categoryLabels.general
  const displayName = post.is_anonymous
    ? '익명'
    : post.author?.full_name || post.author?.email?.split('@')[0] || '알 수 없음'

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* 게시글 본문 */}
        <article className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8">
            {/* 헤더 */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {post.category !== 'general' && (
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${cat.color}`}>
                      {cat.label}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-slate-800 leading-tight">{post.title}</h1>
              </div>
              {isAuthor && (
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`/posts/${id}/edit`}
                    className="text-xs text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    수정
                  </a>
                  <DeleteConfirmModal postId={id} userId={user.id} />
                </div>
              )}
            </div>

            {/* 작성자 */}
            <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
              {post.is_anonymous ? (
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : post.author?.avatar_url ? (
                <img src={post.author.avatar_url} alt="" className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center text-[#6366f1] font-bold">
                  {displayName.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-slate-700">{displayName}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{timeAgo}</span>
                  <span>·</span>
                  <span>조회 {post.view_count + 1}</span>
                </div>
              </div>
            </div>

            {/* 본문 */}
            <div className="py-8">
              <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-[15px]">{post.content}</div>
            </div>

            {/* 좋아요 */}
            <div className="flex justify-center pt-6 border-t border-slate-100">
              <LikeButton
                targetId={id}
                targetType="post"
                initialCount={post.like_count}
                initialLiked={!!myPostLike}
                userId={user.id}
              />
            </div>
          </div>
        </article>

        {/* 댓글 */}
        <div className="mt-6">
          <CommentSection postId={id} comments={commentsWithLike} userId={user.id} />
        </div>

        {/* 목록으로 */}
        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-slate-500 hover:text-[#6366f1] transition-colors">
            ← 목록으로 돌아가기
          </a>
        </div>
      </main>
    </div>
  )
}
