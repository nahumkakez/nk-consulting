const pool = require('./config/db');

async function testConnection() {
  console.log('🔄 Test de connexion à PostgreSQL...');
  
  try {
    const result = await pool.query('SELECT NOW() as time, version() as version');
    console.log('✅ Connexion réussie !');
    console.log('📅 Heure serveur:', result.rows[0].time);
    console.log('📦 Version PostgreSQL:', result.rows[0].version);
    
    // Vérifier les tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n📋 Tables disponibles :');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur de connexion :', error.message);
    process.exit(1);
  }
}

testConnection();