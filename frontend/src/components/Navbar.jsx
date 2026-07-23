import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated()) return null;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-logo">
        <span className="green">NK</span>
        <span className="black">CONSULTING</span>
      </Link>

      <div className="navbar-menu">
        <Link to="/dashboard" className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}>
          🏠 <span>Accueil</span>
        </Link>
        <Link to="/clients" className={`navbar-link ${isActive('/clients') ? 'active' : ''}`}>
          👥 <span>Clients</span>
        </Link>
        <Link to="/products" className={`navbar-link ${isActive('/products') ? 'active' : ''}`}>
          📦 <span>Produits</span>
        </Link>
        <Link to="/invoices" className={`navbar-link ${isActive('/invoices') ? 'active' : ''}`}>
          📄 <span>Factures</span>
        </Link>
        <Link to="/create-invoice" className="btn-nav-primary">
          ➕ Nouvelle Facture
        </Link>

        <div className="navbar-user">
          <span className="navbar-username">👋 {user?.username || 'Utilisateur'}</span>
          <button onClick={handleLogout} className="btn-logout" title="Déconnexion">🚪</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;