'use client';

export const Testimonials = () => {
  return (
    <section id="testimonials" className="testimonials section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Témoignages</h2>
        <p>Ce que nos membres disent d'EXTEND</p>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <div className="testimonial-item">
              <div className="stars mb-4">
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
              </div>
              <p className="testimonial-text mb-4">
                "La transparence du système de commissions et la qualité des formations m'ont permis de développer mon réseau efficacement."
              </p>
              <div className="profile mt-auto">
                <img src="/assets/img/testimonials/per1.jpg" className="testimonial-img rounded-circle mb-3" alt="" />
                <h4>Ahmed Ben Salem</h4>
                <span>Membre Premium</span>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-lg-8 text-center">
            <div className="testimonial-item">
              <div className="stars mb-4">
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
              </div>
              <p className="testimonial-text mb-4">
                "Le système de calcul des commissions est très transparent. J'apprécie particulièrement l'aspect caritatif avec la 6ème génération."
              </p>
              <div className="profile mt-auto">
                <img src="/assets/img/testimonials/per2.jpg" className="testimonial-img rounded-circle mb-3" alt="" />
                <h4>Sarah Mansouri</h4>
                <span>Membre Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 