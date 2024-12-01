import { useEffect, useState } from 'react';
import { Commission, CommissionSummary } from '@/types/commission';
import { COMMISSION_RATES } from '@/services/commissionService';

export default function CommissionsTab() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [summary, setSummary] = useState<CommissionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'all' | 'month' | 'quarter' | 'year'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid'>('all');

  // Fonction pour filtrer les commissions
  const filterCommissions = (commissions: Commission[]) => {
    let filtered = [...commissions];

    // Filtre par date
    if (dateRange !== 'all') {
      const now = new Date();
      const startDate = new Date();
      switch (dateRange) {
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      filtered = filtered.filter(c => new Date(c.date) >= startDate);
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    return filtered;
  };

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
            totalCaritative: 0,
            totalPending: 0,
            totalPaid: 0,
            byGeneration: {},
            byPeriod: {}
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

  const filteredCommissions = filterCommissions(commissions);

  return (
    <div className="commissions-container">
      <div className="filters-section">
        <div className="filter-group">
          <label>Période :</label>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value as any)}
          >
            <option value="all">Toutes les périodes</option>
            <option value="month">Dernier mois</option>
            <option value="quarter">Dernier trimestre</option>
            <option value="year">Dernière année</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Statut :</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="paid">Payées</option>
          </select>
        </div>
      </div>

      {/* Résumé des commissions */}
      <div className="commission-summary">
        <h3>Résumé des Commissions</h3>
        <div className="summary-grid">
          <div className="summary-card">
            <h4>Total Brut</h4>
            <p>{(summary?.totalCommissions || 0).toFixed(3)} TND</p>
          </div>
          <div className="summary-card">
            <h4>En attente</h4>
            <p>{(summary?.totalPending || 0).toFixed(3)} TND</p>
          </div>
          <div className="summary-card">
            <h4>Payées</h4>
            <p>{(summary?.totalPaid || 0).toFixed(3)} TND</p>
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
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Formation</th>
                <th>De</th>
                <th>Génération</th>
                <th>Montant Base</th>
                <th>Commission</th>
                <th>TVA</th>
                <th>Retenue</th>
                <th>Net</th>
                <th>Statut</th>
                <th>Date Paiement</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommissions.map(comm => (
                <tr key={comm.id} className={`${comm.isCaritative ? 'caritative-row' : ''} status-${comm.status}`}>
                  <td>{new Date(comm.date).toLocaleDateString()}</td>
                  <td>{comm.trainingName}</td>
                  <td>{comm.fromUser}</td>
                  <td>{comm.generation}</td>
                  <td>{comm.baseAmount.toFixed(3)} TND</td>
                  <td>{comm.amount.toFixed(3)} TND</td>
                  <td>{comm.tva.toFixed(3)} TND</td>
                  <td>{comm.retenueSurce.toFixed(3)} TND</td>
                  <td>{comm.finalAmount.toFixed(3)} TND</td>
                  <td>
                    <span className={`status-badge ${comm.status}`}>
                      {comm.status === 'pending' ? 'En attente' : 
                       comm.status === 'paid' ? 'Payée' : 'Échouée'}
                    </span>
                  </td>
                  <td>{comm.payment_date ? new Date(comm.payment_date).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

        .filters-section {
          display: flex;
          gap: 20px;
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

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-badge.pending {
          background: #ffc107;
          color: #000;
        }

        .status-badge.paid {
          background: #4CAF50;
          color: white;
        }

        .status-badge.failed {
          background: #f44336;
          color: white;
        }

        .status-pending {
          background-color: rgba(255, 193, 7, 0.1);
        }

        .status-paid {
          background-color: rgba(76, 175, 80, 0.1);
        }

        .status-failed {
          background-color: rgba(244, 67, 54, 0.1);
        }
      `}</style>
    </div>
  );
} 