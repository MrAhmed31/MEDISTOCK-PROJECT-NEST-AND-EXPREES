import React, { useEffect, useState } from 'react';
import { getAllMedicines, createMedicine, updateMedicine, deleteMedicine } from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', brand: '', category: '', quantity: '', price: '', expiryDate: '', description: '' });

  const fetchMedicines = () => getAllMedicines().then((res) => setMedicines(res.data.data));
  useEffect(() => { fetchMedicines(); }, []);

  const handleSubmit = async () => {
    if (editingId) { await updateMedicine(editingId, form); }
    else { await createMedicine(form); }
    setForm({ name: '', brand: '', category: '', quantity: '', price: '', expiryDate: '', description: '' });
    setShowForm(false);
    setEditingId(null);
    fetchMedicines();
  };

  const handleEdit = (med) => {
    setForm({ name: med.name, brand: med.brand, category: med.category, quantity: med.quantity, price: med.price, expiryDate: med.expiryDate?.split('T')[0], description: med.description });
    setEditingId(med._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this medicine?')) { await deleteMedicine(id); fetchMedicines(); }
  };

  const getDaysLeft = (expiryDate) => Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

  const filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.brand.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  const fields = [
    { key: 'name', placeholder: 'Medicine Name' },
    { key: 'brand', placeholder: 'Brand Name' },
    { key: 'category', placeholder: 'Category' },
    { key: 'quantity', placeholder: 'Quantity' },
    { key: 'price', placeholder: 'Price (Rs.)' },
    { key: 'description', placeholder: 'Description' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>💊 Medicines</h1>
          <p style={styles.subtitle}>{medicines.length} medicines in inventory</p>
        </div>
        <button style={styles.addBtn} onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', brand: '', category: '', quantity: '', price: '', expiryDate: '', description: '' }); }}>
          {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Add Medicine</>}
        </button>
      </div>

      {/* SEARCH */}
      <input style={styles.search} placeholder="🔍 Search medicines by name, brand or category..." value={search} onChange={(e) => setSearch(e.target.value)} />

      {/* FORM */}
      {showForm && (
        <div style={styles.form}>
          <h2 style={styles.formTitle}>{editingId ? '✏️ Edit Medicine' : '➕ Add New Medicine'}</h2>
          <div style={styles.formGrid}>
            {fields.map(({ key, placeholder }) => (
              <input key={key} style={styles.input} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            ))}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Expiry Date</label>
              <input style={styles.input} type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
            </div>
          </div>
          <button style={styles.submitBtn} onClick={handleSubmit}>
            {editingId ? '✅ Update Medicine' : '✅ Save Medicine'}
          </button>
        </div>
      )}

      {/* TABLE */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['Medicine', 'Brand', 'Category', 'Qty', 'Price', 'Expiry', 'Status', 'Actions'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((med) => {
              const daysLeft = getDaysLeft(med.expiryDate);
              const isExpired = daysLeft < 0;
              const isExpiring = daysLeft <= 30;
              return (
                <tr key={med._id} style={styles.tr} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={styles.td}><strong>{med.name}</strong></td>
                  <td style={styles.td}>{med.brand}</td>
                  <td style={styles.td}><span style={styles.categoryBadge}>{med.category}</span></td>
                  <td style={styles.td}>{med.quantity}</td>
                  <td style={styles.td}>Rs. {med.price}</td>
                  <td style={styles.td}>{new Date(med.expiryDate).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.statusBadge, background: isExpired ? '#ff444422' : isExpiring ? '#ffaa0022' : '#00b89422', color: isExpired ? '#ff4444' : isExpiring ? '#ffaa00' : '#00b894', border: `1px solid ${isExpired ? '#ff4444' : isExpiring ? '#ffaa00' : '#00b894'}` }}>
                      {isExpired ? '🔴 Expired' : isExpiring ? '🟡 Expiring' : '🟢 Good'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.editBtn} onClick={() => handleEdit(med)}><FaEdit /></button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(med._id)}><FaTrash /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '30px 40px', background: '#050510', minHeight: '100vh', color: 'white' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '36px', fontWeight: '800', color: '#00d4ff', textShadow: '0 0 20px rgba(0,212,255,0.5)' },
  subtitle: { color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '5px' },
  addBtn: { background: 'linear-gradient(135deg, #00d4ff, #7b2ff7)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(0,212,255,0.4)' },
  search: { width: '100%', padding: '14px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '15px', marginBottom: '20px', outline: 'none' },
  form: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '16px', padding: '25px', marginBottom: '25px' },
  formTitle: { color: '#00d4ff', marginBottom: '20px', fontSize: '20px', fontWeight: '700' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' },
  input: { padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px', outline: 'none', width: '100%' },
  submitBtn: { background: 'linear-gradient(135deg, #00b894, #007744)', color: 'white', border: 'none', padding: '13px 28px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', boxShadow: '0 4px 20px rgba(0,184,148,0.4)' },
  tableContainer: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '14px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  tr: { transition: 'background 0.2s' },
  td: { padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '14px' },
  categoryBadge: { background: 'rgba(123,47,247,0.2)', color: '#b44fff', border: '1px solid rgba(123,47,247,0.4)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: '600' },
  statusBadge: { borderRadius: '20px', padding: '5px 14px', fontSize: '12px', fontWeight: '600' },
  editBtn: { background: 'rgba(0,102,204,0.3)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', marginRight: '6px', fontSize: '13px' },
  deleteBtn: { background: 'rgba(255,68,68,0.2)', color: '#ff4444', border: '1px solid rgba(255,68,68,0.3)', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
};

export default Medicines;