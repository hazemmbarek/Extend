'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import './Header.css';
import { useRouter } from 'next/navigation';
import SponsorshipTree from '../SponsorshipTree';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const router = useRouter();

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

  const handleProfileNavigation = (section: string) => {
    setShowProfileMenu(false); // Close dropdown
    router.push(`/profile?tab=${section}`);
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
            <li>
              <Link href="/sponsorship-tree">Arbre de parrainage</Link>
            </li>
            {isLoggedIn ? (
              <>
                <li className="profile-menu-container">
                  <button 
                    className="profile-button"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <i className="bi bi-person-circle"></i>
                    <span>Mon Profil</span>
                    <i className={`bi bi-chevron-${showProfileMenu ? 'up' : 'down'}`}></i>
                  </button>
                  {showProfileMenu && (
                    <div className="profile-dropdown">
                      <div className="dropdown-section">
                        <button 
                          onClick={() => handleProfileNavigation('overview')} 
                          className="dropdown-item"
                        >
                          <i className="bi bi-person"></i>
                          Vue d'ensemble
                        </button>
                        <button 
                          onClick={() => handleProfileNavigation('formations')} 
                          className="dropdown-item"
                        >
                          <i className="bi bi-book"></i>
                          Mes Formations
                        </button>
                        <button 
                          onClick={() => handleProfileNavigation('commissions')} 
                          className="dropdown-item"
                        >
                          <i className="bi bi-cash"></i>
                          Mes Commissions
                        </button>
                        <button 
                          onClick={() => handleProfileNavigation('settings')} 
                          className="dropdown-item"
                        >
                          <i className="bi bi-gear"></i>
                          Paramètres
                        </button>
                        <div className="dropdown-divider"></div>
                        <button 
                          onClick={handleLogout}
                          className="dropdown-item text-danger"
                          disabled={isLoading}
                        >
                          <i className="bi bi-box-arrow-right"></i>
                          {isLoading ? 'Déconnexion...' : 'Déconnexion'}
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              </>
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
} 