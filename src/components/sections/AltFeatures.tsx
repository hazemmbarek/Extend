'use client';

export const AltFeatures = () => {
  return (
    <section id="alt-features" className="alt-features section">
      <div className="container">
        <div className="row gy-5">
          <div className="col-xl-7 d-flex order-2 order-xl-1" data-aos="fade-up" data-aos-delay="200">
            <div className="row align-self-center gy-5">
              <div className="col-md-6 icon-box">
                <i className="bi bi-diagram-3"></i>
                <div>
                  <h4>Arbre de Parrainage</h4>
                  <p>Visualisation graphique des membres parrainés jusqu'à 5 générations avec navigation fluide et interactive</p>
                </div>
              </div>

              <div className="col-md-6 icon-box">
                <i className="bi bi-calculator"></i>
                <div>
                  <h4>Calcul Automatique</h4>
                  <p>Gestion automatisée des commissions avec TVA (19%) et retenue à la source (10%) sur 5 niveaux</p>
                </div>
              </div>

              <div className="col-md-6 icon-box">
                <i className="bi bi-credit-card"></i>
                <div>
                  <h4>Paiements Intégrés</h4>
                  <p>Solutions de paiement locales (D17, FlouciTn, Konnect) et internationales (MasterCard, VISA)</p>
                </div>
              </div>

              <div className="col-md-6 icon-box">
                <i className="bi bi-gift"></i>
                <div>
                  <h4>Coupons Formation</h4>
                  <p>Système de distribution aléatoire de neuf coupons de formations gratuites pour les membres</p>
                </div>
              </div>

              <div className="col-md-6 icon-box">
                <i className="bi bi-shield-check"></i>
                <div>
                  <h4>Sécurité Avancée</h4>
                  <p>Protection SSL, authentification JWT et sauvegardes automatiques des données</p>
                </div>
              </div>

              <div className="col-md-6 icon-box">
                <i className="bi bi-heart"></i>
                <div>
                  <h4>Impact Social</h4>
                  <p>6ème génération de commissions (1%) dédiée aux œuvres caritatives pour un impact social positif</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-5 d-flex align-items-center order-1 order-xl-2" data-aos="fade-up" data-aos-delay="100">
            <img src="/assets/img/alt-features.png" className="img-fluid" alt="Fonctionnalités Avancées EXTEND" />
          </div>
        </div>
      </div>
    </section>
  );
}; 