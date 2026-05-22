import React, { useEffect, useState } from 'react';
import { getAllSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', contact: '', email: '', medicine_name: '', supply_date: '', quantity: '' });

  const fetchSuppliers = () => getAllSuppliers().then((res) => setSuppliers(res.data.data));
  useEffect(() => { fetchSuppliers(); }, []);

  const handleSubmit = async () => {
    if (editingId) { await updateSupplier(editingId, form); }
    else { await createSupplier(form); }
    setForm({ name: '', contact: '', email: '', medicine_name: '', supply_date: '', quantity: '' });
    setShowForm(false);
    setEditingId(null);
    fetchSuppliers();
  };

  const handleEdit = (sup) => {
    setForm({ name: sup.name, contact: sup.contact, email: sup.email, medicine_name: sup.medicine_name, supply_date: sup.supply_date?.split('T')[0], quantity: sup.quantity });
    setEditingId(sup.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this supplier?')) { await deleteSupplier(id); fetchSuppliers(); }
  };

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.medicine_name.toLowerCase().includes(search.toLowerCase())
  );

  const fields = [
    { key: 'name', placeholder: 'Supplier Name' },
    { key: 'contact', placeholder: 'Contact Number' },
    { key: 'email', placeholder: 'Email Address' },
    { key: 'medicine_name', placeholder: 'Medicine Name' },
    { key: 'quantity', placeholder: 'Quantity' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🏭 Suppliers</h1>
          <p style={styles.subtitle}>{suppliers.length} suppliers registered</p>
        </div>
        <button style={styles.addBtn} onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', contact: '', email: '', medicine_name: '', supply_date: '', quantity: '' }); }}>
          {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Add Supplier</>}
        </button>
      </div>

      <input style={styles.search} placeholder="🔍 Search suppliers by name or medicine..." value={search} onChange={(e) => setSearch(e.target.value)} />

      {showForm && (
        <div style={styles.form}>
          <h2 style={styles.formTitle}>{editingId ? '✏️ Edit Supplier' : '➕ Add New Supplier'}</h2>
          <div style={styles.formGrid}>
            {fields.map(({ key, placeholder }) => (
              <input key={key} style={styles.input} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            ))}
            <div>
              <label style={styles.label}>Supply Date</label>
              <input style={styles.input} type="date" value={form.supply_date} onChange={(e) => setForm({ ...form, supply_date: e.target.value })} />
            </div>
          </div>
          <button style={styles.submitBtn} onClick={handleSubmit}>
            {editingId ? '✅ Update Supplier' : '✅ Save Supplier'}
          </button>
        </div>
      )}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['Supplier', 'Contact', 'Email', 'Medicine', 'Supply Date', 'Quantity', 'Actions'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((sup) => (
              <tr key={sup.id} style={styles.tr} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={styles.td}><strong>{sup.name}</strong></td>
                <td style={styles.td}>{sup.contact}</td>
                <td style={styles.td}>{sup.email}</td>
                <td style={styles.td}><span style={styles.medicineBadge}>{sup.medicine_name}</span></td>
                <td style={styles.td}>{new Date(sup.supply_date).toLocaleDateString()}</td>
                <td style={styles.td}>{sup.quantity} units</td>
                <td style={styles.td}>
                  <button style={styles.editBtn} onClick={() => handleEdit(sup)}><FaEdit /></button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(sup.id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '30px 40px', background: '#050510', minHeight: '100vh', color: 'white' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '36px', fontWeight: '800', color: '#00b894', textShadow: '0 0 20px rgba(0,184,148,0.5)' },
  subtitle: { color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '5px' },
  addBtn: { background: 'linear-gradient(135deg, #00b894, #007744)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(0,184,148,0.4)' },
  search: { width: '100%', padding: '14px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '15px', marginBottom: '20px', outline: 'none' },
  form: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,184,148,0.2)', borderRadius: '16px', padding: '25px', marginBottom: '25px' },
  formTitle: { color: '#00b894', marginBottom: '20px', fontSize: '20px', fontWeight: '700' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' },
  input: { padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px', outline: 'none', width: '100%' },
  submitBtn: { background: 'linear-gradient(135deg, #00b894, #007744)', color: 'white', border: 'none', padding: '13px 28px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', boxShadow: '0 4px 20px rgba(0,184,148,0.4)' },
  tableContainer: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '14px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  tr: { transition: 'background 0.2s' },
  td: { padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '14px' },
  medicineBadge: { background: 'rgba(0,184,148,0.2)', color: '#00b894', border: '1px solid rgba(0,184,148,0.4)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: '600' },
  editBtn: { background: 'rgba(0,102,204,0.3)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', marginRight: '6px', fontSize: '13px' },
  deleteBtn: { background: 'rgba(255,68,68,0.2)', color: '#ff4444', border: '1px solid rgba(255,68,68,0.3)', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
};

export default Suppliers;