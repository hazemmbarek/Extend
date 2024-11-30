'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FormEvent } from 'react';

export default function SignUp() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Logique de soumission
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

        <form onSubmit={handleSubmit} className="register-form">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="firstname">Prénom</label>
                <input type="text" className="form-control" id="firstname" name="firstname" required placeholder="Votre prénom" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="lastname">Nom</label>
                <input type="text" className="form-control" id="lastname" name="lastname" required placeholder="Votre nom" />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" className="form-control" id="email" name="email" required placeholder="Votre adresse email" />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Téléphone</label>
            <input type="tel" className="form-control" id="phone" name="phone" required placeholder="Votre numéro de téléphone" />
          </div>

          <div className="form-group">
            <label htmlFor="sponsor_id">ID de Parrainage</label>
            <input type="text" className="form-control" id="sponsor_id" name="sponsor_id" required placeholder="ID de votre parrain" />
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input type="password" className="form-control" id="password" name="password" required placeholder="Créez votre mot de passe" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="confirm_password">Confirmer le mot de passe</label>
                <input type="password" className="form-control" id="confirm_password" name="confirm_password" required placeholder="Confirmez votre mot de passe" />
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="terms" required />
              <label className="form-check-label" htmlFor="terms">
                J'accepte les conditions d'utilisation et la politique de confidentialité
              </label>
            </div>
          </div>

          <button type="submit" className="btn-register">S'inscrire</button>
        </form>

        <div className="register-footer">
          <p>Déjà membre ? <Link href="/login">Connectez-vous</Link></p>
        </div>
      </div>
    </div>
  );
}
