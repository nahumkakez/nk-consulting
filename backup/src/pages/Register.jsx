import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    company_name: '',
    company_address: '',
    company_phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const { register, error } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérifier les mots de passe
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (formData.password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);
    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);
    setLoading(false);
    
    if (result.success) {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="page-container fade-in" style={{ padding: '20px' }}>
      <div className="header">
        <div className="nk-logo">
          <span className="nk-green">NK</span>
          <span className="nk-black">CONSULTING</span>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '550px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ marginBottom: '24px' }}>Inscription</h2>
        
        {(error || passwordError) && (
          <div style={{ 
            background: 'rgba(211, 47, 47, 0.1)', 
            color: '#d32f2f',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            {error || passwordError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' }}>
              Nom d'utilisateur *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '15px',
                background: 'var(--bg)',
                color: 'var(--text-h)'
              }}
            />
          </div>

          <div style={{ marginBottom: '12px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '15px',
                background: 'var(--bg)',
                color: 'var(--text-h)'
              }}
            />
          </div>

          <div style={{ marginBottom: '12px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' }}>
              Mot de passe * (6 caractères minimum)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '15px',
                background: 'var(--bg)',
                color: 'var(--text-h)'
              }}
            />
          </div>

          <div style={{ marginBottom: '12px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' }}>
              Confirmer le mot de passe *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '15px',
                background: 'var(--bg)',
                color: 'var(--text-h)'
              }}
            />
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '8px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Informations de l'entreprise</h3>
            
            <div style={{ marginBottom: '12px', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' }}>
                Nom de l'entreprise
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '15px',
                  background: 'var(--bg)',
                  color: 'var(--text-h)'
                }}
              />
            </div>

            <div style={{ marginBottom: '12px', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' }}>
                Adresse
              </label>
              <input
                type="text"
                name="company_address"
                value={formData.company_address}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '15px',
                  background: 'var(--bg)',
                  color: 'var(--text-h)'
                }}
              />
            </div>

            <div style={{ marginBottom: '12px', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' }}>
                Téléphone
              </label>
              <input
                type="text"
                name="company_phone"
                value={formData.company_phone}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '15px',
                  background: 'var(--bg)',
                  color: 'var(--text-h)'
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '16px' }}
          >
            {loading ? 'Inscription en cours...' : "S'inscrire"}
          </button>
        </form>

        <p style={{ marginTop: '16px', fontSize: '14px' }}>
          Déjà un compte ?{' '}
          <a href="/login" style={{ color: 'var(--nk-green)', textDecoration: 'none', fontWeight: '600' }}>
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;