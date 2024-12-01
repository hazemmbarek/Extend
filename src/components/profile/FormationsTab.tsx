export default function FormationsTab() {
  return (
    <div className="formations-tab">
      <div className="info-card">
        <h2>Mes Formations</h2>
        <p className="empty-state">
          <i className="bi bi-book"></i>
          Vous n'avez pas encore de formations
        </p>
      </div>

      <style jsx>{`
        .formations-tab {
          padding: 20px;
        }

        .info-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
        }

        .empty-state {
          text-align: center;
          padding: 50px 20px;
          color: #666;
        }

        .empty-state i {
          display: block;
          font-size: 48px;
          margin-bottom: 15px;
          color: var(--primary-color);
        }
      `}</style>
    </div>
  );
} 