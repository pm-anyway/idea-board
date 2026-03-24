import { LoginButton } from '@/components/auth/LoginButton'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="w-full max-w-md px-6">
        {/* 로고 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-3xl mb-5 shadow-lg shadow-indigo-200">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">사내 게시판</h1>
          <p className="mt-2 text-slate-500">직원들과 자유롭게 소통하세요</p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-slate-700">로그인</h2>
              <p className="mt-1 text-sm text-slate-500">
                Google 계정으로 로그인해주세요
              </p>
            </div>
            <LoginButton />
            <p className="text-xs text-center text-slate-400">
              로그인하면 서비스 이용약관에 동의하게 됩니다
            </p>
          </div>
        </div>

        {/* 특징 소개 */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          {[
            { icon: '💬', label: '자유로운 소통' },
            { icon: '🔒', label: '익명 보장' },
            { icon: '❤️', label: '공감 표현' },
          ].map((item) => (
            <div key={item.label} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-slate-100">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-xs text-slate-500 font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
