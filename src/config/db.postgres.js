const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.PG_URI,
  ssl: { rejectUnauthorized: false }
});

const connectPostgres = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL Connected Successfully!');
  } catch (error) {
    console.error('❌ PostgreSQL Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = { pool, connectPostgres };