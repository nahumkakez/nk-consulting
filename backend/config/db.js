const { Pool } = require('pg');
require('dotenv').config();

console.log('🔧 Configuration DB:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);

// Configuration pour Render PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,  // 👈 ESSENTIEL pour Render
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Tester la connexion
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erreur de connexion à PostgreSQL:', err.message);
    console.error('❌ Host:', process.env.DB_HOST);
    console.error('❌ Database:', process.env.DB_NAME);
  } else {
    console.log('✅ Connexion à PostgreSQL réussie !');
    console.log('📦 Base de données:', process.env.DB_NAME);
    release();
  }
});

module.exports = pool;