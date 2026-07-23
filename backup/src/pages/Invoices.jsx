import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { invoiceService } from '../services/invoiceService';
import api from '../services/api';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const res = await invoiceService.getAll();
      setInvoices(res.data || []);
    } catch (error) {
      console.error('Erreur chargement factures:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (id, number) => {
    try {
      const response = await api.get(`/invoices/${id}/pdf`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `facture_${number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
    } catch (error) {
      alert('❌ Erreur lors du téléchargement du PDF');
    }
  };

  const downloadWord = async (id, number) => {
    try {
      const response = await api.get(`/invoices/${id}/word`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `facture_${number}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
    } catch (error) {
      alert('❌ Erreur lors du téléchargement du Word');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await invoiceService.updateStatus(id, status);
      loadInvoices();
      alert('✅ Statut mis à jour');
    } catch (error) {
      alert('❌ Erreur lors de la mise à jour');
    }
  };

  const deleteInvoice = async (id) => {
    if (window.confirm('Supprimer cette facture ?')) {
      try {
        await invoiceService.delete(id);
        loadInvoices();
        alert('✅ Facture supprimée');
      } catch (error) {
        alert('❌ Erreur lors de la suppression');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      draft: { label: 'Brouillon', color: '#f59f00' },
      sent: { label: 'Envoyée', color: '#339af0' },
      paid: { label: 'Payée', color: '#40c057' },
      overdue: { label: 'En retard', color: '#fa5252' }
    };
    const s = statusMap[status] || statusMap.draft;
    return (
      <span style={{
        background: s.color,
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase'
      }}>
        {s.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="card" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <p>⏳ Chargement des factures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>📄 Factures</h1>
        <Link to="/create-invoice" className="btn-primary">
          ➕ Nouvelle Facture
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
          <h3>Aucune facture</h3>
          <p style={{ color: 'var(--text)' }}>Commencez par créer votre première facture</p>
          <Link to="/create-invoice" className="btn-primary" style={{ marginTop: '16px' }}>
            ➕ Créer une facture
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {invoices.map((invoice) => (
            <div key={invoice.id} className="card" style={{ padding: '20px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                gap: '16px',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--text-h)' }}>
                    {invoice.invoice_number}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text)' }}>
                    {invoice.client_name || 'Client non renseigné'}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', color: 'var(--text)' }}>Date</div>
                  <div style={{ fontWeight: '500' }}>
                    {new Date(invoice.issue_date).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', color: 'var(--text)' }}>Total TTC</div>
                  <div style={{ fontWeight: 'bold', color: 'var(--nk-green)', fontSize: '16px' }}>
                    {parseFloat(invoice.total_ttc || 0).toFixed(2)} {invoice.currency || 'FC'}
                  </div>
                </div>
                <div>
                  {getStatusBadge(invoice.status)}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => downloadPDF(invoice.id, invoice.invoice_number)}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '13px' }}
                  >
                    📄 PDF
                  </button>
                  <button
                    onClick={() => downloadWord(invoice.id, invoice.invoice_number)}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '13px' }}
                  >
                    📝 Word
                  </button>
                  <select
                    onChange={(e) => updateStatus(invoice.id, e.target.value)}
                    value={invoice.status}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="draft">Brouillon</option>
                    <option value="sent">Envoyer</option>
                    <option value="paid">Payée</option>
                    <option value="overdue">En retard</option>
                  </select>
                  <button
                    onClick={() => deleteInvoice(invoice.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#fa5252',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '4px 8px'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Invoices;