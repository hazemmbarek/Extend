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
      <Hero />
      <About />
      <Values />
      <Stats />
      <Features />
      <AltFeatures />
      <Services />
      <Partners />
      <FAQ />
      <Testimonials />
      <Team members={teamMembers} />
    </>
  );
}
