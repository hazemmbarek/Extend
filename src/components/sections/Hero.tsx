'use client';

export const Hero = () => {
  return (
    <section id="hero" className="hero">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <h1>Développez votre réseau avec EXTEND</h1>
            <p>
              Une plateforme MLM innovante dédiée à la promotion de formations,
              avec un système de commissions transparent et équitable.
            </p>
          </div>
          <div className="col-lg-6">
            <img 
              src="/assets/img/hero-img.png" 
              alt="EXTEND MLM Platform" 
              className="img-fluid"
            />
          </div>
        </div>
      </div>
    </section>
  );
}; 