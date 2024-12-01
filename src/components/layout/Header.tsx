'use client';

import Link from 'next/link';

export const Header = () => {
  return (
    <header id="header" className="header d-flex align-items-center fixed-top">
      <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
        <Link href="/" className="logo d-flex align-items-center">
          <img src="/assets/img/logo2.png" alt="" />
          <h1 className="sitename">Extend</h1>
        </Link>

        <nav id="navmenu" className="navmenu">
          <ul>
            <li><Link href="#hero" className="active">Accueil</Link></li>
            <li><Link href="/formations">Formations</Link></li>
            <li><Link href="#contact">Arbre de parrainage</Link></li>
            <li><Link href="/login" className="btn-login"><span>Connexion</span></Link></li>
            <li><Link href="/register" className="btn-register"><span>Inscription</span></Link></li>
          </ul>
          <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
        </nav>
      </div>
    </header>
  );
}; 