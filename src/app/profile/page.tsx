'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import './profile.css';
import { useSearchParams, useRouter } from 'next/navigation';
import CommissionsTab from '@/components/profile/CommissionsTab';
import FormationsTab from '@/components/profile/FormationsTab';
import { FormationsProvider } from '@/contexts/FormationsContext';
import DeleteAccountModal from '@/components/profile/DeleteAccountModal';
import UpdateProfileModal from '@/components/profile/UpdateProfileModal';

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
  const router = useRouter();

  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [summary, setSummary] = useState<CommissionSummary | null>(null);
  const [loadingCommissions, setLoadingCommissions] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

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
      await handleProfileUpdate(profile?.phone_number || '', file);
    } catch (error) {
      console.error('Error updating profile picture:', error);
      alert('Failed to update profile picture');
    }
  };

  const handlePasswordChange = () => {
    router.push('/forgot-password');
  };

  const handleProfileUpdate = async (phone: string, image: File | null) => {
    try {
      let newProfilePicture = profile?.profile_picture;

      // Handle image upload first if there's a new image
      if (image) {
        const formData = new FormData();
        formData.append('file', image);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        newProfilePicture = uploadData.url;
      }

      // Update profile data
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phone,
          profile_picture: newProfilePicture,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);

      // Show success message (you can add a toast notification here)
      alert('Profile updated successfully');

    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
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
              <img
                src={profile.profile_picture || '/assets/img/default-avatar.png'}
                alt={profile.username}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/assets/img/default-avatar.png';
                }}
              />
            </div>
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
                    src={profile.qr_code || '/assets/img/default-qr.png'} 
                    alt="Code QR de parrainage" 
                    className="qr-code-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/assets/img/default-qr.png';
                    }}
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
              <FormationsProvider>
                <FormationsTab />
              </FormationsProvider>
            </div>
          </div>
        )}

        {activeTab === 'commissions' && (
          <div className="profile-section">
            <div className="info-card">
              <h2>Mes Commissions</h2>
              <CommissionsTab />
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="profile-section">
            <div className="info-card">
              <h2>Paramètres</h2>
              <div className="settings-grid">
                <button 
                  className="settings-btn"
                  onClick={handlePasswordChange}
                >
                  <i className="bi bi-shield-lock"></i>
                  Changer le mot de passe
                </button>
                <button 
                  className="settings-btn"
                  onClick={() => setIsUpdateModalOpen(true)}
                >
                  <i className="bi bi-person-gear"></i>
                  Modifier le profil
                </button>
                <button 
                  className="settings-btn danger"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <i className="bi bi-trash"></i>
                  Supprimer le compte
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <DeleteAccountModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      <UpdateProfileModal 
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        currentPhone={profile?.phone_number || ''}
        currentImage={profile?.profile_picture || '/assets/img/default-avatar.png'}
        onUpdate={handleProfileUpdate}
      />

      <style jsx>{`
        .profile-section .info-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .profile-section .info-card h2 {
          color: var(--primary-color);
          margin-bottom: 25px;
          font-size: 1.5rem;
        }

        /* Styles spécifiques pour l'onglet des commissions */
        .profile-section .info-card :global(.commissions-container) {
          padding: 0;
        }

        .profile-section .info-card :global(.summary-grid) {
          margin-top: 20px;
        }

        .profile-section .info-card :global(.filters-section) {
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
} 