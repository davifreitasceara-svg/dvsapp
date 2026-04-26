-- ############################################################
-- DVS EDUCREATOR - DATABASE IMPROVEMENT & RESET SCRIPT
-- ############################################################
-- Execute este script no SQL Editor do seu Dashboard do Supabase.

-- 1. LIMPEZA DE DADOS (RESET)
-- Descomente as linhas abaixo se quiser apagar TODOS os posts existentes
-- TRUNCATE public.posts CASCADE;
-- UPDATE public.profiles SET posts_used = 0, last_usage_reset = CURRENT_DATE;

-- 2. ESTRUTURA DA TABELA DE PERFIS
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  updated_at timestamp with time zone DEFAULT now(),
  full_name text,
  avatar_url text,
  posts_used integer DEFAULT 0,
  last_usage_reset date DEFAULT CURRENT_DATE,
  plan text DEFAULT 'free'
);

-- 3. ESTRUTURA DA TABELA DE POSTS
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  content jsonb,
  platform text,
  score integer
);

-- 4. PERFORMANCE (INDEXES)
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_last_reset ON public.profiles(last_usage_reset);

-- 5. SEGURANÇA (RLS - Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Limpar políticas existentes para evitar erros de duplicata
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own posts" ON public.posts;

-- Criar novas políticas
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can manage own posts" ON public.posts FOR ALL USING (auth.uid() = user_id);

-- 6. FUNÇÃO ATÔMICA DE USO (RPC)
-- Esta função garante que o limite de uso seja verificado e incrementado de forma segura no servidor.
CREATE OR REPLACE FUNCTION increment_post_usage(user_id_param uuid, limit_param integer)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    today_date date := CURRENT_DATE;
    current_count integer;
    user_plan text;
    rec record;
BEGIN
    -- Busca o perfil ou cria se não existir
    SELECT * INTO rec FROM public.profiles WHERE id = user_id_param;
    
    IF NOT FOUND THEN
        INSERT INTO public.profiles (id, posts_used, last_usage_reset, plan)
        VALUES (user_id_param, 1, today_date, 'free')
        RETURNING posts_used, plan INTO current_count, user_plan;
        RETURN jsonb_build_object('success', true, 'count', 1);
    END IF;

    current_count := rec.posts_used;
    user_plan := rec.plan;

    -- Se mudou o dia, reseta o contador
    IF rec.last_usage_reset < today_date THEN
        UPDATE public.profiles
        SET posts_used = 1, last_usage_reset = today_date
        WHERE id = user_id_param;
        RETURN jsonb_build_object('success', true, 'count', 1);
    END IF;

    -- Verifica limite (Ignora se for plano 'full')
    IF current_count >= limit_param AND user_plan <> 'full' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Limit reached');
    END IF;

    -- Incrementa uso
    UPDATE public.profiles
    SET posts_used = posts_used + 1
    WHERE id = user_id_param
    RETURNING posts_used INTO current_count;

    RETURN jsonb_build_object('success', true, 'count', current_count);
END;
$$;
