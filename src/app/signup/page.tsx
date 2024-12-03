'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  username: string;
  email: string;
  password: string;
  phone_number: string;
  referral_code?: string;
  confirm_password: string;
  terms: boolean;
}

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    phone_number: '',
    referral_code: '',
    confirm_password: '',
    terms: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirm_password) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone_number: formData.phone_number,
          referral_code: formData.referral_code
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      // Redirect to signin page after successful registration
      router.push('/signin?registered=true');
      
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <Link href="/" className="back-to-home">
        <i className="bi bi-arrow-left"></i>
        Retour à l'accueil
      </Link>

      <div className="register-container">
        <div className="register-header">
          <Image 
            src="/assets/img/logo2.png" 
            alt="EXTEND Logo" 
            width={150} 
            height={60} 
            priority
          />
          <h2>Inscription</h2>
          <p>Rejoignez la communauté EXTEND</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              required 
              placeholder="Choisissez un nom d'utilisateur"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              className="form-control" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required 
              placeholder="Votre adresse email"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone_number">Téléphone</label>
            <input 
              type="tel" 
              className="form-control" 
              id="phone_number" 
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required 
              placeholder="Votre numéro de téléphone"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="referral_code">Code de Parrainage (optionnel)</label>
            <input 
              type="text" 
              className="form-control" 
              id="referral_code" 
              name="referral_code"
              value={formData.referral_code}
              onChange={handleChange}
              placeholder="Code de parrainage"
              disabled={isLoading}
            />
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input 
                  type="password" 
                  className="form-control" 
                  id="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required 
                  placeholder="Créez votre mot de passe"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="confirm_password">Confirmer le mot de passe</label>
                <input 
                  type="password" 
                  className="form-control" 
                  id="confirm_password" 
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required 
                  placeholder="Confirmez votre mot de passe"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="form-check">
              <input 
                type="checkbox" 
                className="form-check-input" 
                id="terms" 
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <label className="form-check-label" htmlFor="terms">
                J'accepte les conditions d'utilisation et la politique de confidentialité
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-register"
            disabled={isLoading || !formData.terms}
            style={{
              color: '#fff',  // Ensure white text
              opacity: (isLoading || !formData.terms) ? 0.7 : 1
            }}
          >
            {isLoading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>

        <div className="register-footer">
          <p>Déjà membre ? <Link href="/signin">Connectez-vous</Link></p>
        </div>
      </div>
    </div>
  );
}