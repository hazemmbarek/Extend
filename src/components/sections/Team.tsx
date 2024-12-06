'use client';

interface TeamMember {
  name: string;
  image: string;
  socials: {
    linkedin?: string;
  }
}

interface TeamProps {
  members: TeamMember[];
}

export function Team({ members }: TeamProps) {
  return (
    <section id="team" className="team">
      <div className="container">
        <div className="section-title">
          <h2>Notre Équipe</h2>
          <p>Une équipe passionnée et dévouée à votre réussite</p>
        </div>

        <div className="row justify-content-center">
          {members.map((member, index) => (
            <div key={index} className="col-lg-2 col-md-4 col-sm-6">
              <div className="member">
                <div className="member-img">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="img-fluid rounded-circle"
                  />
                  <div className="social">
                    {member.socials.linkedin && (
                      <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-linkedin"></i>
                      </a>
                    )}
                  </div>
                </div>
                <div className="member-info text-center">
                  <h4>{member.name}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .team {
          padding: 60px 0;
          background: #f8f9fa;
        }

        .member {
          margin-bottom: 30px;
          transform: translateY(0);
          transition: all 0.3s ease;
        }

        .member:hover {
          transform: translateY(-5px);
        }

        .member-img {
          position: relative;
          width: 140px;
          height: 140px;
          margin: 0 auto;
          overflow: hidden;
          border: 4px solid white;
          box-shadow: 0 0 20px rgba(106, 27, 154, 0.1);
          border-radius: 50%;
        }

        .member-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .member:hover .member-img img {
          transform: scale(1.1);
        }

        .social {
          position: absolute;
          left: 0;
          bottom: -100%;
          width: 100%;
          height: 100%;
          background: rgba(106, 27, 154, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          border-radius: 50%;
        }

        .member:hover .social {
          bottom: 0;
        }

        .social a {
          color: white;
          font-size: 1.2rem;
          margin: 0 5px;
          transition: all 0.3s ease;
        }

        .social a:hover {
          transform: scale(1.2);
        }

        .member-info {
          padding: 15px 0;
        }

        .member-info h4 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--primary-color);
          margin: 10px 0 5px;
        }

        @media (max-width: 768px) {
          .member-img {
            width: 120px;
            height: 120px;
          }
        }
      `}</style>
    </section>
  );
} 