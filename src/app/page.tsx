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
      <FAQ />
      <Testimonials />
      <Team />
    </>
  );
}
