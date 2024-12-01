'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import './profile.css';
import { useSearchParams } from 'next/navigation';

interface UserProfile {
  username: string;
  email: string;
  phone_number: string;
  referral_code: string;
  created_at: string;
  total_formations: number;
  total_commissions: number;
  profile_picture: string | null;
  qr_code: string;
}

interface Commission {
  id: number;
  trainingName: string;
  fromUser: string;
  generation: number;
  date: string;
  baseAmount: number;
  rate: number;
  amount: number;
  tva: number;
  retenueSurce: number;
  finalAmount: number;
  isCaritative: boolean;
}

interface CommissionSummary {
  totalCommissions: number;
  totalTVA: number;
  totalRetenue: number;
  netAmount: number;
  totalCaritative: number;
  byGeneration: {
    [key: number]: {
      count: number;
      total: number;
      rate: number;
      isCaritative: boolean;
    }
  };
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const searchParams = useSearchParams();

  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [summary, setSummary] = useState<CommissionSummary | null>(null);
  const [loadingCommissions, setLoadingCommissions] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'formations', 'commissions', 'settings'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'commissions') {
      setLoadingCommissions(true);
      fetch('/api/commissions')
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            console.error('Error:', data.error);
          } else {
            setCommissions(data.commissions || []);
            setSummary(data.summary || {
              totalCommissions: 0,
              totalTVA: 0,
              totalRetenue: 0,
              netAmount: 0,
              totalCaritative: 0,
              byGeneration: {}
            });
          }
        })
        .catch(err => {
          console.error('Error fetching commissions:', err);
        })
        .finally(() => {
          setLoadingCommissions(false);
        });
    }
  }, [activeTab]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        // Refresh profile data to get new image
        const profileResponse = await fetch('/api/profile');
        const data = await profileResponse.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!profile) {
    return <div className="error-message">Erreur de chargement du profil</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-cover">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              {profile.profile_picture ? (
                <img
                  src={profile.profile_picture}
                  alt={profile.username}
                  width={200}
                  height={200}
                />
              ) : (
                <img
                  src="/assets/img/default-avatar.png"
                  alt="Default avatar"
                  width={200}
                  height={200}
                />
              )}
            </div>
            <label htmlFor="avatar-upload" className="edit-avatar-btn">
              <i className="bi bi-pencil-fill"></i>
            </label>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>
        <div className="profile-info">
          <h1>{profile.username}</h1>
          <p className="profile-email">{profile.email}</p>
          <div className="profile-stats">
            <div className="stat-card">
              <i className="bi bi-book"></i>
              <div className="stat-content">
                <span className="stat-value">{profile.total_formations}</span>
                <span className="stat-label">Formations</span>
              </div>
            </div>
            <div className="stat-card">
              <i className="bi bi-cash"></i>
              <div className="stat-content">
                <span className="stat-value">{profile.total_commissions} DT</span>
                <span className="stat-label">Commissions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-nav">
        <button
          className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="bi bi-person"></i>
          Vue d'ensemble
        </button>
        <button
          className={`nav-item ${activeTab === 'formations' ? 'active' : ''}`}
          onClick={() => setActiveTab('formations')}
        >
          <i className="bi bi-book"></i>
          Mes Formations
        </button>
        <button
          className={`nav-item ${activeTab === 'commissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('commissions')}
        >
          <i className="bi bi-cash"></i>
          Mes Commissions
        </button>
        <button
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <i className="bi bi-gear"></i>
          Paramètres
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'overview' && (
          <div className="profile-section">
            <div className="info-card">
              <h2>Informations Personnelles</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Nom d'utilisateur</label>
                  <p>{profile.username}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{profile.email}</p>
                </div>
                <div className="info-item">
                  <label>Téléphone</label>
                  <p>{profile.phone_number}</p>
                </div>
                <div className="info-item">
                  <label>Code de parrainage</label>
                  <p className="referral-code">{profile.referral_code}</p>
                </div>
                <div className="info-item">
                  <label>Membre depuis</label>
                  <p>{new Date(profile.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="qr-code-section">
                <h3>Code de parrainage QR</h3>
                <div className="qr-code-container">
                  <img 
                    src={profile.qr_code} 
                    alt="Code QR de parrainage" 
                    className="qr-code-image"
                  />
                  <p className="referral-code-display">
                    Code: {profile.referral_code}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'formations' && (
          <div className="profile-section">
            <div className="info-card">
              <h2>Mes Formations</h2>
              <p className="empty-state">
                <i className="bi bi-book"></i>
                Vous n'avez pas encore de formations
              </p>
            </div>
          </div>
        )}

        {activeTab === 'commissions' && (
          <div className="profile-section">
            <div className="info-card">
              <h2>Mes Commissions</h2>
              
              {loadingCommissions ? (
                <div className="loading-container">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </div>
              ) : (
                <div className="commission-summary">
                  <div className="summary-grid">
                    <div className="summary-card">
                      <h4>Total Brut</h4>
                      <p>{(summary?.totalCommissions || 0).toFixed(3)} TND</p>
                    </div>
                    <div className="summary-card">
                      <h4>TVA (19%)</h4>
                      <p>{(summary?.totalTVA || 0).toFixed(3)} TND</p>
                    </div>
                    <div className="summary-card">
                      <h4>Retenue (10%)</h4>
                      <p>{(summary?.totalRetenue || 0).toFixed(3)} TND</p>
                    </div>
                    <div className="summary-card total">
                      <h4>Net à percevoir</h4>
                      <p>{(summary?.netAmount || 0).toFixed(3)} TND</p>
                    </div>
                    {summary?.totalCaritative > 0 && (
                      <div className="summary-card caritative">
                        <h4>Dons caritatifs (6ème gén.)</h4>
                        <p>{summary.totalCaritative.toFixed(3)} TND</p>
                      </div>
                    )}
                  </div>

                  <div className="generation-details">
                    <h3>Détails par Génération</h3>
                    <div className="generation-grid">
                      {summary && Object.entries(summary.byGeneration).map(([gen, data]) => (
                        <div key={gen} className={`generation-card ${data.isCaritative ? 'caritative' : ''}`}>
                          <h4>Génération {gen}</h4>
                          <p>Taux: {data.rate}%</p>
                          <p>Nombre: {data.count}</p>
                          <p>Total: {data.total.toFixed(3)} TND</p>
                          {data.isCaritative && (
                            <span className="caritative-badge">Caritatif</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="commissions-list">
                    <h3>Historique des Commissions</h3>
                    {commissions.length > 0 ? (
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Formation</th>
                            <th>De</th>
                            <th>Génération</th>
                            <th>Montant Base</th>
                            <th>Taux</th>
                            <th>Commission</th>
                            <th>TVA</th>
                            <th>Retenue</th>
                            <th>Net</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commissions.map(comm => (
                            <tr key={comm.id} className={comm.isCaritative ? 'caritative-row' : ''}>
                              <td>{new Date(comm.date).toLocaleDateString()}</td>
                              <td>{comm.trainingName}</td>
                              <td>{comm.fromUser}</td>
                              <td>{comm.generation}</td>
                              <td>{comm.baseAmount.toFixed(3)} TND</td>
                              <td>{(comm.rate * 100).toFixed(0)}%</td>
                              <td>{comm.amount.toFixed(3)} TND</td>
                              <td>{comm.tva.toFixed(3)} TND</td>
                              <td>{comm.retenueSurce.toFixed(3)} TND</td>
                              <td>{comm.finalAmount.toFixed(3)} TND</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="empty-state">
                        <i className="bi bi-cash"></i>
                        Aucun historique de commission disponible
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="profile-section">
            <div className="info-card">
              <h2>Paramètres</h2>
              <div className="settings-grid">
                <button className="settings-btn">
                  <i className="bi bi-shield-lock"></i>
                  Changer le mot de passe
                </button>
                <button className="settings-btn">
                  <i className="bi bi-person-gear"></i>
                  Modifier le profil
                </button>
                <button className="settings-btn danger">
                  <i className="bi bi-trash"></i>
                  Supprimer le compte
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 