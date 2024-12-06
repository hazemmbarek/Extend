'use client';

import Link from 'next/link';

export const Footer = () => {
  return (
    <footer id="footer" className="footer bg-gradient-to-b from-purple-900 to-purple-950">
      <div className="container footer-top">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6 footer-about">
            <Link href="/" className="d-flex align-items-center">
              <span className="sitename text-purple-200">EXTEND</span>
            </Link>
            <div className="footer-contact pt-3 text-purple-200">
              <p>Tunisie</p>
              <p className="mt-3">
                <strong className="text-purple-100">Téléphone:</strong> <span>+216 42 200 300</span>
              </p>
              <p>
                <strong className="text-purple-100">Email:</strong> <span>contact@lecoach.tn</span>
              </p>
            </div>
          </div>

          <div className="col-lg-2 col-md-3 footer-links">
            <h4 className="text-purple-200">Liens Utiles</h4>
            <ul>
              <li className="text-purple-300 hover:text-white transition-colors">
                <i className="bi bi-chevron-right"></i> <Link href="#hero">Accueil</Link>
              </li>
              <li className="text-purple-300 hover:text-white transition-colors">
                <i className="bi bi-chevron-right"></i> <Link href="#about">À propos</Link>
              </li>
              <li className="text-purple-300 hover:text-white transition-colors">
                <i className="bi bi-chevron-right"></i> <Link href="#features">Fonctionnalités</Link>
              </li>
              <li className="text-purple-300 hover:text-white transition-colors">
                <i className="bi bi-chevron-right"></i> <Link href="#contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 footer-links">
            <h4 className="text-purple-200">Nos Services</h4>
            <ul>
              <li className="text-purple-300 hover:text-white transition-colors">
                <i className="bi bi-chevron-right"></i> <Link href="#">Gestion MLM</Link>
              </li>
              <li className="text-purple-300 hover:text-white transition-colors">
                <i className="bi bi-chevron-right"></i> <Link href="#">Formations</Link>
              </li>
              <li className="text-purple-300 hover:text-white transition-colors">
                <i className="bi bi-chevron-right"></i> <Link href="#">Commissions</Link>
              </li>
              <li className="text-purple-300 hover:text-white transition-colors">
                <i className="bi bi-chevron-right"></i> <Link href="#">Support</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-12">
            <h4 className="text-purple-200">Suivez-nous</h4>
            <p className="text-purple-300">Restez connecté avec EXTEND pour ne rien manquer de nos actualités et opportunités</p>
            <div className="social-links d-flex text-purple-300">
              <Link href="#"><i className="bi bi-twitter-x"></i></Link>
              <Link href="#"><i className="bi bi-facebook"></i></Link>
              <Link href="#"><i className="bi bi-instagram"></i></Link>
              <Link href="#"><i className="bi bi-linkedin"></i></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container copyright text-center mt-4 border-t border-purple-800 pt-4">
        <p className="text-purple-200">© <span>Copyright</span> <strong className="px-1 sitename">EXTEND</strong> <span>Tous droits réservés</span></p>
      </div>

      {/* Scroll Top Button */}
      <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center bg-purple-700 hover:bg-purple-600">
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </footer>
  );
}; 