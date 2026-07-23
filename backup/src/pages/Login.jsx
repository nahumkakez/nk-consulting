import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login({ email, password });
    setLoading(false);
    
    if (result.success) {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="header">
        <div className="nk-logo">
          <span className="nk-green">NK</span>
          <span className="nk-black">CONSULTING</span>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
        <h2 style={{ marginBottom: '24px' }}>Connexion</h2>
        
        {error && (
          <div style={{ 
            background: 'rgba(211, 47, 47, 0.1)', 
            color: '#d32f2f',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '16px',
                background: 'var(--bg)',
                color: 'var(--text-h)'
              }}
              placeholder="votre@email.com"
            />
          </div>

          <div style={{ marginBottom: '24px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '16px',
                background: 'var(--bg)',
                color: 'var(--text-h)'
              }}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <p style={{ marginTop: '16px', fontSize: '14px' }}>
          Pas encore de compte ?{' '}
          <a href="/register" style={{ color: 'var(--nk-green)', textDecoration: 'none', fontWeight: '600' }}>
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;