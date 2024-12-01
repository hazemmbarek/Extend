'use client';

export const FAQ = () => {
  return (
    <section id="faq" className="faq section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Questions Fréquentes</h2>
        <p>Tout ce que vous devez savoir sur EXTEND</p>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <div className="faq-container">
              <div className="faq-item faq-active">
                <h3>Comment fonctionne le système de parrainage ?</h3>
                <div className="faq-content">
                  <p>Notre système permet de gérer les parrainages sur 5 générations avec des taux de commission différents pour chaque niveau. La visualisation se fait via un arbre interactif.</p>
                </div>
              </div>

              <div className="faq-item">
                <h3>Comment sont calculées les commissions ?</h3>
                <div className="faq-content">
                  <p>Les commissions sont calculées automatiquement : 20% pour la 1ère génération, 10% pour la 2ème, 15% pour la 3ème, 3% pour la 4ème, et 2% pour la 5ème. La 6ème génération (1%) est dédiée aux œuvres caritatives.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 