import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import {
  getSummaryStats,
  getGrowthStats,
  getAnonymousRatio,
  getPopularPosts,
  getRecentPosts,
  getUnansweredPosts,
  getTopCommenters,
  getTopLikedUsers,
  getPostsByHour,
  getActivityByWeekday,
  getPostsByMonth,
  getDailyTrend,
  getDailyStatsHistory,
} from '@/lib/dashboard-queries'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { DashboardSection } from '@/components/dashboard/DashboardSection'
import { PostTrendChart } from '@/components/dashboard/PostTrendChart'
import { MonthlyPostChart } from '@/components/dashboard/MonthlyPostChart'
import { HourlyPatternChart } from '@/components/dashboard/HourlyPatternChart'
import { WeekdayActivityChart } from '@/components/dashboard/WeekdayActivityChart'
import { AnonymousRatioPie } from '@/components/dashboard/AnonymousRatioPie'
import { AverageStatsCard } from '@/components/dashboard/AverageStatsCard'
import { PopularPostsRanking } from '@/components/dashboard/PopularPostsRanking'
import { TopUsersRanking } from '@/components/dashboard/TopUsersRanking'
import { RecentPostsList } from '@/components/dashboard/RecentPostsList'
import { UnansweredPosts } from '@/components/dashboard/UnansweredPosts'
import { DailyStatsHistory } from '@/components/dashboard/DailyStatsHistory'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // 관리자만 접근 가능
  const adminEmail = process.env.DASHBOARD_ADMIN_EMAIL
  console.log('[Dashboard] user.email:', user.email, '| adminEmail:', adminEmail)
  if (adminEmail && user.email !== adminEmail) redirect('/')

  // 모든 데이터 병렬 로딩
  const [
    summary,
    growth,
    anonymousRatio,
    popularPosts,
    recentPosts,
    unanswered,
    topCommenters,
    topLikedUsers,
    hourlyData,
    weekdayData,
    monthlyData,
    dailyTrend,
    dailyStatsHistory,
  ] = await Promise.all([
    getSummaryStats(),
    getGrowthStats(),
    getAnonymousRatio(),
    getPopularPosts(),
    getRecentPosts(),
    getUnansweredPosts(),
    getTopCommenters(),
    getTopLikedUsers(),
    getPostsByHour(),
    getActivityByWeekday(),
    getPostsByMonth(),
    getDailyTrend(),
    getDailyStatsHistory(),
  ])

  const avgComments = summary.totalPosts > 0 ? (summary.totalComments / summary.totalPosts).toFixed(1) : '0'
  const avgLikes = summary.totalPosts > 0 ? (summary.totalLikes / summary.totalPosts).toFixed(1) : '0'

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">대시보드</h1>

        {/* 요약 카드 */}
        <SummaryCards summary={summary} growth={growth} />

        {/* 히스토리 (일별 스냅샷) */}
        <DashboardSection title="히스토리 (일별 스냅샷)">
          <DailyStatsHistory data={dailyStatsHistory} />
        </DashboardSection>

        {/* 일별 추이 */}
        <DashboardSection title="활동 추이 (최근 30일)">
          <PostTrendChart data={dailyTrend} />
        </DashboardSection>

        {/* 활동 패턴 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DashboardSection title="시간대별 게시글">
            <HourlyPatternChart data={hourlyData} />
          </DashboardSection>
          <DashboardSection title="요일별 활동량">
            <WeekdayActivityChart data={weekdayData} />
          </DashboardSection>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DashboardSection title="월별 게시글 추이">
            <MonthlyPostChart data={monthlyData} />
          </DashboardSection>
          <DashboardSection title="익명 vs 실명 비율">
            <AnonymousRatioPie anonymous={anonymousRatio.anonymous} named={anonymousRatio.named} />
          </DashboardSection>
        </div>

        {/* 평균 통계 + 인기 게시글 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DashboardSection title="평균 통계">
            <AverageStatsCard avgComments={avgComments} avgLikes={avgLikes} />
          </DashboardSection>
          <DashboardSection title="인기 게시글 TOP 10">
            <PopularPostsRanking posts={popularPosts} />
          </DashboardSection>
        </div>

        {/* 사용자 랭킹 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DashboardSection title="댓글 활동 TOP 5">
            <TopUsersRanking users={topCommenters} valueKey="comment_count" label="댓글" />
          </DashboardSection>
          <DashboardSection title="좋아요 수신 TOP 5">
            <TopUsersRanking users={topLikedUsers} valueKey="total_likes" label="좋아요" />
          </DashboardSection>
        </div>

        {/* 최근 게시글 */}
        <DashboardSection title="최근 게시글">
          <RecentPostsList posts={recentPosts} />
        </DashboardSection>

        {/* 관리 필요 */}
        <DashboardSection title="관리 필요">
          <UnansweredPosts noComment={unanswered.noComment} oldUnanswered={unanswered.oldUnanswered} />
        </DashboardSection>
      </main>
    </div>
  )
}
