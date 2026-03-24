-- RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "프로필 조회" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "프로필 수정" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- posts
CREATE POLICY "게시글 조회" ON public.posts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "게시글 작성" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "게시글 수정" ON public.posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "게시글 삭제" ON public.posts FOR DELETE USING (auth.uid() = author_id);

-- comments
CREATE POLICY "댓글 조회" ON public.comments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "댓글 작성" ON public.comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "댓글 삭제" ON public.comments FOR DELETE USING (auth.uid() = author_id);

-- likes
CREATE POLICY "좋아요 조회" ON public.likes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "좋아요 추가" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "좋아요 삭제" ON public.likes FOR DELETE USING (auth.uid() = user_id);
