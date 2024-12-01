'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Get all cookies and parse them
        const cookies = document.cookie
          .split(';')
          .reduce((acc: { [key: string]: string }, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
          }, {});

        // Check specifically for auth_token
        const hasAuthToken = 'auth_token' in cookies;
        console.log('Auth check:', { cookies, hasAuthToken });
        
        setIsLoggedIn(hasAuthToken);
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsLoggedIn(false);
      }
    };

    // Check immediately
    checkAuth();

    // Set up interval for periodic checks
    const interval = setInterval(checkAuth, 1000);

    // Clean up
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        setIsLoggedIn(false);
        // Force a page reload to clear all states
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout failed:', error);
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
                  onClick={handleSignOut} 
                  className="btn-login"
                  style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  <span>Déconnexion</span>
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