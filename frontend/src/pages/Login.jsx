import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login({ email, password });
    setLoading(false);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px' }}>
            <span style={{ color: 'var(--nk-green)' }}>NK</span>
            <span style={{ color: 'var(--nk-black)' }}>CONSULTING</span>
          </h1>
          <p style={{ color: 'var(--text)', marginTop: '8px' }}>Application Professionnelle</p>
        </div>

        <h2 style={{ marginBottom: '24px', fontSize: '22px' }}>🔐 Connexion</h2>

        {error && (
          <div style={{ 
            background: 'rgba(211, 47, 47, 0.1)', 
            color: '#d32f2f',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <p style={{ marginTop: '16px', fontSize: '14px', textAlign: 'center' }}>
          Pas encore de compte ?{' '}
          <Link to="/register" style={{ color: 'var(--nk-green)', fontWeight: '600', textDecoration: 'none' }}>
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;