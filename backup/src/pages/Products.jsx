import { useState, useEffect } from 'react';
import { productService } from '../services/invoiceService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    price_ht: '', 
    tva_rate: 20,
    currency: 'FC'
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await productService.getAll();
      setProducts(res.data || []);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', margin: 0 }}>📦 Produits</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Fermer' : '+ Ajouter un produit'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3>Nouveau produit</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <input
                type="text"
                placeholder="Nom *"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  padding: '10px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'var(--bg)',
                  color: 'var(--text-h)'
                }}
              />
              <input
                type="number"
                placeholder="Prix HT *"
                required
                value={formData.price_ht}
                onChange={(e) => setFormData({ ...formData, price_ht: e.target.value })}
                style={{
                  padding: '10px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'var(--bg)',
                  color: 'var(--text-h)'
                }}
              />
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                style={{
                  padding: '10px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'var(--bg)',
                  color: 'var(--text-h)'
                }}
              >
                <option value="FC">🇨🇩 Franc Congolais (FC)</option>
                <option value="USD">🇺🇸 Dollar US (USD)</option>
              </select>
              <input
                type="number"
                placeholder="TVA %"
                value={formData.tva_rate}
                onChange={(e) => setFormData({ ...formData, tva_rate: e.target.value })}
                style={{
                  padding: '10px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'var(--bg)',
                  color: 'var(--text-h)'
                }}
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{
                  padding: '10px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  gridColumn: '1 / -1',
                  background: 'var(--bg)',
                  color: 'var(--text-h)'
                }}
              />
              <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1' }}>
                Ajouter le produit
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {products.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text)' }}>
            Aucun produit pour le moment
          </p>
        ) : (
          products.map(product => (
            <div key={product.id} className="card" style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <h3 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>{product.name}</h3>
                <button
                  onClick={() => handleDelete(product.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#d32f2f',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  ✕
                </button>
              </div>
              {product.description && <p style={{ fontSize: '14px' }}>📝 {product.description}</p>}
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--nk-green)' }}>
                {parseFloat(product.price_ht).toFixed(2)} {product.currency || 'FC'} HT
              </p>
              <p style={{ fontSize: '14px', color: 'var(--text)' }}>
                TVA: {product.tva_rate}%
              </p>
              <div style={{ marginTop: '8px' }}>
                <span className="badge-gray">ID: {product.id}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;