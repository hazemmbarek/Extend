import { useState } from 'react';
import Image from 'next/image';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentPhone: string;
  currentImage: string;
  onUpdate: (phone: string, image: File | null) => Promise<void>;
}

export default function UpdateProfileModal({ isOpen, onClose, currentPhone, currentImage, onUpdate }: Props) {
  const [phone, setPhone] = useState(currentPhone);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await onUpdate(phone, image);
      onClose();
    } catch (err) {
      setError('Une erreur est survenue lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Modifier le profil</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Photo de profil</label>
            <div className="image-upload">
              <div className="preview-container">
                <img 
                  src={previewUrl || '/assets/img/default-avatar.png'} 
                  alt="Preview"
                  className="preview-image"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Numéro de téléphone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="text-input"
            />
          </div>

          <div className="button-group">
            <button 
              type="button" 
              onClick={onClose}
              className="cancel-button"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button 
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        h2 {
          color: var(--primary-color);
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #374151;
          font-weight: 500;
        }

        .image-upload {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .preview-container {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto;
          border: 3px solid var(--primary-color);
        }

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .text-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
        }

        .button-group {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        button {
          flex: 1;
          padding: 0.75rem;
          border-radius: 8px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .cancel-button {
          background: #f3f4f6;
          color: #374151;
        }

        .cancel-button:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .submit-button {
          background: var(--primary-color);
          color: white;
        }

        .submit-button:hover:not(:disabled) {
          background: #581583;
        }

        .error-message {
          background: #fee2e2;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
} 