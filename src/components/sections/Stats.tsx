'use client';

export const Stats = () => {
  return (
    <section id="stats" className="stats section">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row gy-4">
          <div className="col-lg-3 col-md-6">
            <div className="stats-item d-flex align-items-center w-100 h-100">
              <i className="bi bi-people-fill flex-shrink-0"></i>
              <div>
                <span data-purecounter-start="0" data-purecounter-end="5000" data-purecounter-duration="1" className="purecounter"></span>
                <p>Membres Actifs</p>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item d-flex align-items-center w-100 h-100">
              <i className="bi bi-mortarboard-fill flex-shrink-0"></i>
              <div>
                <span data-purecounter-start="0" data-purecounter-end="100" data-purecounter-duration="1" className="purecounter"></span>
                <p>Formations</p>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item d-flex align-items-center w-100 h-100">
              <i className="bi bi-graph-up-arrow flex-shrink-0"></i>
              <div>
                <span data-purecounter-start="0" data-purecounter-end="5" data-purecounter-duration="1" className="purecounter"></span>
                <p>Niveaux de Commission</p>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item d-flex align-items-center w-100 h-100">
              <i className="bi bi-heart-fill flex-shrink-0"></i>
              <div>
                <span data-purecounter-start="0" data-purecounter-end="1" data-purecounter-duration="1" className="purecounter"></span>
                <p>Niveau Caritatif</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 