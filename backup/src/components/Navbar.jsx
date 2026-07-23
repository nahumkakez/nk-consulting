import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated()) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <header className="app-header">
      <div className="container">
        {/* Logo */}
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <div className="nk-logo">
            <span className="nk-green">NK</span>
            <span className="nk-black">CONSULTING</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="nav-menu">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            🏠 <span>Accueil</span>
          </Link>
          <Link 
            to="/clients" 
            className={`nav-link ${isActive('/clients') ? 'active' : ''}`}
          >
            👥 <span>Clients</span>
          </Link>
          <Link 
            to="/products" 
            className={`nav-link ${isActive('/products') ? 'active' : ''}`}
          >
            📦 <span>Produits</span>
          </Link>
          <Link 
            to="/create-invoice" 
            className="btn-nav-primary"
          >
            ➕ Nouvelle Facture
          </Link>
          <div style={{ 
            paddingLeft: '12px', 
            borderLeft: '2px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)' }}>
              👋 {user?.username || 'Utilisateur'}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text)',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '6px',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(211,47,47,0.1)';
                e.target.style.color = '#d32f2f';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'var(--text)';
              }}
            >
              🚪
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;<Link 
  to="/invoices" 
  className={`nav-link ${isActive('/invoices') ? 'active' : ''}`}
>
  📄 <span>Factures</span>
</Link>