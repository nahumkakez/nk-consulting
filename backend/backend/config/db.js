const { Pool } = require('pg');
require('dotenv').config();

console.log('🔧 Configuration DB:');
console.log('DB_HOST:', process.env.DB_HOST || 'localhost');

// Détecter si on est sur Render ou en local
const isProduction = process.env.DB_HOST && process.env.DB_HOST.includes('render.com');

// Configuration adaptée
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'nk_consulting_db',
  // SSL uniquement en production (Render)
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Tester la connexion avec gestion d'erreur améliorée
pool.on('error', (err) => {
  console.error('❌ Erreur inattendue du pool PostgreSQL:', err.message);
});

// Fonction pour tester la connexion
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connexion à PostgreSQL réussie !');
    console.log('📦 Base:', process.env.DB_NAME || 'nk_consulting_db');
    console.log('🌍 Environnement:', isProduction ? 'Production (Render)' : 'Développement (Local)');
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Erreur de connexion à PostgreSQL:', err.message);
    return false;
  }
};

// Exécuter le test de connexion
testConnection();

module.exports = pool;