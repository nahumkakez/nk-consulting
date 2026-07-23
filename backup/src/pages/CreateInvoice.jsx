import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { clientService, productService, invoiceService } from '../services/invoiceService';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    client_id: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
    items: [{ product_id: '', description: '', quantity: 1, unit_price_ht: 0, tva_rate: 20 }],
    notes: '',
    currency: 'FC'
  });

  const [totals, setTotals] = useState({ total_ht: 0, total_tva: 0, total_ttc: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [clientsRes, productsRes] = await Promise.all([
        clientService.getAll(),
        productService.getAll()
      ]);
      setClients(clientsRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    }
  };

  const calculateTotals = (items) => {
    let total_ht = 0;
    let total_tva = 0;
    let total_ttc = 0;

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
      items: [...formData.items, { product_id: '', description: '', quantity: 1, unit_price_ht: 0, tva_rate: 20 }]
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
          product_id: item.product_id || null,
          description: item.description || 'Service',
          quantity: parseInt(item.quantity),
          unit_price_ht: parseFloat(item.unit_price_ht),
          tva_rate: parseFloat(item.tva_rate)
        })),
        notes: formData.notes
      };

      await invoiceService.create(invoiceData);
      alert(`✅ Facture créée avec succès en ${formData.currency} !`);
      navigate('/dashboard');

    } catch (error) {
      console.error('Erreur création facture:', error);
      alert('❌ Erreur lors de la création de la facture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in" style={{ padding: '20px' }}>
      <div className="card" style={{ maxWidth: '800px', width: '100%' }}>
        <h2 style={{ marginBottom: '8px' }}>Nouvelle Facture</h2>
        <p style={{ color: 'var(--text)', marginBottom: '24px' }}>
          Créer une facture professionnelle
        </p>

        <form onSubmit={handleSubmit}>
          {/* Informations générales */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
                Client *
              </label>
              <select
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '15px',
                  background: 'var(--bg)',
                  color: 'var(--text-h)'
                }}
              >
                <option value="">Sélectionner un client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
                Date d'émission
              </label>
              <input
                type="date"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '15px',
                  background: 'var(--bg)',
                  color: 'var(--text-h)'
                }}
              />
            </div>
          </div>

          {/* Devise */}
          <div style={{ textAlign: 'left', marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
              Devise *
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '15px',
                background: 'var(--bg)',
                color: 'var(--text-h)'
              }}
            >
              <option value="FC">🇨🇩 Franc Congolais (FC)</option>
              <option value="USD">🇺🇸 Dollar US (USD)</option>
            </select>
          </div>

          {/* Lignes de facture */}
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', textAlign: 'left' }}>Lignes de facture</h3>
            
            {formData.items.map((item, index) => (
              <div key={index} style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                gap: '12px',
                marginBottom: '12px',
                padding: '12px',
                background: 'var(--nk-gray)',
                borderRadius: '8px',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  style={{
                    padding: '8px',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    fontSize: '14px',
                    background: 'var(--bg)',
                    color: 'var(--text-h)'
                  }}
                />
                <input
                  type="number"
                  placeholder="Qté"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                  style={{
                    padding: '8px',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    fontSize: '14px',
                    width: '100%',
                    background: 'var(--bg)',
                    color: 'var(--text-h)'
                  }}
                />
                <input
                  type="number"
                  placeholder="Prix HT"
                  value={item.unit_price_ht}
                  onChange={(e) => handleItemChange(index, 'unit_price_ht', parseFloat(e.target.value) || 0)}
                  style={{
                    padding: '8px',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    fontSize: '14px',
                    width: '100%',
                    background: 'var(--bg)',
                    color: 'var(--text-h)'
                  }}
                />
                <input
                  type="number"
                  placeholder="TVA %"
                  value={item.tva_rate}
                  onChange={(e) => handleItemChange(index, 'tva_rate', parseFloat(e.target.value) || 0)}
                  style={{
                    padding: '8px',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    fontSize: '14px',
                    width: '100%',
                    background: 'var(--bg)',
                    color: 'var(--text-h)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#d32f2f',
                    fontSize: '20px',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              style={{
                background: 'transparent',
                border: '2px dashed var(--border)',
                padding: '8px',
                borderRadius: '8px',
                width: '100%',
                cursor: 'pointer',
                color: 'var(--text)',
                fontSize: '14px'
              }}
            >
              + Ajouter une ligne
            </button>
          </div>

          {/* Totaux */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '16px',
            marginBottom: '24px',
            padding: '16px',
            background: 'var(--nk-gray)',
            borderRadius: '8px'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text)' }}>Total HT</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-h)' }}>
                {totals.total_ht.toFixed(2)} {formData.currency}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text)' }}>TVA</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-h)' }}>
                {totals.total_tva.toFixed(2)} {formData.currency}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text)' }}>Total TTC</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--nk-green)' }}>
                {totals.total_ttc.toFixed(2)} {formData.currency}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '24px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
              Notes (optionnel)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '15px',
                background: 'var(--bg)',
                color: 'var(--text-h)'
              }}
              placeholder="Informations complémentaires..."
            />
          </div>

          {/* Boutons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer la facture'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;