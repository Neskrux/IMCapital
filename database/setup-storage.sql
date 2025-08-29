-- ====================================================
-- CONFIGURAÇÃO DO SUPABASE STORAGE
-- ====================================================
-- Execute este código no SQL Editor do Supabase

-- Criar bucket para imagens das empresas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('company-logos', 'company-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Criar bucket para imagens das debêntures
INSERT INTO storage.buckets (id, name, public) 
VALUES ('debenture-images', 'debenture-images', true)
ON CONFLICT (id) DO NOTHING;

-- Criar bucket para documentos dos usuários
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-documents', 'user-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas para company-logos (público)
CREATE POLICY "Todos podem visualizar logos das empresas" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'company-logos');

CREATE POLICY "Usuários autenticados podem fazer upload de logos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'company-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar logos" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'company-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar logos" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'company-logos' AND auth.role() = 'authenticated');

-- Políticas para debenture-images (público)
CREATE POLICY "Todos podem visualizar imagens das debêntures" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'debenture-images');

CREATE POLICY "Usuários autenticados podem fazer upload de imagens de debêntures" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'debenture-images' AND auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar imagens de debêntures" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'debenture-images' AND auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar imagens de debêntures" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'debenture-images' AND auth.role() = 'authenticated');

-- Políticas para user-documents (privado)
CREATE POLICY "Usuários podem ver apenas seus próprios documentos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'user-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Usuários podem fazer upload apenas de seus próprios documentos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'user-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Usuários podem atualizar apenas seus próprios documentos" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'user-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Usuários podem deletar apenas seus próprios documentos" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'user-documents' AND (storage.foldername(name))[1] = auth.uid()::text);