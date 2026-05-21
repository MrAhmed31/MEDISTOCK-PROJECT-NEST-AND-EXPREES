const express = require('express');
const cors = require('cors');
const app = express();
const expiryRoutes = require('./modules/expiry/expiry.routes');
require('dotenv').config();

const connectMongo = require('./config/db.mongo');
const { connectPostgres } = require('./config/db.postgres');
const medicineRoutes = require('./modules/medicines/medicine.routes');
const supplierRoutes = require('./modules/suppliers/supplier.routes');
const errorHandler = require('./middlewares/errorHandler');

// Connect to Databases
connectMongo();
connectPostgres();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/medicines', medicineRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/expiry', expiryRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: '💊 Pharmacy Backend Running!' });
});

// Error Handler
app.use(errorHandler);

module.exports = app;