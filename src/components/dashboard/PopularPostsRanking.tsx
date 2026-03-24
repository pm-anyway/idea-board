import Link from 'next/link'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PopularPostsRanking({ posts }: { posts: any[] }) {
  if (posts.length === 0) {
    return <p className="text-sm text-slate-400">게시글이 없습니다.</p>
  }

  return (
    <div className="space-y-2 max-h-80 overflow-y-auto">
      {posts.map((post, i) => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">{post.title}</p>
            <p className="text-xs text-slate-400">
              {post.is_anonymous ? '익명' : (post.author?.[0]?.full_name || post.author?.full_name || '알 수 없음')}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>❤️ {post.like_count}</span>
            <span>💬 {post.comment_count}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
