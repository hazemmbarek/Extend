'use client';

import { useEffect, useState } from 'react';
import SponsorshipTree from '@/components/SponsorshipTree';

export default function SponsorshipTreePage() {
  const [treeData, setTreeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/sponsorship-tree')
      .then(res => res.json())
      .then(data => {
        setTreeData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching tree data:', err);
        setError('Une erreur est survenue lors du chargement des données');
        setIsLoading(false);
      });
  }, []);

  return (
    <section className="sponsorship-tree-page">
      <div className="container">
        <div className="tree-container">
          {isLoading ? (
            <div className="loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : !treeData ? (
            <div className="alert alert-info" role="alert">
              Aucune donnée de parrainage disponible
            </div>
          ) : (
            <SponsorshipTree data={treeData} />
          )}
        </div>
      </div>

      <style jsx>{`
        .sponsorship-tree-page {
          padding: 120px 0 60px;
        }

        .tree-container {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading {
          text-align: center;
        }
      `}</style>
    </section>
  );
} 