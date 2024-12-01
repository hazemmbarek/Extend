import { useEffect, useState } from 'react';
import { Commission, CommissionSummary } from '@/types/commission';
import { COMMISSION_RATES } from '@/services/commissionService';

export default function CommissionsTab() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [summary, setSummary] = useState<CommissionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/commissions')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setCommissions(data.commissions || []);
          setSummary(data.summary || {
            totalCommissions: 0,
            totalTVA: 0,
            totalRetenue: 0,
            netAmount: 0,
            byGeneration: {}
          });
        }
      })
      .catch(err => {
        console.error('Error fetching commissions:', err);
        setError('Une erreur est survenue lors du chargement des données');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

  return (
    <div className="commissions-container">
      <div className="commission-summary">
        <h3>Résumé des Commissions</h3>
        <div className="summary-grid">
          <div className="summary-card">
            <h4>Total Brut</h4>
            <p>{(summary?.totalCommissions || 0).toFixed(2)}€</p>
          </div>
          <div className="summary-card">
            <h4>TVA (19%)</h4>
            <p>{(summary?.totalTVA || 0).toFixed(2)}€</p>
          </div>
          <div className="summary-card">
            <h4>Retenue (10%)</h4>
            <p>{(summary?.totalRetenue || 0).toFixed(2)}€</p>
          </div>
          <div className="summary-card total">
            <h4>Net à percevoir</h4>
            <p>{(summary?.netAmount || 0).toFixed(2)}€</p>
          </div>
          {summary?.totalCaritative > 0 && (
            <div className="summary-card caritative">
              <h4>Dons caritatifs (6ème gén.)</h4>
              <p>{summary.totalCaritative.toFixed(2)}€</p>
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
                <p>Total: {data.total.toFixed(2)}€</p>
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
                    <td>{comm.baseAmount.toFixed(2)}€</td>
                    <td>{(comm.rate * 100).toFixed(0)}%</td>
                    <td>{comm.amount.toFixed(2)}€</td>
                    <td>{comm.tva.toFixed(2)}€</td>
                    <td>{comm.retenueSurce.toFixed(2)}€</td>
                    <td>{comm.finalAmount.toFixed(2)}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-state">Aucun historique de commission disponible</p>
          )}
        </div>
      </div>

      <style jsx>{`
        .commissions-container {
          padding: 20px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .summary-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .summary-card.total {
          background: #4CAF50;
          color: white;
        }

        .generation-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .generation-card {
          background: white;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
        }

        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        th {
          background: #f5f5f5;
          font-weight: 600;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
        }

        .error-container {
          padding: 20px;
        }

        .empty-state {
          text-align: center;
          padding: 20px;
          color: #666;
          font-style: italic;
        }

        .caritative {
          background: #f8d7da !important;
          border-color: #f5c2c7;
        }

        .caritative-badge {
          display: inline-block;
          padding: 2px 8px;
          background: #dc3545;
          color: white;
          border-radius: 12px;
          font-size: 0.8rem;
          margin-top: 5px;
        }

        .caritative-row {
          background-color: rgba(248, 215, 218, 0.2);
        }

        .summary-card.caritative {
          background: #dc3545;
          color: white;
        }
      `}</style>
    </div>
  );
} 