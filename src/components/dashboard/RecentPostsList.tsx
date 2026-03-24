import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RecentPostsList({ posts }: { posts: any[] }) {
  if (posts.length === 0) {
    return <p className="text-sm text-slate-400">게시글이 없습니다.</p>
  }

  return (
    <div className="space-y-2">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">{post.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {post.is_anonymous ? '익명' : (post.author?.[0]?.full_name || post.author?.full_name || '알 수 없음')} · {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ko })}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 ml-4">
            <span>❤️ {post.like_count}</span>
            <span>💬 {post.comment_count}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
