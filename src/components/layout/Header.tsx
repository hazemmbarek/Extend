'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='));
      
      console.log('Auth token found:', authToken);
      setIsLoggedIn(!!authToken);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        setIsLoggedIn(false);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header id="header" className="header d-flex align-items-center fixed-top">
      <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
        <Link href="/" className="logo d-flex align-items-center">
          <img src="/assets/img/logo2.png" alt="" />
          <h1 className="sitename">Extend</h1>
        </Link>

        <nav id="navmenu" className="navmenu">
          <ul>
            <li><Link href="/" className="active">Accueil</Link></li>
            <li><Link href="/formations">Formations</Link></li>
            <li><Link href="/referral">Arbre de parrainage</Link></li>
            {isLoggedIn ? (
              <li>
                <button 
                  onClick={handleLogout}
                  className="btn-login"
                  disabled={isLoading}
                  style={{
                    border: 'none',
                    background: '#6A1B9A',
                    cursor: 'pointer',
                    padding: '8px 20px',
                    opacity: isLoading ? 0.7 : 1,
                    color: '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: '14px',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s ease',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#581583';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#6A1B9A';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>{isLoading ? 'Déconnexion...' : 'Déconnexion'}</span>
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/signin" className="btn-login">
                    <span>Connexion</span>
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="btn-register">
                    <span>Inscription</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
          <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
        </nav>
      </div>
    </header>
  );
}; 