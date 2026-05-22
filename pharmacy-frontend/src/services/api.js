import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Medicines
export const getAllMedicines = () => API.get('/medicines');
export const createMedicine = (data) => API.post('/medicines', data);
export const updateMedicine = (id, data) => API.put(`/medicines/${id}`, data);
export const deleteMedicine = (id) => API.delete(`/medicines/${id}`);
export const getExpiringMedicines = () => API.get('/medicines/expiring');

// Suppliers
export const getAllSuppliers = () => API.get('/suppliers');
export const createSupplier = (data) => API.post('/suppliers', data);
export const updateSupplier = (id, data) => API.put(`/suppliers/${id}`, data);
export const deleteSupplier = (id) => API.delete(`/suppliers/${id}`);

// Advanced Expiry
export const getExpiryAnalytics = () => API.get('/expiry/analytics');
export const getExpiringWeek = () => API.get('/expiry/week');
export const getExpiringMonth = () => API.get('/expiry/month');
export const getExpiringYear = () => API.get('/expiry/year');
export const getExpired = () => API.get('/expiry/expired');
export const getHealthyStock = () => API.get('/expiry/healthy');
export const getAllWithStatus = () => API.get('/expiry/all');