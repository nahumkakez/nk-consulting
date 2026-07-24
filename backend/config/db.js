const { Pool } = require('pg');
require('dotenv').config();

console.log('🔧 Configuration DB:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('DB_HOST:', process.env.DB_HOST || 'localhost');
console.log('DB_PORT:', process.env.DB_PORT || 5432);
console.log('DB_NAME:', process.env.DB_NAME || 'nk_consulting_db');
console.log('DB_USER:', process.env.DB_USER || 'postgres');

// Détecter si on est en production (Render)
const isProduction = process.env.NODE_ENV === 'production';

console.log('🌍 Mode production:', isProduction);

// Configuration adaptée
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'nk_consulting_db',
  // SSL UNIQUEMENT en production (Render)
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Tester la connexion
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erreur de connexion à PostgreSQL:', err.message);
    console.error('💡 Vérifie que PostgreSQL est démarré');
    console.error('💡 Vérifie le mot de passe dans .env');
    if (isProduction) {
      console.error('💡 Vérifie les variables d\'environnement sur Render');
    }
  } else {
    console.log('✅ Connexion à PostgreSQL réussie !');
    console.log('📦 Base:', process.env.DB_NAME || 'nk_consulting_db');
    console.log('🌍 Environnement:', isProduction ? 'Production (Render)' : 'Développement (Local)');
    release();
  }
});

module.exports = pool;