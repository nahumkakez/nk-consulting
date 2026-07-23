import { useState, useEffect } from 'react';
import { productService } from '../services/invoiceService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', price_ht: '', tva_rate: 20, currency: 'FC' });

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      const res = await productService.getAll();
      setProducts(res.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await productService.create({
        ...formData,
        price_ht: parseFloat(formData.price_ht),
        tva_rate: parseFloat(formData.tva_rate)
      });
      setFormData({ name: '', description: '', price_ht: '', tva_rate: 20, currency: 'FC' });
      setShowForm(false);
      loadProducts();
      alert('✅ Produit ajouté avec succès');
    } catch (error) {
      alert('❌ Erreur lors de l\'ajout');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce produit ?')) {
      try {
        await productService.delete(id);
        loadProducts();
        alert('✅ Produit supprimé');
      } catch (error) {
        alert('❌ Erreur lors de la suppression');
      }
    }
  };

  if (loading) return <p>⏳ Chargement...</p>;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>📦 Produits</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Fermer' : '+ Ajouter un produit'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>Nouveau produit</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nom *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nom du produit"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Prix HT *</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0.00"
                  value={formData.price_ht}
                  onChange={(e) => setFormData({ ...formData, price_ht: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
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
              <div className="form-group">
                <label className="form-label">TVA %</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="20"
                  value={formData.tva_rate}
                  onChange={(e) => setFormData({ ...formData, tva_rate: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                placeholder="Description du produit"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary">Ajouter le produit</button>
          </form>
        </div>
      )}

      <div className="grid-3">
        {products.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text)' }}>
            Aucun produit pour le moment
          </p>
        ) : (
          products.map(product => (
            <div key={product.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <h3 style={{ fontSize: '18px' }}>{product.name}</h3>
                <button
                  onClick={() => handleDelete(product.id)}
                  style={{ background: 'transparent', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '18px' }}
                >
                  ✕
                </button>
              </div>
              {product.description && <p style={{ fontSize: '14px' }}>📝 {product.description}</p>}
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--nk-green)' }}>
                {parseFloat(product.price_ht).toFixed(2)} {product.currency || 'FC'} HT
              </p>
              <p style={{ fontSize: '14px', color: 'var(--text)' }}>TVA: {product.tva_rate}%</p>
              <div style={{ marginTop: '8px' }}><span className="badge badge-gray">ID: {product.id}</span></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;