import type { Metadata } from "next";
import Header from "../components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScriptProvider } from "../components/providers/ScriptProvider";
import Script from 'next/script';

// CSS imports
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import "glightbox/dist/css/glightbox.min.css";
import "swiper/css/bundle";
import "/public/assets/css/main.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "EXTEND - Plateforme MLM de Formation",
  description: "Plateforme web de gestion de marketing multiniveau (MLM) axée sur la promotion de formations",
  keywords: "MLM, formation, marketing multiniveau, parrainage",
  icons: {
    icon: '/assets/img/favicon.png',
    apple: '/assets/img/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <Script src="https://d3js.org/d3.v7.min.js" />
      </head>
      <body className="index-page">
        <div id="preloader"></div>
        <ScriptProvider>
          <Header />
          <main className="main">{children}</main>
          <Footer />
          <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center">
            <i className="bi bi-arrow-up-short"></i>
          </a>
        </ScriptProvider>
      </body>
    </html>
  );
}
