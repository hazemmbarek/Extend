'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setStatus('success');
      setMessage(data.message);
      
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <Image 
          src="/assets/img/logo2.png" 
          alt="EXTEND Logo" 
          width={150} 
          height={60}
          priority
        />
        <h2>Mot de passe oublié</h2>
        <p>Entrez votre email pour réinitialiser votre mot de passe</p>
      </div>

      {message && (
        <div className={`alert ${status === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            className="form-control" 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            placeholder="Votre adresse email"
            disabled={status === 'loading'}
          />
        </div>

        <button 
          type="submit" 
          className="btn-login"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Envoi...' : 'Envoyer les instructions'}
        </button>
      </form>

      <div className="login-footer">
        <p><Link href="/signin">Retour à la connexion</Link></p>
      </div>
    </div>
  );
} 