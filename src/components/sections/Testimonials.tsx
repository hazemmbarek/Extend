'use client';

import { useState } from 'react';

export const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const testimonials = [
    {
      text: "La transparence du système de commissions et la qualité des formations m'ont permis de développer mon réseau efficacement.",
      author: "Ahmed Ben Salem",
      role: "Membre Premium",
      image: "/assets/img/testimonials/per1.jpg"
    },
    {
      text: "Le système de calcul des commissions est très transparent. J'apprécie particulièrement l'aspect caritatif avec la 6ème génération.",
      author: "Sarah Mansouri",
      role: "Membre Active",
      image: "/assets/img/testimonials/per2.jpg"
    },
    {
      text: "Une plateforme innovante qui allie formation de qualité et système de parrainage équitable. Les coupons de formation gratuits sont un vrai plus !",
      author: "Mohamed Karim",
      role: "Membre Expert",
      image: "/assets/img/testimonials/per3.jpg"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="testimonials section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Témoignages</h2>
        <p>Ce que nos membres disent d'EXTEND</p>
      </div>

      <div className="container">
        <div className="testimonials-slider position-relative">
          <div className="testimonials-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-item">
                <div className="stars mb-4">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="bi bi-star-fill"></i>
                  ))}
                </div>
                <p className="testimonial-text mb-4">{testimonial.text}</p>
                <div className="profile mt-auto">
                  <img src={testimonial.image} className="testimonial-img rounded-circle mb-3" alt="" />
                  <h4>{testimonial.author}</h4>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
          
          <button className="slider-btn prev" onClick={prevSlide}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button className="slider-btn next" onClick={nextSlide}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <style jsx>{`
        .testimonials-slider {
          overflow: hidden;
          padding: 0 50px;
        }

        .testimonials-wrapper {
          display: flex;
          transition: transform 0.5s ease;
        }

        .testimonial-item {
          flex: 0 0 100%;
          padding: 2rem;
          text-align: center;
        }

        .slider-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: var(--primary-color);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .slider-btn:hover {
          background: var(--primary-dark);
        }

        .slider-btn.prev {
          left: 0;
        }

        .slider-btn.next {
          right: 0;
        }

        @media (min-width: 768px) {
          .testimonials-wrapper {
            gap: 2rem;
          }

          .testimonial-item {
            flex: 0 0 calc(50% - 1rem);
          }
        }
      `}</style>
    </section>
  );
}; 