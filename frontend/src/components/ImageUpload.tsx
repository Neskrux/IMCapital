import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase-simple';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  label?: string;
}

const ImageUpload = ({ onImageUploaded, currentImage, label }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Por favor, selecione uma imagem válida (JPEG, PNG, GIF ou WebP)');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    setUploading(true);

    try {
      // Criar preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload para Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id || 'anonymous'}/${Date.now()}.${fileExt}`;
      const filePath = `debentures-images/${fileName}`;

      const { data, error } = await supabase.storage
        .from('debentures-images')
        .upload(filePath, file);

      if (error) {
        console.error('Erro no upload:', error);
        toast.error('Erro ao fazer upload da imagem');
        return;
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('debentures-images')
        .getPublicUrl(data.path);

      onImageUploaded(publicUrl);
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao processar imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const fakeEvent = {
        target: {
          files: [file]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const containerStyle = {
    border: '2px dashed #27272a',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#18181b',
    position: 'relative' as const
  };

  const uploadingStyle = {
    ...containerStyle,
    opacity: 0.5,
    cursor: 'not-allowed'
  };

  const previewStyle = {
    width: '100%',
    maxHeight: '200px',
    objectFit: 'cover' as const,
    borderRadius: '8px',
    marginBottom: '1rem'
  };

  const buttonStyle = {
    backgroundColor: '#f0b429',
    color: '#000',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    border: 'none',
    fontWeight: 'bold',
    fontSize: '0.875rem',
    cursor: 'pointer',
    marginTop: '1rem'
  };

  return (
    <div
      style={uploading ? uploadingStyle : containerStyle}
      onClick={() => !uploading && fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={uploading}
      />

      {preview ? (
        <>
          <img src={preview} alt="Preview" style={previewStyle} />
          <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>
            Clique ou arraste para substituir
          </p>
        </>
      ) : (
        <>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f0b429"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ margin: '0 auto 1rem' }}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p style={{ color: '#f7f7f8', marginBottom: '0.5rem' }}>
            {label || 'Arraste uma imagem ou clique para selecionar'}
          </p>
          <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>
            JPEG, PNG, GIF ou WebP (máx. 5MB)
          </p>
        </>
      )}

      {uploading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: '1rem',
          borderRadius: '8px'
        }}>
          <p style={{ color: '#f0b429' }}>Enviando...</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

