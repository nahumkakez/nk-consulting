const { Pool } = require('pg');
require('dotenv').config();

console.log('🔧 Configuration DB:');
console.log('DB_HOST:', process.env.DB_HOST || 'localhost');
console.log('DB_PORT:', process.env.DB_PORT || 5432);
console.log('DB_NAME:', process.env.DB_NAME || 'nk_consulting_db');
console.log('DB_USER:', process.env.DB_USER || 'postgres');

// Détecter si on est sur Render ou en local
const isProduction = process.env.DB_HOST && process.env.DB_HOST.includes('render.com');

// Configuration adaptée
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'nk_consulting_db',
  // IMPORTANT: SSL UNIQUEMENT en production !
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
  } else {
    console.log('✅ Connexion à PostgreSQL réussie !');
    console.log('📦 Base:', process.env.DB_NAME || 'nk_consulting_db');
    console.log('🌍 Environnement:', isProduction ? 'Production (Render)' : 'Développement (Local)');
    release();
  }
});

module.exports = pool;