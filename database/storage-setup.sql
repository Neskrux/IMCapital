-- ====================================================
-- CONFIGURAÇÃO DO STORAGE - IMCAPITAL
-- ====================================================
-- 
-- INSTRUÇÕES:
-- 1. Execute o schema principal primeiro (supabase-schema.sql)
-- 2. Depois execute este script no SQL Editor
-- 3. Ou crie os buckets manualmente no painel Storage
-- 
-- ====================================================

-- ====================================================
-- 1. CRIAR BUCKETS
-- ====================================================

-- Bucket para avatars dos usuários
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Bucket para documentos dos usuários (privado)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- Bucket para logos das empresas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-logos',
  'company-logos',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Bucket para documentos de debêntures (prospectos, contratos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'debenture-docs',
  'debenture-docs',
  false,
  52428800, -- 50MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- ====================================================
-- 2. POLÍTICAS DE SEGURANÇA PARA AVATARS
-- ====================================================

-- Usuários podem ver todos os avatars (bucket público)
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Usuários podem fazer upload de seu próprio avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Usuários podem atualizar seu próprio avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Usuários podem deletar seu próprio avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ====================================================
-- 3. POLÍTICAS DE SEGURANÇA PARA DOCUMENTOS
-- ====================================================

-- Usuários podem ver apenas seus próprios documentos
CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Usuários podem fazer upload de seus próprios documentos
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Usuários podem atualizar seus próprios documentos
CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Usuários podem deletar seus próprios documentos
CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ====================================================
-- 4. POLÍTICAS PARA LOGOS DE EMPRESAS
-- ====================================================

-- Todos podem ver logos das empresas (bucket público)
CREATE POLICY "Company logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-logos');

-- Apenas admins podem fazer upload de logos (para implementar depois)
-- Por enquanto, permitir uploads autenticados
CREATE POLICY "Authenticated users can upload company logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'company-logos');

-- Apenas admins podem atualizar logos
CREATE POLICY "Authenticated users can update company logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'company-logos');

-- ====================================================
-- 5. POLÍTICAS PARA DOCUMENTOS DE DEBÊNTURES
-- ====================================================

-- Usuários autenticados podem ver documentos de debêntures
CREATE POLICY "Authenticated users can view debenture documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'debenture-docs');

-- Apenas admins podem fazer upload (para implementar depois)
CREATE POLICY "Authenticated users can upload debenture documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'debenture-docs');

-- ====================================================
-- 6. FUNÇÕES AUXILIARES PARA UPLOAD
-- ====================================================

-- Função para gerar nome único de arquivo
CREATE OR REPLACE FUNCTION generate_unique_filename(
  user_id UUID,
  original_filename TEXT,
  file_type TEXT DEFAULT 'document'
)
RETURNS TEXT AS $$
DECLARE
  extension TEXT;
  unique_name TEXT;
BEGIN
  -- Extrair extensão do arquivo
  extension := lower(split_part(original_filename, '.', -1));
  
  -- Gerar nome único
  unique_name := user_id::text || '/' || file_type || '_' || 
                 extract(epoch from now())::bigint || '_' || 
                 substr(md5(random()::text), 1, 8) || '.' || extension;
  
  RETURN unique_name;
END;
$$ LANGUAGE plpgsql;

-- Função para validar tipo de arquivo
CREATE OR REPLACE FUNCTION validate_file_type(
  filename TEXT,
  allowed_types TEXT[]
)
RETURNS BOOLEAN AS $$
DECLARE
  extension TEXT;
  mime_type TEXT;
BEGIN
  extension := lower(split_part(filename, '.', -1));
  
  -- Mapear extensões para tipos MIME
  CASE extension
    WHEN 'jpg', 'jpeg' THEN mime_type := 'image/jpeg';
    WHEN 'png' THEN mime_type := 'image/png';
    WHEN 'webp' THEN mime_type := 'image/webp';
    WHEN 'gif' THEN mime_type := 'image/gif';
    WHEN 'svg' THEN mime_type := 'image/svg+xml';
    WHEN 'pdf' THEN mime_type := 'application/pdf';
    WHEN 'doc' THEN mime_type := 'application/msword';
    WHEN 'docx' THEN mime_type := 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    ELSE RETURN false;
  END CASE;
  
  RETURN mime_type = ANY(allowed_types);
END;
$$ LANGUAGE plpgsql;

-- ====================================================
-- 7. TRIGGER PARA ATUALIZAR URL DO AVATAR NO PERFIL
-- ====================================================

-- Função para atualizar URL do avatar no perfil
CREATE OR REPLACE FUNCTION update_profile_avatar_url()
RETURNS TRIGGER AS $$
DECLARE
  user_id UUID;
  avatar_url TEXT;
BEGIN
  -- Extrair user_id do nome do arquivo
  user_id := (storage.foldername(NEW.name))[1]::UUID;
  
  -- Construir URL pública do avatar
  avatar_url := 'https://' || 
    (SELECT split_part(url, '//', 2) FROM pg_settings WHERE name = 'supabase.url') ||
    '/storage/v1/object/public/avatars/' || NEW.name;
  
  -- Atualizar perfil do usuário
  UPDATE profiles 
  SET avatar_url = avatar_url 
  WHERE id = user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar avatar automaticamente
CREATE OR REPLACE TRIGGER on_avatar_uploaded
  AFTER INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'avatars')
  EXECUTE FUNCTION update_profile_avatar_url();

-- ====================================================
-- 8. VIEWS PARA FACILITAR CONSULTAS
-- ====================================================

-- View para arquivos do usuário
CREATE OR REPLACE VIEW user_files AS
SELECT 
  o.id,
  o.name,
  o.bucket_id,
  o.owner,
  (storage.foldername(o.name))[1]::UUID as user_id,
  o.created_at,
  o.updated_at,
  o.last_accessed_at,
  o.metadata
FROM storage.objects o
WHERE o.bucket_id IN ('avatars', 'documents');

-- View para estatísticas de storage
CREATE OR REPLACE VIEW storage_stats AS
SELECT 
  bucket_id,
  COUNT(*) as file_count,
  SUM((metadata->>'size')::bigint) as total_size,
  AVG((metadata->>'size')::bigint) as avg_size,
  MAX((metadata->>'size')::bigint) as max_size
FROM storage.objects
GROUP BY bucket_id;

-- ====================================================
-- FIM DA CONFIGURAÇÃO DO STORAGE
-- ====================================================

-- Verificar se tudo foi criado corretamente
SELECT 'Storage configurado com sucesso!' as status,
       (SELECT COUNT(*) FROM storage.buckets) as buckets_criados,
       (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'storage') as politicas_criadas;
