-- ############################################################
-- DVS EDUCREATOR - REDE SOCIAL SCHEMA
-- ############################################################
-- Execute este script no SQL Editor do seu Dashboard do Supabase.

-- 1. ATUALIZAR PERFIS
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS professional_role text;

-- 2. ATUALIZAR POSTS
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS repost_of_id uuid REFERENCES public.posts(id) ON DELETE CASCADE;

-- 3. TABELA DE SEGUIDORES (FOLLOWS)
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (follower_id, following_id)
);

-- 4. TABELA DE CURTIDAS (POST_LIKES)
CREATE TABLE IF NOT EXISTS public.post_likes (
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

-- 5. TABELA DE COMENTÁRIOS (COMMENTS)
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 6. TABELA DE POSTS SALVOS (SAVED_POSTS)
CREATE TABLE IF NOT EXISTS public.saved_posts (
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

-- 7. PERFORMANCE (INDEXES)
CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows(following_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post ON public.post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_saved_posts_user ON public.saved_posts(user_id);

-- 8. SEGURANÇA (RLS - Row Level Security)
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;

-- Limpar políticas existentes
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Permitir que todos os usuários logados leiam perfis e posts (Feed Público)
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Posts are viewable by everyone" ON public.posts FOR SELECT USING (auth.uid() IS NOT NULL);

-- Políticas para Follows
CREATE POLICY "Users can view follows" ON public.follows FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can follow others" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow others" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- Políticas para Likes
CREATE POLICY "Users can view likes" ON public.post_likes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can like posts" ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike posts" ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

-- Políticas para Comments
CREATE POLICY "Users can view comments" ON public.comments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can insert comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Políticas para Saved Posts
CREATE POLICY "Users can view own saved posts" ON public.saved_posts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save posts" ON public.saved_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave posts" ON public.saved_posts FOR DELETE USING (auth.uid() = user_id);
