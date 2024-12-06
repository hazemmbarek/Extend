export default function SettingsTab() {
  return (
    <div className="settings-tab">
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

      <style jsx>{`
        .settings-tab {
          padding: 20px;
        }

        .info-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .settings-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: white;
          color: #333;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .settings-btn:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
          transform: translateY(-2px);
        }

        .settings-btn.danger {
          border-color: #dc3545;
          color: #dc3545;
        }

        .settings-btn.danger:hover {
          background: #dc3545;
          color: white;
        }
      `}</style>
    </div>
  );
} 