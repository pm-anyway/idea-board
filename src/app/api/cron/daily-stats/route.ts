import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: Request) {
  // Vercel Cron 인증 확인
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: '인증 실패' }, { status: 401 })
  }

  // Service Role Key로 RLS 우회하여 스냅샷 캡처
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )

  const { data, error } = await supabase.rpc('capture_daily_snapshot')

  if (error) {
    console.error('[Daily Stats] 스냅샷 캡처 실패:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log('[Daily Stats] 스냅샷 캡처 완료:', data)
  return NextResponse.json({ success: true, data })
}
