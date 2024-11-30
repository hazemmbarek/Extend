'use client';

export const Team = () => {
  return (
    <section id="team" className="team section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Notre Équipe</h2>
        <p>Les experts derrière EXTEND</p>
      </div>

      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-3 col-md-6">
            <div className="team-member">
              <div className="member-img">
                <img src="/assets/img/team/t1.jpg" className="img-fluid" alt="" />
                <div className="social">
                  <a href=""><i className="bi bi-linkedin"></i></a>
                </div>
              </div>
              <div className="member-info">
                <h4>Fady Hamza</h4>
                <span>Fondateur & CEO</span>
                <p>Expert en marketing digital et systèmes MLM avec plus de 10 ans d'expérience.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 