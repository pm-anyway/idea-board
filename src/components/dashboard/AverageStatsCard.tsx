interface AverageStatsCardProps {
  avgComments: string
  avgLikes: string
}

export function AverageStatsCard({ avgComments, avgLikes }: AverageStatsCardProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-slate-50 rounded-xl p-5 text-center">
        <p className="text-3xl font-bold text-indigo-600">{avgComments}</p>
        <p className="text-sm text-slate-500 mt-1">게시글당 평균 댓글</p>
      </div>
      <div className="bg-slate-50 rounded-xl p-5 text-center">
        <p className="text-3xl font-bold text-pink-600">{avgLikes}</p>
        <p className="text-sm text-slate-500 mt-1">게시글당 평균 좋아요</p>
      </div>
    </div>
  )
}
