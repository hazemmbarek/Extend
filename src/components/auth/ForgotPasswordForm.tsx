'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isFromProfile = pathname.includes('profile');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      setSuccess(true);
      setTimeout(() => {
        if (isFromProfile) {
          router.push('/profile?tab=settings');
        }
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2>{isFromProfile ? 'Changer le mot de passe' : 'Mot de passe oublié ?'}</h2>
        <p className="text-muted">
          {isFromProfile 
            ? 'Entrez votre email pour recevoir les instructions de changement de mot de passe'
            : 'Entrez votre email pour réinitialiser votre mot de passe'}
        </p>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {success ? (
          <div className="alert alert-success">
            Un email a été envoyé avec les instructions pour {isFromProfile ? 'changer' : 'réinitialiser'} votre mot de passe.
            {isFromProfile && <p>Vous allez être redirigé vers votre profil...</p>}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? 'Chargement...' : isFromProfile ? 'Changer le mot de passe' : 'Réinitialiser'}
            </button>
          </form>
        )}
      </div>

      <style jsx>{`
        .form-container {
          max-width: 400px;
          margin: 2rem auto;
          padding: 0 1rem;
        }

        .form-box {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        h2 {
          color: var(--primary-color);
          margin-bottom: 1rem;
          text-align: center;
        }

        .text-muted {
          color: #6c757d;
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #495057;
        }

        input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        button {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          background: var(--primary-color);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .alert {
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        .alert-danger {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .alert-success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
      `}</style>
    </div>
  );
} 