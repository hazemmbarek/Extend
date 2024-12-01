'use client';

import Link from 'next/link';

export const Footer = () => {
  return (
    <footer id="footer" className="footer">
      <div className="container footer-top">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6 footer-about">
            <Link href="/" className="d-flex align-items-center">
              <span className="sitename">EXTEND</span>
            </Link>
            <div className="footer-contact pt-3">
              <p>Tunisie</p>
              <p className="mt-3">
                <strong>Téléphone:</strong> <span>+216 42 200 300</span>
              </p>
              <p>
                <strong>Email:</strong> <span>contact@lecoach.tn</span>
              </p>
            </div>
          </div>

          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Liens Utiles</h4>
            <ul>
              <li><i className="bi bi-chevron-right"></i> <Link href="#hero">Accueil</Link></li>
              <li><i className="bi bi-chevron-right"></i> <Link href="#about">À propos</Link></li>
              <li><i className="bi bi-chevron-right"></i> <Link href="#features">Fonctionnalités</Link></li>
              <li><i className="bi bi-chevron-right"></i> <Link href="#contact">Contact</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Nos Services</h4>
            <ul>
              <li><i className="bi bi-chevron-right"></i> <Link href="#">Gestion MLM</Link></li>
              <li><i className="bi bi-chevron-right"></i> <Link href="#">Formations</Link></li>
              <li><i className="bi bi-chevron-right"></i> <Link href="#">Commissions</Link></li>
              <li><i className="bi bi-chevron-right"></i> <Link href="#">Support</Link></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-12">
            <h4>Suivez-nous</h4>
            <p>Restez connecté avec EXTEND pour ne rien manquer de nos actualités et opportunités</p>
            <div className="social-links d-flex">
              <Link href="#"><i className="bi bi-twitter-x"></i></Link>
              <Link href="#"><i className="bi bi-facebook"></i></Link>
              <Link href="#"><i className="bi bi-instagram"></i></Link>
              <Link href="#"><i className="bi bi-linkedin"></i></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container copyright text-center mt-4">
        <p>© <span>Copyright</span> <strong className="px-1 sitename">EXTEND</strong> <span>Tous droits réservés</span></p>
        <div className="credits">
          Développé par <a href="mailto:contact@lecoach.tn">Fady Hamza</a>
        </div>
      </div>

      {/* Scroll Top Button */}
      <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center">
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </footer>
  );
}; 