'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FormEvent } from 'react';

export default function SignIn() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Logique de connexion
  };

  return (
    <div className="signin-page">
      <Link href="/" className="back-to-home">
        <i className="bi bi-arrow-left"></i>
        Retour à l'accueil
      </Link>

      <div className="login-container">
        <div className="login-header">
          <Image 
            src="/assets/img/logo2.png" 
            alt="EXTEND Logo" 
            width={150} 
            height={60}
            priority
          />
          <h2>Connexion</h2>
          <p>Accédez à votre espace membre</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              className="form-control" 
              id="email" 
              name="email" 
              required 
              placeholder="Votre adresse email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              name="password" 
              required 
              placeholder="Votre mot de passe"
            />
          </div>

          <div className="form-group d-flex justify-content-between align-items-center">
            <div className="form-check">
              <input 
                type="checkbox" 
                className="form-check-input" 
                id="remember"
              />
              <label className="form-check-label" htmlFor="remember">
                Se souvenir de moi
              </label>
            </div>
            <Link href="/forgot-password" className="forgot-password">
              Mot de passe oublié ?
            </Link>
          </div>

          <button type="submit" className="btn-login">Se connecter</button>
        </form>

        <div className="login-footer">
          <p>Pas encore membre ? <Link href="/signup">Inscrivez-vous</Link></p>
        </div>
      </div>
    </div>
  );
}
