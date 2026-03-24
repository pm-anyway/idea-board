interface SummaryCardsProps {
  summary: { totalPosts: number; totalComments: number; totalLikes: number; totalUsers: number }
  growth: {
    posts: { recent: number; growth: number }
    comments: { recent: number; growth: number }
    likes: { recent: number; growth: number }
  }
}

function GrowthBadge({ value }: { value: number }) {
  if (value === 0) return <span className="text-xs text-slate-400">변동 없음</span>
  const isPositive = value > 0
  return (
    <span className={`text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
      {isPositive ? '↑' : '↓'} {Math.abs(value)}% (7일)
    </span>
  )
}

export function SummaryCards({ summary, growth }: SummaryCardsProps) {
  const cards = [
    { label: '총 게시글', value: summary.totalPosts, growth: growth.posts.growth, icon: '📝', color: 'from-indigo-500 to-violet-500' },
    { label: '총 댓글', value: summary.totalComments, growth: growth.comments.growth, icon: '💬', color: 'from-blue-500 to-cyan-500' },
    { label: '총 좋아요', value: summary.totalLikes, growth: growth.likes.growth, icon: '❤️', color: 'from-pink-500 to-rose-500' },
    { label: '활성 사용자', value: summary.totalUsers, growth: null, icon: '👥', color: 'from-amber-500 to-orange-500' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">{card.icon}</span>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} opacity-10`} />
          </div>
          <p className="text-2xl font-bold text-slate-800">{card.value.toLocaleString()}</p>
          <p className="text-sm text-slate-500 mt-1">{card.label}</p>
          {card.growth !== null && <GrowthBadge value={card.growth} />}
        </div>
      ))}
    </div>
  )
}
