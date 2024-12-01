export const Features = () => {
  return (
    <section id="features" className="features section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Fonctionnalités</h2>
        <p>Découvrez nos fonctionnalités principales</p>
      </div>

      <div className="container">
        <div className="row gy-5">
          <div className="col-xl-6" data-aos="fade-right">
            <div className="row gy-4">
              <div className="col-md-6" data-aos="fade-up">
                <div className="feature-box d-flex align-items-center">
                  <i className="bi bi-people"></i>
                  <h3>Gestion des Parrainages</h3>
                </div>
              </div>

              <div className="col-md-6" data-aos="fade-up">
                <div className="feature-box d-flex align-items-center">
                  <i className="bi bi-graph-up"></i>
                  <h3>Commissions Multi-niveaux</h3>
                </div>
              </div>

              <div className="col-md-6" data-aos="fade-up">
                <div className="feature-box d-flex align-items-center">
                  <i className="bi bi-shield-check"></i>
                  <h3>Paiements Sécurisés</h3>
                </div>
              </div>

              <div className="col-md-6" data-aos="fade-up">
                <div className="feature-box d-flex align-items-center">
                  <i className="bi bi-gift"></i>
                  <h3>Coupons Formation</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-6" data-aos="fade-left">
            <img src="/assets/img/features.png" className="img-fluid" alt="Fonctionnalités EXTEND" />
          </div>
        </div>
      </div>
    </section>
  );
}; 