'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import './formations.css';

interface Formation {
  id: number;
  title: string;
  description: string;
  price: number;
  start_date: string;
  end_date: string;
  location: string;
  duration_hours: number;
  max_participants: number;
  current_participants: number;
  category: string;
  level: string;
  status: string;
  thumbnail_image: string | null;
}

export default function Formations() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const formationsPerPage = 6;

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await fetch('/api/formations');
        const data = await response.json();
        setFormations(data);
      } catch (error) {
        console.error('Error fetching formations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  const handleFilter = (filter: string) => {
    setActiveFilter(filter);
    const formationItems = document.querySelectorAll('.formation-item');

    formationItems.forEach(item => {
      const element = item as HTMLElement;
      if (filter === 'all') {
        element.style.display = 'block';
        setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'scale(1)';
        }, 100);
      } else {
        if (item.classList.contains(filter)) {
          element.style.display = 'block';
          setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
          }, 100);
        } else {
          element.style.opacity = '0';
          element.style.transform = 'scale(0.8)';
          setTimeout(() => {
            element.style.display = 'none';
          }, 300);
        }
      }
    });
  };

  // Get current formations
  const indexOfLastFormation = currentPage * formationsPerPage;
  const indexOfFirstFormation = indexOfLastFormation - formationsPerPage;
  const currentFormations = formations.slice(indexOfFirstFormation, indexOfLastFormation);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(formations.length / formationsPerPage);

  return (
    <>
      <section className="formations-header">
        <div className="container">
          <h1>Catalogue des Formations</h1>
          <br />
          <br />
        </div>
      </section>

      <section className="formations-section">
        <div className="container">
          <div className="formations-filters text-center">
            <button 
              className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilter('all')}
            >
              Toutes
            </button>
            <button 
              className={`filter-button ${activeFilter === 'CAT1' ? 'active' : ''}`}
              onClick={() => handleFilter('CAT1')}
            >
              Développement Personnel
            </button>
            <button 
              className={`filter-button ${activeFilter === 'CAT2' ? 'active' : ''}`}
              onClick={() => handleFilter('CAT2')}
            >
              Leadership
            </button>
            <button 
              className={`filter-button ${activeFilter === 'CAT3' ? 'active' : ''}`}
              onClick={() => handleFilter('CAT3')}
            >
              Vente
            </button>
          </div>

          <div className="row">
            {loading ? (
              <div className="text-center">Chargement...</div>
            ) : (
              currentFormations.map((formation) => (
                <div key={formation.id} className={`col-lg-4 col-md-6 formation-item ${formation.category}`}>
                  <div className="formation-card">
                    <div className="formation-img">
                      <img 
                        src={formation.category === 'CAT1' ? '/assets/img/form4.png' : 
                             formation.category === 'CAT2' ? '/assets/img/form5.jpg' : 
                             '/assets/img/form6.jpg'}
                        alt={formation.title}
                        style={{ 
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover'
                        }}
                      />
                      <div className="formation-badge">{formation.status}</div>
                    </div>
                    <div className="formation-content">
                      <div className="formation-category">
                        {formation.category === 'CAT1' ? 'Développement Personnel' :
                         formation.category === 'CAT2' ? 'Leadership' : 'Vente'}
                      </div>
                      <h3>{formation.title}</h3>
                      <div className="formation-details">
                        <ul>
                          <li><i className="bi bi-clock"></i> {formation.duration_hours}h de contenu</li>
                          <li><i className="bi bi-person-check"></i> {formation.current_participants}/{formation.max_participants} participants</li>
                          <li><i className="bi bi-calendar"></i> Début: {new Date(formation.start_date).toLocaleDateString()}</li>
                          <li><i className="bi bi-geo-alt"></i> {formation.location}</li>
                          <li><i className="bi bi-mortarboard"></i> Niveau: {formation.level}</li>
                        </ul>
                      </div>
                      <div className="formation-footer">
                        <div className="price">{formation.price} DT</div>
                        <Link href={`/formations/${formation.id}`} className="btn-details">
                          Voir le détail
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && (
            <div className="pagination-container text-center mt-4">
              <div className="pagination">
                <button 
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  &laquo;
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button 
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  &raquo;
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
} 