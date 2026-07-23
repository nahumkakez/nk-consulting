import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { invoiceService } from '../services/invoiceService';
import api from '../services/api';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadInvoices(); }, []);

  const loadInvoices = async () => {
    try {
      const res = await invoiceService.getAll();
      setInvoices(res.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (id, number) => {
    try {
      const response = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture_${number}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('❌ Erreur lors du téléchargement du PDF');
    }
  };

  const downloadWord = async (id, number) => {
    try {
      const response = await api.get(`/invoices/${id}/word`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture_${number}.docx`;
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
    const map = {
      draft: { label: 'Brouillon', className: 'badge-draft' },
      sent: { label: 'Envoyée', className: 'badge-sent' },
      paid: { label: 'Payée', className: 'badge-paid' },
      overdue: { label: 'En retard', className: 'badge-overdue' }
    };
    const s = map[status] || map.draft;
    return <span className={`badge ${s.className}`}>{s.label}</span>;
  };

  if (loading) return <p>⏳ Chargement...</p>;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>📄 Factures</h1>
        <Link to="/create-invoice" className="btn-primary">➕ Nouvelle Facture</Link>
      </div>

      {invoices.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
          <h3>Aucune facture</h3>
          <p style={{ color: 'var(--text)' }}>Commencez par créer votre première facture</p>
          <Link to="/create-invoice" className="btn-primary" style={{ marginTop: '16px' }}>➕ Créer une facture</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {invoices.map((invoice) => (
            <div key={invoice.id} className="card">
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                gap: '12px',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{invoice.invoice_number}</div>
                  <div style={{ fontSize: '14px', color: 'var(--text)' }}>{invoice.client_name || 'Client non renseigné'}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text)' }}>Date</div>
                  <div>{new Date(invoice.issue_date).toLocaleDateString('fr-FR')}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text)' }}>Total TTC</div>
                  <div style={{ fontWeight: 'bold', color: 'var(--nk-green)' }}>
                    {parseFloat(invoice.total_ttc || 0).toFixed(2)} {invoice.currency || 'FC'}
                  </div>
                </div>
                <div>{getStatusBadge(invoice.status)}</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button onClick={() => downloadPDF(invoice.id, invoice.invoice_number)} className="btn-secondary" style={{ padding: '4px 12px', fontSize: '12px' }}>📄 PDF</button>
                  <button onClick={() => downloadWord(invoice.id, invoice.invoice_number)} className="btn-secondary" style={{ padding: '4px 12px', fontSize: '12px' }}>📝 Word</button>
                  <select
                    onChange={(e) => updateStatus(invoice.id, e.target.value)}
                    value={invoice.status}
                    className="form-control"
                    style={{ padding: '4px 8px', fontSize: '12px', width: '100px' }}
                  >
                    <option value="draft">Brouillon</option>
                    <option value="sent">Envoyer</option>
                    <option value="paid">Payée</option>
                    <option value="overdue">En retard</option>
                  </select>
                  <button onClick={() => deleteInvoice(invoice.id)} className="btn-danger" style={{ padding: '4px 8px', fontSize: '12px' }}>🗑️</button>
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