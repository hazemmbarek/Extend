export const Values = () => {
  return (
    <section id="values" className="values section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Nos Valeurs</h2>
        <p>Les principes qui nous guident</p>
      </div>

      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
            <div className="card">
              <img src="/assets/img/values-1.png" className="img-fluid" alt="Transparence" />
              <h3>Transparence</h3>
              <p>Un système de commissions clair et équitable, avec une traçabilité complète des transactions et des parrainages sur 5 générations.</p>
            </div>
          </div>

          <div className="col-lg-4" data-aos="fade-up" data-aos-delay="200">
            <div className="card">
              <img src="/assets/img/values-2.png" className="img-fluid" alt="Innovation" />
              <h3>Innovation</h3>
              <p>Une plateforme moderne intégrant les dernières technologies pour une expérience utilisateur optimale et une gestion efficace du MLM.</p>
            </div>
          </div>

          <div className="col-lg-4" data-aos="fade-up" data-aos-delay="300">
            <div className="card">
              <img src="/assets/img/values-3.png" className="img-fluid" alt="Engagement Social" />
              <h3>Engagement Social</h3>
              <p>Un engagement fort dans la formation et le développement personnel, avec une contribution caritative de la 6ème génération de commissions.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 