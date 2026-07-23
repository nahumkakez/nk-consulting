import { useState, useEffect } from 'react';
import { clientService } from '../services/invoiceService';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', siret: '' });

  useEffect(() => { loadClients(); }, []);

  const loadClients = async () => {
    try {
      const res = await clientService.getAll();
      setClients(res.data || []);
    } catch (error) {
      console.error('Erreur:', error);
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
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>👥 Clients</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Fermer' : '+ Ajouter un client'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>Nouveau client</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nom *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nom complet"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="email@client.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="+243 XX XXX XXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">SIRET</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Numéro SIRET"
                  value={formData.siret}
                  onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Adresse</label>
              <input
                type="text"
                className="form-control"
                placeholder="Adresse complète"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary">Ajouter le client</button>
          </form>
        </div>
      )}

      <div className="grid-3">
        {clients.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text)' }}>
            Aucun client pour le moment
          </p>
        ) : (
          clients.map(client => (
            <div key={client.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <h3 style={{ fontSize: '18px' }}>{client.name}</h3>
                <button
                  onClick={() => handleDelete(client.id)}
                  style={{ background: 'transparent', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '18px' }}
                >
                  ✕
                </button>
              </div>
              {client.email && <p style={{ fontSize: '14px' }}>📧 {client.email}</p>}
              {client.phone && <p style={{ fontSize: '14px' }}>📱 {client.phone}</p>}
              {client.address && <p style={{ fontSize: '14px' }}>📍 {client.address}</p>}
              {client.siret && <p style={{ fontSize: '14px' }}>🏢 SIRET: {client.siret}</p>}
              <div style={{ marginTop: '8px' }}><span className="badge badge-gray">ID: {client.id}</span></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Clients;