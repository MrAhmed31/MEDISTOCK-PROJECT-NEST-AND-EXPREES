const { pool } = require('../../config/db.postgres');

const createSuppliersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS suppliers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      contact VARCHAR(50) NOT NULL,
      email VARCHAR(100),
      medicine_name VARCHAR(100) NOT NULL,
      supply_date DATE NOT NULL,
      quantity INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await pool.query(query);
};

module.exports = { pool, createSuppliersTable };