'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const title = (formData.get('title') as string)?.trim()
  const content = (formData.get('content') as string)?.trim()
  const category = (formData.get('category') as string) || 'general'
  const isAnonymous = formData.get('is_anonymous') === 'true'

  if (!title || !content) return { error: '제목과 내용을 입력해주세요.' }

  const { data, error } = await supabase
    .from('posts')
    .insert({ title, content, author_id: user.id, category, is_anonymous: isAnonymous })
    .select('id')
    .single()

  if (error) return { error: '게시글 저장에 실패했습니다.' }
  redirect(`/posts/${data.id}`)
}

export async function updatePost(postId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const title = (formData.get('title') as string)?.trim()
  const content = (formData.get('content') as string)?.trim()
  const category = (formData.get('category') as string) || 'general'

  if (!title || !content) return { error: '제목과 내용을 입력해주세요.' }

  const { error } = await supabase
    .from('posts')
    .update({ title, content, category })
    .eq('id', postId)
    .eq('author_id', user.id)

  if (error) return { error: '게시글 수정에 실패했습니다.' }
  redirect(`/posts/${postId}`)
}

export async function deletePost(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('posts').delete().eq('id', postId).eq('author_id', user.id)
  redirect('/')
}

export async function createComment(postId: string, content: string, isAnonymous: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요합니다.' }

  const { error } = await supabase
    .from('comments')
    .insert({ content: content.trim(), post_id: postId, author_id: user.id, is_anonymous: isAnonymous })

  if (error) return { error: '댓글 저장에 실패했습니다.' }
  return { success: true }
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요합니다.' }

  await supabase.from('comments').delete().eq('id', commentId).eq('author_id', user.id)
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function toggleLike(targetId: string, targetType: 'post' | 'comment', liked: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요합니다.' }

  const col = targetType === 'post' ? 'post_id' : 'comment_id'

  if (liked) {
    await supabase.from('likes').delete().eq('user_id', user.id).eq(col, targetId)
  } else {
    await supabase.from('likes').insert({ user_id: user.id, [col]: targetId })
  }

  return { success: true }
}
