'use client';

import { useEffect } from 'react';

export const ScriptProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const loadScripts = async () => {
      try {
        // Bootstrap
        await import('bootstrap/dist/js/bootstrap.bundle.min.js');
        
        // AOS
        const AOS = await import('aos');
        AOS.init({
          duration: 800,
          easing: 'ease-in-out',
          once: true,
          mirror: false
        });

        // GLightbox
        const GLightbox = await import('glightbox');
        GLightbox.default();

        // PureCounter
        const PureCounter = await import('@srexi/purecounterjs');
        new PureCounter.default();

        // Main.js (depuis le dossier public)
        const script = document.createElement('script');
        script.src = '/assets/js/main.js';
        script.async = true;
        document.body.appendChild(script);

      } catch (error) {
        console.error('Error loading scripts:', error);
      }
    };

    loadScripts();
  }, []);

  return <>{children}</>;
}; 