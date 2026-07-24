const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Inscription
const register = async (req, res) => {
  try {
    console.log('📝 Tentative d\'inscription:', req.body.email);
    
    const { username, email, password, company_name, company_address, company_phone } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ 
        message: 'Cet email ou nom d\'utilisateur est déjà utilisé.' 
      });
    }

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insérer l'utilisateur
    const result = await pool.query(
      `INSERT INTO users 
       (username, email, password_hash, company_name, company_address, company_phone) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, username, email, company_name, created_at`,
      [username, email, hashedPassword, company_name, company_address, company_phone]
    );

    const user = result.rows[0];
    console.log('✅ Utilisateur créé:', user.email);

    // Créer le token JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'mon_super_secret_jwt_2026',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Inscription réussie !',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        company_name: user.company_name
      }
    });

  } catch (error) {
    console.error('❌ Erreur inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription: ' + error.message });
  }
};

// Connexion
const login = async (req, res) => {
  try {
    console.log('🔑 Tentative de connexion:', req.body.email);

    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      console.log('❌ Utilisateur non trouvé:', email);
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const user = result.rows[0];

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      console.log('❌ Mot de passe incorrect pour:', email);
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Créer le token JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'mon_super_secret_jwt_2026',
      { expiresIn: '7d' }
    );

    console.log('✅ Connexion réussie pour:', email);

    res.json({
      message: 'Connexion réussie !',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        company_name: user.company_name,
        company_address: user.company_address,
        company_phone: user.company_phone
      }
    });

  } catch (error) {
    console.error('❌ Erreur connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion: ' + error.message });
  }
};

// Récupérer le profil
const getProfile = async (req, res) => {
  try {
    console.log('📋 Récupération profil pour user:', req.userId);

    const result = await pool.query(
      'SELECT id, username, email, company_name, company_address, company_phone, created_at FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    console.log('✅ Profil récupéré');
    res.json(result.rows[0]);

  } catch (error) {
    console.error('❌ Erreur profil:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du profil.' });
  }
};

module.exports = { register, login, getProfile };