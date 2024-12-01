export const About = () => {
  return (
    <section id="about" className="about section">
      <div className="container" data-aos="fade-up">
        <div className="row gx-0">
          <div className="col-lg-6 d-flex flex-column justify-content-center" data-aos="fade-up" data-aos-delay="200">
            <div className="content">
              <h3>Qui sommes-nous ?</h3>
              <h2>Une plateforme innovante de marketing multiniveau dédiée à la formation</h2>
              <p>
                EXTEND est une plateforme web moderne qui révolutionne la gestion du marketing multiniveau (MLM) dans le domaine de la formation...
              </p>
            </div>
          </div>
          <div className="col-lg-6 d-flex align-items-center" data-aos="zoom-out" data-aos-delay="200">
            <img src="/assets/img/about2.jpg" className="img-fluid" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}; 