import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * OAuth 콜백 핸들러
 *
 * Google OAuth 리다이렉트 후 인가 코드를 세션으로 교환합니다.
 * 미들웨어를 거치지 않고 직접 쿠키를 관리하여 lock 경합을 방지합니다.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    // 응답 객체에 직접 쿠키를 설정하여 세션 저장
    const response = NextResponse.redirect(`${origin}${next}`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return response
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
