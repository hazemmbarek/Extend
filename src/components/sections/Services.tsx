'use client';

export const Services = () => {
  return (
    <section id="services" className="services section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Nos Services</h2>
        <p>Des solutions adaptées à vos besoins</p>
      </div>

      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
            <div className="service-item item-cyan position-relative">
              <i className="bi bi-people-fill icon"></i>
              <h3>Gestion MLM</h3>
              <p>Système complet de gestion des parrainages sur 5 générations avec visualisation interactive de votre réseau.</p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
            <div className="service-item item-orange position-relative">
              <i className="bi bi-mortarboard-fill icon"></i>
              <h3>Formations</h3>
              <p>Accès à des formations de qualité avec un système de coupons gratuits distribués de manière aléatoire.</p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
            <div className="service-item item-teal position-relative">
              <i className="bi bi-cash-coin icon"></i>
              <h3>Gestion des Commissions</h3>
              <p>Calcul automatique des commissions avec prise en compte de la TVA et de la retenue à la source.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 