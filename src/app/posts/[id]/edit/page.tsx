import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { PostForm } from '@/components/posts/PostForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .eq('author_id', user.id)
    .single()

  if (!post) notFound()

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">게시글 수정</h1>
          <PostForm
            userId={user.id}
            postId={id}
            initialTitle={post.title}
            initialContent={post.content}
            initialIsAnonymous={post.is_anonymous}
            initialCategory={post.category}
          />
        </div>
      </main>
    </div>
  )
}
