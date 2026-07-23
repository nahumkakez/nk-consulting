import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages simples
const Login = () => {
  const { login } = useAuth();
  
  const handleLogin = () => {
    login();
    window.location.href = '/dashboard';
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h1 style={{ fontSize: '40px' }}>
        <span style={{ color: '#1B5E20' }}>NK</span>
        <span style={{ color: '#1a1a1a' }}>CONSULTING</span>
      </h1>
      <div className="card" style={{ width: '300px', textAlign: 'center' }}>
        <h2>Connexion</h2>
        <p style={{ margin: '16px 0', color: '#666' }}>Cliquez sur le bouton pour vous connecter</p>
        <button className="btn-primary" onClick={handleLogin}>
          Se connecter
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '28px' }}>
          <span style={{ color: '#1B5E20' }}>NK</span>
          <span style={{ color: '#1a1a1a' }}>CONSULTING</span>
        </h1>
        <button className="btn-primary" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
      <div className="card" style={{ marginTop: '24px' }}>
        <h2>🏠 Tableau de bord</h2>
        <p style={{ marginTop: '12px', color: '#666' }}>
          Bienvenue sur l'application NK Consulting !
        </p>
        <p style={{ marginTop: '8px', color: '#666' }}>
          ✅ Authentification fonctionnelle
        </p>
      </div>
    </div>
  );
};

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;