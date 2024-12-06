'use client';

import { Hero } from "../components/sections/Hero";
import { About } from "../components/sections/About";
import { Values } from "../components/sections/Values";
import { Stats } from "../components/sections/Stats";
import { Features } from "../components/sections/Features";
import { AltFeatures } from "../components/sections/AltFeatures";
import { Services } from "../components/sections/Services";
import { FAQ } from "../components/sections/FAQ";
import { Testimonials } from "../components/sections/Testimonials";
import { Team } from "../components/sections/Team";
import { Partners } from "../components/sections/Partners";

const teamMembers = [
  {
    name: "Hazem Mbarek",
    image: "/assets/img/default-avatar.png",
    socials: {
      linkedin: "https://www.linkedin.com/in/hazem-mbarek-108280291/",
    }
  },
  {
    name: "Nour Chokri",
    image: "/assets/img/default-avatar.png",
    socials: {
      linkedin: "https://www.linkedin.com/in/nour-chokri-37100b32b/",
    }
  },
  {
    name: "Yassine Dridi",
    image: "/assets/img/default-avatar.png",
    socials: {
      linkedin: "",
    }
  },
  {
    name: "Mohamed Aziz Masmoudi",
    image: "/assets/img/default-avatar.png",
    socials: {
      linkedin: "https://www.linkedin.com/in/mohamed-aziz-masmoudi-238495265/",
    }
  },
  {
    name: "Asma Ben Elkadhi",
    image: "/assets/img/default-avatar.png",
    socials: {
      linkedin: "",
    }
  }
];

export default function Home() {
  return (
    <>
      <div className="bg-gradient-to-b from-purple-100 to-white">
        <Hero />
      </div>
      <div className="bg-purple-50">
        <About />
      </div>
      <div className="bg-gradient-to-r from-purple-200 to-purple-100">
        <Values />
        <Stats />
      </div>
      <Features />
      <div className="bg-purple-50/70">
        <AltFeatures />
      </div>
      <div className="bg-gradient-to-br from-purple-100 via-white to-purple-50">
        <Services />
      </div>
      <div className="bg-purple-50/50">
        <Partners />
      </div>
      <div className="bg-gradient-to-t from-purple-100/20 to-white">
        <FAQ />
        <Testimonials />
      </div>
      <div className="bg-purple-50/30">
        <Team members={teamMembers} />
      </div>
      <style jsx global>{`
        :root {
          --primary-color: #6D28D9;  /* Purple-700 */
          --primary-light: #7C3AED; /* Purple-600 */
          --primary-dark: #4C1D95;  /* Purple-900 */
        }

        .section-title h2 {
          color: var(--primary-dark);
        }

        .section-title p {
          color: var(--primary-light);
        }

        .feature-box {
          border: 1px solid #E9D5FF;
          transition: all 0.3s ease;
        }

        .feature-box:hover {
          border-color: var(--primary-light);
          box-shadow: 0 10px 30px -15px rgba(109, 40, 217, 0.3);
        }

        .service-item {
          background: linear-gradient(145deg, #ffffff, #F3E8FF);
          border: 1px solid #E9D5FF;
        }

        .service-item:hover {
          border-color: var(--primary-light);
          transform: translateY(-5px);
        }

        .stats-item {
          background: linear-gradient(145deg, #F3E8FF, #ffffff);
          border: 1px solid #E9D5FF;
        }

        .testimonial-item {
          background: linear-gradient(145deg, #ffffff, #F3E8FF);
          border: 1px solid #E9D5FF;
        }

        .card {
          background: linear-gradient(145deg, #ffffff, #F3E8FF);
          border: 1px solid #E9D5FF;
          transition: all 0.3s ease;
        }

        .card:hover {
          border-color: var(--primary-light);
          box-shadow: 0 10px 30px -15px rgba(109, 40, 217, 0.3);
        }
      `}</style>
    </>
  );
}
