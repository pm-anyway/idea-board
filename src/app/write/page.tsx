import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { PostForm } from '@/components/posts/PostForm'

export default async function WritePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">새 글 작성</h1>
          <PostForm userId={user.id} />
        </div>
      </main>
    </div>
  )
}
