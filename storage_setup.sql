-- ############################################################
-- CONFIGURAÇÃO DE STORAGE PARA POSTS
-- ############################################################

-- 1. Criar o bucket 'post-media'
-- Vá no seu painel do Supabase -> Storage -> New Bucket -> Nome: 'post-media' -> Public: true

-- OU execute este SQL se o seu projeto permitir RPC de criação de bucket:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('post-media', 'post-media', true);

-- 2. Políticas de Segurança para o Bucket 'post-media'
-- Permitir que qualquer pessoa visualize os arquivos
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'post-media');

-- Permitir que usuários autenticados façam upload
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'post-media' AND auth.role() = 'authenticated'
);

-- Permitir que usuários deletem seus próprios arquivos
CREATE POLICY "Owner Delete" ON storage.objects FOR DELETE USING (
  bucket_id = 'post-media' AND auth.uid() = owner
);
