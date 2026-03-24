// DB 스키마 기반 타입 정의

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  title: string
  content: string
  author_id: string
  category: 'general' | 'announcement' | 'question' | 'idea' | 'feedback'
  is_anonymous: boolean
  view_count: number
  like_count: number
  comment_count: number
  created_at: string
  updated_at: string
  // 조인된 데이터
  author?: Profile
  user_liked?: boolean
}

export interface Comment {
  id: string
  content: string
  post_id: string
  author_id: string
  is_anonymous: boolean
  like_count: number
  created_at: string
  updated_at: string
  // 조인된 데이터
  author?: Profile
  user_liked?: boolean
}

export interface Like {
  id: string
  user_id: string
  post_id: string | null
  comment_id: string | null
  created_at: string
}

export type SortType = 'latest' | 'most_comments' | 'most_likes'
