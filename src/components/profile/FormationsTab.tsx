import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Formation } from '@/types/formation';

export default function FormationsTab() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'enrolled' | 'not_enrolled'>('all');

  useEffect(() => {
    let isMounted = true;

    const fetchFormations = async () => {
      try {
        const response = await fetch('/api/user-formations');
        
        if (!isMounted) return;

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des formations');
        }

        const data = await response.json();
        
        if (!isMounted) return;
        
        if (Array.isArray(data)) {
          setFormations(data);
        } else {
          throw new Error('Format de données invalide');
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFormations();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredFormations = formations.filter(f => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'enrolled') return f.is_enrolled;
    if (statusFilter === 'not_enrolled') return !f.is_enrolled;
    return true;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (formations.length === 0) {
    return (
      <div className="empty-state">
        <i className="bi bi-book"></i>
        <p>Vous n'avez pas encore de formations</p>
        <Link href="/formations" className="btn btn-primary">
          Découvrir nos formations
        </Link>
      </div>
    );
  }

  return (
    <div className="formations-container">
      <div className="filters-section">
        <div className="filter-group">
          <label>Afficher :</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">Toutes les formations</option>
            <option value="enrolled">Mes formations</option>
            <option value="not_enrolled">Formations disponibles</option>
          </select>
        </div>
      </div>

      <div className="formations-grid">
        {filteredFormations.map(formation => (
          <div key={formation.id} className="formation-card">
            <div className="formation-image">
              <img 
                src={formation.thumbnail_image || '/assets/img/default-formation.jpg'} 
                alt={formation.title}
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/assets/img/default-formation.jpg';
                }}
              />
              <div className="formation-status">
                <span className={`status-badge ${formation.status}`}>
                  {formation.status === 'pending' && 'En attente'}
                  {formation.status === 'in_progress' && 'En cours'}
                  {formation.status === 'completed' && 'Terminée'}
                </span>
              </div>
            </div>
            
            <div className="formation-content">
              <h3>{formation.title}</h3>
              <p className="formation-description">{formation.description}</p>
              
              <div className="formation-details">
                <div className="detail-item">
                  <i className="bi bi-calendar3"></i>
                  <span>Acheté le {formation.purchase_date ? new Date(formation.purchase_date).toLocaleDateString() : '-'}</span>
                </div>
                <div className="detail-item">
                  <i className="bi bi-tag"></i>
                  <span>{formation.category}</span>
                </div>
                <div className="detail-item">
                  <i className="bi bi-bar-chart"></i>
                  <span>{formation.level}</span>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-label">
                  <span>Progression</span>
                  <span>{formation.progress}%</span>
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ width: `${formation.progress}%` }}
                    aria-valuenow={formation.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>

              <div className="formation-actions">
                {formation.is_enrolled ? (
                  <>
                    <Link 
                      href={`/formations/${formation.id}`} 
                      className="btn btn-primary"
                    >
                      {formation.status === 'completed' ? 'Revoir' : 'Continuer'}
                    </Link>
                    {formation.progress === 100 && (
                      <Link 
                        href={`/formations/${formation.id}/certificate`}
                        className="btn btn-outline-success"
                      >
                        Certificat
                      </Link>
                    )}
                  </>
                ) : (
                  <Link 
                    href={`/formations/${formation.id}`} 
                    className="btn btn-primary"
                  >
                    S'inscrire
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .formations-container {
          padding: 0;
        }

        .filters-section {
          margin-bottom: 20px;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .filter-group select {
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        .formations-grid {
          display: grid;
          gap: 2rem;
        }

        .formation-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          gap: 20px;
        }

        .formation-image {
          width: 300px;
          height: 200px;
          position: relative;
          background: #f0f0f0;
          overflow: hidden;
        }

        .formation-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .formation-image:hover img {
          transform: scale(1.05);
        }

        .formation-image.default {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
        }

        .formation-image.default::after {
          content: '📚';
          font-size: 3rem;
          opacity: 0.5;
        }

        .formation-status {
          position: absolute;
          top: 10px;
          right: 10px;
        }

        .status-badge {
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          color: white;
        }

        .status-badge.pending {
          background: #ffc107;
        }

        .status-badge.in_progress {
          background: #17a2b8;
        }

        .status-badge.completed {
          background: #28a745;
        }

        .formation-content {
          flex: 1;
          padding: 20px;
        }

        .formation-description {
          color: #666;
          margin: 10px 0;
        }

        .formation-details {
          display: flex;
          gap: 20px;
          margin: 15px 0;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #666;
        }

        .progress-section {
          margin: 20px 0;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }

        .progress {
          height: 8px;
          background: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar {
          background: var(--primary-color);
          transition: width 0.3s ease;
        }

        .formation-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .formation-card {
            flex-direction: column;
          }

          .formation-image {
            width: 100%;
            height: 200px;
          }

          .formation-details {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
} 