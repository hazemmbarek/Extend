'use client';

import { useEffect, useState } from 'react';

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

export default function OverviewTab() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching profile:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (!profile) return <div>Erreur de chargement du profil</div>;

  return (
    <div className="overview-tab">
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
          <h3>Code QR de parrainage</h3>
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

      <style jsx>{`
        .overview-tab {
          padding: 20px;
        }

        .info-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 25px;
          margin-bottom: 30px;
        }

        .info-item label {
          display: block;
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 8px;
        }

        .info-item p {
          color: #333;
          font-weight: 500;
          font-size: 1.1rem;
        }

        .referral-code {
          font-family: monospace;
          background: #f8f9fa;
          padding: 5px 10px;
          border-radius: 5px;
        }

        .qr-code-section {
          border-top: 1px solid #eee;
          padding-top: 30px;
        }

        .qr-code-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          margin-top: 20px;
        }

        .qr-code-image {
          width: 200px;
          height: 200px;
          padding: 10px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .referral-code-display {
          font-family: monospace;
          font-size: 1.2rem;
          color: var(--primary-color);
          background: #f8f9fa;
          padding: 8px 16px;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
} 