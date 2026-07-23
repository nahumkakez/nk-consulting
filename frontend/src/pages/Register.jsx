import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px' }}>
            <span style={{ color: 'var(--nk-green)' }}>NK</span>
            <span style={{ color: 'var(--nk-black)' }}>CONSULTING</span>
          </h1>
        </div>

        <h2 style={{ marginBottom: '20px', fontSize: '20px' }}>📝 Inscription</h2>

        {(error || passwordError) && (
          <div style={{
            background: 'rgba(211, 47, 47, 0.1)',
            color: '#d32f2f',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            ❌ {error || passwordError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nom d'utilisateur *</label>
              <input
                type="text"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mot de passe * (6 min)</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmer *</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '4px' }}>
            <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '12px' }}>🏢 Informations de l'entreprise</p>

            <div className="form-group">
              <label className="form-label">Nom de l'entreprise</label>
              <input
                type="text"
                name="company_name"
                className="form-control"
                placeholder="Votre entreprise"
                value={formData.company_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Adresse</label>
              <input
                type="text"
                name="company_address"
                className="form-control"
                placeholder="Kinshasa, RDC"
                value={formData.company_address}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input
                type="text"
                name="company_phone"
                className="form-control"
                placeholder="+243 XX XXX XXXX"
                value={formData.company_phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Inscription en cours...' : "S'inscrire"}
          </button>
        </form>

        <p style={{ marginTop: '16px', fontSize: '14px', textAlign: 'center' }}>
          Déjà un compte ?{' '}
          <Link to="/login" style={{ color: 'var(--nk-green)', fontWeight: '600', textDecoration: 'none' }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;