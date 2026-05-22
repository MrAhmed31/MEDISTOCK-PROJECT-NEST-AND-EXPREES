import React, { useEffect, useState } from 'react';
import { useNavigate }  from 'react-router-dom';
import { getExpiryAnalytics, getAllMedicines, getAllSuppliers } from '../services/api';
import { FaPills, FaExclamationTriangle, FaIndustry, FaCheckCircle, FaSkull, FaClock, FaCalendarAlt, FaCalendarWeek } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    getExpiryAnalytics().then((res) => setAnalytics(res.data.data));
    getAllMedicines().then((res) => setMedicines(res.data.data));
    getAllSuppliers().then((res) => setSuppliers(res.data.data));
  }, []);

  const colorMap = {
    red: { bg: 'rgba(255,68,68,0.15)', border: '#ff4444', text: '#ff4444' },
    orange: { bg: 'rgba(255,140,0,0.15)', border: '#ff8c00', text: '#ff8c00' },
    yellow: { bg: 'rgba(255,200,0,0.15)', border: '#ffc800', text: '#ffc800' },
    blue: { bg: 'rgba(0,150,255,0.15)', border: '#0096ff', text: '#0096ff' },
    green: { bg: 'rgba(0,184,148,0.15)', border: '#00b894', text: '#00b894' },
  };

  const statCards = analytics ? [
    { label: 'Total Medicines', value: analytics.total, icon: <FaPills />, color: '#00d4ff', bg: 'rgba(0,212,255,0.1)', path: '/medicines' },
    { label: 'Expired', value: analytics.expired, icon: <FaSkull />, color: '#ff4444', bg: 'rgba(255,68,68,0.1)', path: '/expiring' },
    { label: 'Expiring This Week', value: analytics.weekly, icon: <FaCalendarWeek />, color: '#ff8c00', bg: 'rgba(255,140,0,0.1)', path: '/expiring' },
    { label: 'Expiring This Month', value: analytics.monthly, icon: <FaClock />, color: '#ffc800', bg: 'rgba(255,200,0,0.1)', path: '/expiring' },
    { label: 'Expiring This Year', value: analytics.yearly, icon: <FaCalendarAlt />, color: '#0096ff', bg: 'rgba(0,150,255,0.1)', path: '/expiring' },
    { label: 'Healthy Stock', value: analytics.healthy, icon: <FaCheckCircle />, color: '#00b894', bg: 'rgba(0,184,148,0.1)', path: '/medicines' },
    { label: 'Total Suppliers', value: suppliers.length, icon: <FaIndustry />, color: '#a855f7', bg: 'rgba(168,85,247,0.1)', path: '/suppliers' },
  ] : [];

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🏠 Dashboard</h1>
          <p style={styles.subtitle}>Advanced Pharmacy Analytics Overview</p>
        </div>
        <div style={styles.dateBox}>
          📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* NEAREST EXPIRY HIGHLIGHT */}
      {analytics?.nearestExpiry && (
        <div style={styles.nearestBox}>
          <div style={styles.nearestLeft}>
            <span style={styles.nearestIcon}>⚡</span>
            <div>
              <div style={styles.nearestTitle}>Next Expiring Medicine</div>
              <div style={styles.nearestName}>{analytics.nearestExpiry.name} — {analytics.nearestExpiry.brand}</div>
            </div>
          </div>
          <div style={styles.nearestRight}>
            <div style={{ color: colorMap[analytics.nearestExpiry.timeLeft.color]?.text || '#fff' }}>
              <div style={styles.nearestDays}>{analytics.nearestExpiry.timeLeft.daysLeft} days</div>
              <div style={styles.nearestSub}>{analytics.nearestExpiry.timeLeft.weeksLeft} weeks • {analytics.nearestExpiry.timeLeft.monthsLeft} months</div>
            </div>
          </div>
        </div>
      )}

      {/* STATS GRID */}
      <div style={styles.statsGrid}>
        {statCards.map((card, i) => (
          <div key={i} style={{ ...styles.statCard, background: card.bg, border: `1px solid ${card.color}33` }} onClick={() => navigate(card.path)}>
            <div style={{ ...styles.statIcon, color: card.color }}>{card.icon}</div>
            <div style={{ ...styles.statValue, color: card.color }}>{card.value}</div>
            <div style={styles.statLabel}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* PROGRESS BARS */}
      {analytics && (
        <div style={styles.progressCard}>
          <h2 style={styles.progressTitle}>📊 Inventory Health Overview</h2>
          <div style={styles.progressList}>
            {[
              { label: 'Healthy Stock', value: analytics.percentages.healthy, color: '#00b894' },
              { label: 'At Risk (This Week)', value: analytics.percentages.atRisk, color: '#ff8c00' },
              { label: 'Expired', value: analytics.percentages.expired, color: '#ff4444' },
            ].map((item, i) => (
              <div key={i} style={styles.progressItem}>
                <div style={styles.progressLabelRow}>
                  <span style={styles.progressLabel}>{item.label}</span>
                  <span style={{ color: item.color, fontWeight: '700' }}>{item.value}%</span>
                </div>
                <div style={styles.progressBg}>
                  <div style={{ ...styles.progressFill, width: `${item.value}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECENT MEDICINES TABLE */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h2 style={styles.tableTitle}>📋 Recent Inventory</h2>
          <button style={styles.viewAllBtn} onClick={() => navigate('/medicines')}>View All →</button>
        </div>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              {['Medicine', 'Brand', 'Category', 'Qty', 'Expiry', 'Days Left', 'Status'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {medicines.slice(0, 6).map((med) => {
              const days = Math.ceil((new Date(med.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
              const color = days < 0 ? '#ff4444' : days <= 7 ? '#ff8c00' : days <= 30 ? '#ffc800' : days <= 365 ? '#0096ff' : '#00b894';
              const status = days < 0 ? '🔴 Expired' : days <= 7 ? '🟠 This Week' : days <= 30 ? '🟡 This Month' : days <= 365 ? '🔵 This Year' : '🟢 Healthy';
              return (
                <tr key={med._id} style={styles.tr}>
                  <td style={styles.tdBold}>{med.name}</td>
                  <td style={styles.td}>{med.brand}</td>
                  <td style={styles.td}><span style={styles.catBadge}>{med.category}</span></td>
                  <td style={styles.td}>{med.quantity}</td>
                  <td style={styles.td}>{new Date(med.expiryDate).toLocaleDateString()}</td>
                  <td style={styles.td}><span style={{ color, fontWeight: '700' }}>{days}d</span></td>
                  <td style={styles.td}><span style={{ ...styles.statusBadge, background: `${color}22`, color, border: `1px solid ${color}` }}>{status}</span></td>
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
  container: { padding: '35px 40px', backgroundColor: '#060612', minHeight: '100vh', color: 'white' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  title: { fontSize: '32px', fontWeight: '800', color: 'white' },
  subtitle: { color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' },
  dateBox: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' },
  nearestBox: { background: 'linear-gradient(135deg, rgba(255,140,0,0.15), rgba(255,68,68,0.15))', border: '1px solid rgba(255,140,0,0.4)', borderRadius: '16px', padding: '20px 25px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  nearestLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
  nearestIcon: { fontSize: '32px' },
  nearestTitle: { color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' },
  nearestName: { color: 'white', fontWeight: '700', fontSize: '18px', marginTop: '4px' },
  nearestRight: { textAlign: 'right' },
  nearestDays: { fontSize: '36px', fontWeight: '900', lineHeight: 1 },
  nearestSub: { fontSize: '13px', opacity: 0.7, marginTop: '4px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '15px', marginBottom: '25px' },
  statCard: { borderRadius: '16px', padding: '22px', cursor: 'pointer', transition: 'all 0.3s ease', textAlign: 'center' },
  statIcon: { fontSize: '28px', marginBottom: '10px' },
  statValue: { fontSize: '42px', fontWeight: '900', lineHeight: 1 },
  statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '6px', fontWeight: '500' },
  progressCard: { background: 'linear-gradient(135deg, #0a0a1a, #0d0d2b)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '25px', marginBottom: '25px' },
  progressTitle: { fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '20px' },
  progressList: { display: 'flex', flexDirection: 'column', gap: '18px' },
  progressItem: {},
  progressLabelRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  progressLabel: { color: 'rgba(255,255,255,0.6)', fontSize: '14px' },
  progressBg: { background: 'rgba(255,255,255,0.05)', borderRadius: '50px', height: '8px', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: '50px', transition: 'width 1s ease' },
  tableCard: { background: 'linear-gradient(135deg, #0a0a1a, #0d0d2b)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  tableTitle: { fontSize: '18px', fontWeight: '700', color: 'white' },
  viewAllBtn: { background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: 'rgba(0,0,0,0.3)' },
  th: { padding: '12px 18px', color: 'rgba(255,255,255,0.4)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'left' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.04)' },
  td: { padding: '13px 18px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' },
  tdBold: { padding: '13px 18px', color: 'white', fontWeight: '600', fontSize: '14px' },
  catBadge: { background: 'rgba(168,85,247,0.2)', color: '#a855f7', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
};

export default Dashboard;