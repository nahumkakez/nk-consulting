import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';
import { clientService, productService, invoiceService } from '../services/invoiceService';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ clients: 0, products: 0, invoices: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileData = await authService.getProfile();
        setProfile(profileData.data);

        const [clientsRes, productsRes, invoicesRes] = await Promise.all([
          clientService.getAll(),
          productService.getAll(),
          invoiceService.getAll()
        ]);

        const clients = clientsRes.data || [];
        const products = productsRes.data || [];
        const invoices = invoicesRes.data || [];

        const totalRevenue = invoices
          .filter(inv => inv.status === 'paid')
          .reduce((sum, inv) => sum + parseFloat(inv.total_ttc || 0), 0);

        setStats({
          clients: clients.length,
          products: products.length,
          invoices: invoices.length,
          totalRevenue: totalRevenue
        });
      } catch (error) {
        console.error('Erreur chargement:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p>⏳ Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px' }}>
          👋 Bonjour, <span style={{ color: 'var(--nk-green)' }}>{profile?.username || user?.username}</span>
        </h1>
        <p style={{ color: 'var(--text)' }}>Bienvenue dans votre espace de gestion NK Consulting</p>
      </div>

      {/* Taux de change */}
      <div style={{
        background: 'var(--nk-white)',
        padding: '12px 20px',
        borderRadius: 'var(--radius-md)',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '24px',
        alignItems: 'center',
        border: '1px solid var(--border)'
      }}>
        <span>💱 <strong>Taux :</strong> 1 USD = 2 300 FC</span>
        <span>📅 <strong>Devises :</strong> FC / USD</span>
        <span>🇨🇩 <strong>République Démocratique du Congo</strong></span>
      </div>

      {/* Statistiques */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <div className="stat-value">{stats.clients}</div>
          <div className="stat-label">Clients</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div className="stat-value">{stats.products}</div>
          <div className="stat-label">Produits</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📄</span>
          <div className="stat-value">{stats.invoices}</div>
          <div className="stat-label">Factures</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">💰</span>
          <div className="stat-value green">{stats.totalRevenue.toFixed(2)} FC</div>
          <div className="stat-label">Chiffre d'affaires</div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <Link to="/create-invoice" className="action-card primary">
          <span className="icon">📄</span>
          <div className="title">Nouvelle Facture</div>
          <div className="desc">Créer en FC ou USD</div>
        </Link>
        <Link to="/clients" className="action-card">
          <span className="icon">👥</span>
          <div className="title">Gérer les clients</div>
          <div className="desc">Ajouter ou modifier</div>
        </Link>
        <Link to="/products" className="action-card">
          <span className="icon">📦</span>
          <div className="title">Gérer les produits</div>
          <div className="desc">Catalogue avec devises</div>
        </Link>
      </div>

      {/* Informations entreprise */}
      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>🏢 Informations de l'entreprise</h3>
        <div className="grid-2">
          <div><strong>Nom :</strong> {profile?.company_name || 'Non renseigné'}</div>
          <div><strong>Email :</strong> {profile?.email}</div>
          <div><strong>Téléphone :</strong> {profile?.company_phone || 'Non renseigné'}</div>
          <div><strong>Adresse :</strong> {profile?.company_address || 'Non renseigné'}</div>
          <div><strong>Pays :</strong> 🇨🇩 République Démocratique du Congo</div>
          <div><strong>Devises :</strong> FC / USD</div>
        </div>
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge badge-green">✅ Compte actif</span>
          <span className="badge badge-gray">Version Entreprise</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;