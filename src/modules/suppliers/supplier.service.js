const { pool, createSuppliersTable } = require('./supplier.model');

const initTable = async () => {
  await createSuppliersTable();
};

const getAllSuppliers = async () => {
  const result = await pool.query('SELECT * FROM suppliers ORDER BY id DESC');
  return result.rows;
};

const getSupplierById = async (id) => {
  const result = await pool.query('SELECT * FROM suppliers WHERE id = $1', [id]);
  return result.rows[0];
};

const createSupplier = async (data) => {
  const { name, contact, email, medicine_name, supply_date, quantity } = data;
  const result = await pool.query(
    `INSERT INTO suppliers (name, contact, email, medicine_name, supply_date, quantity)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, contact, email, medicine_name, supply_date, quantity]
  );
  return result.rows[0];
};

const updateSupplier = async (id, data) => {
  const { name, contact, email, medicine_name, supply_date, quantity } = data;
  const result = await pool.query(
    `UPDATE suppliers SET name=$1, contact=$2, email=$3, medicine_name=$4, supply_date=$5, quantity=$6
     WHERE id=$7 RETURNING *`,
    [name, contact, email, medicine_name, supply_date, quantity, id]
  );
  return result.rows[0];
};

const deleteSupplier = async (id) => {
  const result = await pool.query('DELETE FROM suppliers WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = { initTable, getAllSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier };