'use client';

export function Partners() {
  const partners = [
    {
      name: "Climate Crisis Foundation",
      image: "/assets/img/partners/climatecrisis.png",
      description: "Sensibilisation et action pour le changement climatique"
    },
    {
      name: "Peace Education Foundation",
      image: "/assets/img/partners/peaceeducation.jpg",
      description: "Éducation pour la paix et le développement durable"
    },
    {
      name: "The Circle",
      image: "/assets/img/partners/thecircle.png",
      description: "Innovation sociale et développement communautaire"
    }
  ];

  return (
    <section id="partners" className="partners">
      <div className="container">
        <div className="section-title">
          <h2>Nos Partenaires Caritatifs</h2>
          <p>Ensemble pour un impact social positif</p>
        </div>

        <div className="row justify-content-center">
          {partners.map((partner, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div className="partner-box">
                <div className="partner-img">
                  <img 
                    src={partner.image} 
                    alt={partner.name}
                    className="partner-logo"
                  />
                </div>
                <div className="partner-info">
                  <h3>{partner.name}</h3>
                  <p>{partner.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .partners {
          padding: 80px 0;
          background: #f8f9fa;
        }

        .partner-box {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
          height: 100%;
          margin-bottom: 30px;
        }

        .partner-box:hover {
          transform: translateY(-5px);
        }

        .partner-img {
          position: relative;
          overflow: hidden;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: white;
        }

        .partner-logo {
          max-width: 80%;
          max-height: 160px;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .partner-box:hover .partner-logo {
          transform: scale(1.05);
        }

        .partner-info {
          padding: 25px;
          text-align: center;
          background: white;
        }

        .partner-info h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--primary-color);
          margin-bottom: 15px;
        }

        .partner-info p {
          color: #6c757d;
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0;
        }

        @media (max-width: 768px) {
          .partner-img {
            height: 180px;
          }
          
          .partner-logo {
            max-height: 140px;
          }
        }
      `}</style>
    </section>
  );
} 