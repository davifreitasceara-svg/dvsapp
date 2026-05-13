-- ############################################################
-- DVS EDUCREATOR - CLEANUP SOCIAL FEATURES
-- ############################################################
-- Execute este script para remover as funcionalidades sociais e manter apenas a galeria de inspiração.

-- 1. REMOVER TABELAS SOCIAIS
DROP TABLE IF EXISTS public.follows CASCADE;
DROP TABLE IF EXISTS public.post_likes CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;

-- 2. REMOVER COLUNAS DE REPOST (OPCIONAL)
ALTER TABLE public.posts DROP COLUMN IF EXISTS repost_of_id;

-- 3. MANTER APENAS O QUE É NECESSÁRIO EM PERFIS
-- (bio, website, professional_role já foram adicionados e são úteis para o perfil)

-- 4. MANTER TABELA DE POSTS SALVOS (SAVED_POSTS)
-- Esta tabela é mantida para a funcionalidade de "Galeria de Inspiração".
-- CREATE TABLE IF NOT EXISTS public.saved_posts (
--   user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
--   post_id bigint REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
--   created_at timestamp with time zone DEFAULT now(),
--   PRIMARY KEY (user_id, post_id)
-- );

-- 5. LIMPAR POLÍTICAS E ÍNDICES RELACIONADOS
DROP INDEX IF EXISTS idx_follows_follower;
DROP INDEX IF EXISTS idx_follows_following;
DROP INDEX IF EXISTS idx_post_likes_post;
DROP INDEX IF EXISTS idx_comments_post;

-- As políticas para saved_posts, posts e profiles devem permanecer para que a galeria funcione.
-- Mas garantimos que as políticas de social sejam removidas.
DROP POLICY IF EXISTS "Users can view follows" ON public.follows;
DROP POLICY IF EXISTS "Users can follow others" ON public.follows;
DROP POLICY IF EXISTS "Users can unfollow others" ON public.follows;
DROP POLICY IF EXISTS "Users can view likes" ON public.post_likes;
DROP POLICY IF EXISTS "Users can like posts" ON public.post_likes;
DROP POLICY IF EXISTS "Users can unlike posts" ON public.post_likes;
DROP POLICY IF EXISTS "Users can view comments" ON public.comments;
DROP POLICY IF EXISTS "Users can insert comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;

-- 6. GARANTIR RLS PARA O QUE SOBROU
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;

-- Políticas para Saved Posts (Garantir que existem)
DROP POLICY IF EXISTS "Users can view own saved posts" ON public.saved_posts;
CREATE POLICY "Users can view own saved posts" ON public.saved_posts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can save posts" ON public.saved_posts;
CREATE POLICY "Users can save posts" ON public.saved_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unsave posts" ON public.saved_posts;
CREATE POLICY "Users can unsave posts" ON public.saved_posts FOR DELETE USING (auth.uid() = user_id);
