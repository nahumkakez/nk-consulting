import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientService, productService, invoiceService } from '../services/invoiceService';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    client_id: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{ description: '', quantity: 1, unit_price_ht: 0, tva_rate: 20 }],
    notes: '',
    currency: 'FC'
  });

  const [totals, setTotals] = useState({ total_ht: 0, total_tva: 0, total_ttc: 0 });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const res = await clientService.getAll();
      setClients(res.data || []);
    } catch (error) {
      console.error('Erreur chargement clients:', error);
    }
  };

  const calculateTotals = (items) => {
    let total_ht = 0, total_tva = 0, total_ttc = 0;
    items.forEach(item => {
      const item_ht = item.quantity * item.unit_price_ht;
      const item_tva = item_ht * (item.tva_rate / 100);
      total_ht += item_ht;
      total_tva += item_tva;
      total_ttc += item_ht + item_tva;
    });
    return { total_ht, total_tva, total_ttc };
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
    setTotals(calculateTotals(newItems));
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unit_price_ht: 0, tva_rate: 20 }]
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
      setTotals(calculateTotals(newItems));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const invoiceData = {
        client_id: parseInt(formData.client_id),
        issue_date: formData.issue_date,
        due_date: formData.due_date,
        currency: formData.currency,
        items: formData.items.map(item => ({
          description: item.description || 'Service',
          quantity: parseInt(item.quantity),
          unit_price_ht: parseFloat(item.unit_price_ht),
          tva_rate: parseFloat(item.tva_rate)
        })),
        notes: formData.notes
      };

      await invoiceService.create(invoiceData);
      alert(`✅ Facture créée avec succès en ${formData.currency} !`);
      navigate('/invoices');
    } catch (error) {
      alert('❌ Erreur lors de la création de la facture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>📄 Nouvelle Facture</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Client *</label>
              <select
                className="form-control"
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                required
              >
                <option value="">Sélectionner un client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Devise</label>
              <select
                className="form-control"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <option value="FC">🇨🇩 Franc Congolais (FC)</option>
                <option value="USD">🇺🇸 Dollar US (USD)</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date d'émission</label>
              <input
                type="date"
                className="form-control"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date d'échéance</label>
              <input
                type="date"
                className="form-control"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
          </div>

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Lignes de facture</h3>

          {formData.items.map((item, index) => (
            <div key={index} className="form-row" style={{ alignItems: 'center', marginBottom: '8px' }}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Qté"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Prix HT"
                  value={item.unit_price_ht}
                  onChange={(e) => handleItemChange(index, 'unit_price_ht', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder="TVA %"
                  value={item.tva_rate}
                  onChange={(e) => handleItemChange(index, 'tva_rate', parseFloat(e.target.value) || 0)}
                />
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="btn-danger"
                style={{ padding: '8px 12px', marginTop: '4px' }}
              >
                ✕
              </button>
            </div>
          ))}

          <button type="button" className="btn-secondary" onClick={addItem} style={{ marginBottom: '24px' }}>
            + Ajouter une ligne
          </button>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '16px',
            padding: '16px',
            background: 'var(--nk-gray-100)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text)' }}>Total HT</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totals.total_ht.toFixed(2)} {formData.currency}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text)' }}>TVA</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totals.total_tva.toFixed(2)} {formData.currency}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text)' }}>Total TTC</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--nk-green)' }}>{totals.total_ttc.toFixed(2)} {formData.currency}</div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes (optionnel)</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Informations complémentaires..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={() => navigate('/invoices')}>
              Annuler
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Création...' : 'Créer la facture'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;