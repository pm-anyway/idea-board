interface TopUser {
  author_id: string
  full_name: string | null
  avatar_url: string | null
  comment_count?: number
  total_likes?: number
}

interface TopUsersRankingProps {
  users: TopUser[]
  valueKey: 'comment_count' | 'total_likes'
  label: string
}

export function TopUsersRanking({ users, valueKey, label }: TopUsersRankingProps) {
  if (users.length === 0) {
    return <p className="text-sm text-slate-400">데이터가 없습니다.</p>
  }

  return (
    <div className="space-y-3">
      {users.map((user, i) => {
        const value = Number(user[valueKey] || 0)
        const maxValue = Number(users[0]?.[valueKey] || 1)
        const percentage = (value / maxValue) * 100

        return (
          <div key={user.author_id} className="flex items-center gap-3">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {i + 1}
            </span>
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-sm font-semibold">
                {(user.full_name || '?').charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{user.full_name || '알 수 없음'}</p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1.5 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-600">{value} {label}</span>
          </div>
        )
      })}
    </div>
  )
}
