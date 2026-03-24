'use client'

import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'
import { signOut } from '@/app/actions'
import { useState, useRef, useEffect } from 'react'

export function Header() {
  const { user, profile } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try { await signOut() } catch { /* redirect throws */ }
  }

  const displayName = profile?.full_name || profile?.email?.split('@')[0] || '사용자'

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-slate-800 hover:text-[#6366f1] transition-colors">
          <div className="w-9 h-9 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-xl flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <span className="hidden sm:block">사내 게시판</span>
        </Link>

        {/* 우측 영역 */}
        {user && (
          <div className="flex items-center gap-3">
            <Link
              href="/write"
              className="flex items-center gap-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:shadow-md hover:shadow-indigo-200 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:block">글쓰기</span>
            </Link>

            {/* 프로필 메뉴 */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition-colors rounded-xl px-2 py-1.5 hover:bg-slate-100"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="w-8 h-8 rounded-full border-2 border-slate-100"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center text-[#6366f1] font-semibold text-sm">
                    {displayName.charAt(0)}
                  </div>
                )}
                <span className="hidden sm:block font-medium max-w-[100px] truncate">{displayName}</span>
                <svg className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-700 truncate">{displayName}</p>
                    <p className="text-xs text-slate-400 truncate">{profile?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
