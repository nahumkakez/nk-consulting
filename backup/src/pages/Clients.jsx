import { useState, useEffect } from 'react';
import { clientService } from '../services/invoiceService';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', siret: '' });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const res = await clientService.getAll();
      setClients(res.data || []);
    } catch (error) {
      console.error('Erreur chargement clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await clientService.create(formData);
      setFormData({ name: '', email: '', phone: '', address: '', siret: '' });
      setShowForm(false);
      loadClients();
      alert('✅ Client ajouté avec succès');
    } catch (error) {
      alert('❌ Erreur lors de l\'ajout');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce client ?')) {
      try {
        await clientService.delete(id);
        loadClients();
        alert('✅ Client supprimé');
      } catch (error) {
        alert('❌ Erreur lors de la suppression');
      }
    }
  };

  if (loading) return <p>⏳ Chargement...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', margin: 0 }}>👥 Clients</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Fermer' : '+ Ajouter un client'}
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3>Nouveau client</h3>
          <form onSubmit={handleSubmit} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
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
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              placeholder="Téléphone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
              placeholder="SIRET"
              value={formData.siret}
              onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
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
              placeholder="Adresse"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
              Ajouter le client
            </button>
          </form>
        </div>
      )}

      {/* Liste des clients */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {clients.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text)' }}>
            Aucun client pour le moment
          </p>
        ) : (
          clients.map(client => (
            <div key={client.id} className="card" style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <h3 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>{client.name}</h3>
                <button
                  onClick={() => handleDelete(client.id)}
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
              {client.email && <p style={{ fontSize: '14px' }}>📧 {client.email}</p>}
              {client.phone && <p style={{ fontSize: '14px' }}>📱 {client.phone}</p>}
              {client.address && <p style={{ fontSize: '14px' }}>📍 {client.address}</p>}
              {client.siret && <p style={{ fontSize: '14px' }}>🏢 SIRET: {client.siret}</p>}
              <div style={{ marginTop: '8px' }}>
                <span className="badge-gray">ID: {client.id}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Clients;