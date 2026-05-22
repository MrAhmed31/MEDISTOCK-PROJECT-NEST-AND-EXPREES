import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExpiringMedicines, getAllMedicines, getAllSuppliers } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [expiring, setExpiring] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    getExpiringMedicines().then((res) => setExpiring(res.data.data));
    getAllMedicines().then((res) => setMedicines(res.data.data));
    getAllSuppliers().then((res) => setSuppliers(res.data.data));
  }, []);

  const getDaysLeft = (expiryDate) => {
    return Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
  };

  const features = [
    { icon: '💊', title: 'Medicine Inventory', desc: 'Track all medicines with real-time stock levels, pricing, and detailed information at your fingertips.' },
    { icon: '⚠️', title: 'Expiry Tracking', desc: 'Never miss an expiry date again. Get instant alerts for medicines expiring within 30 days.' },
    { icon: '🏭', title: 'Supplier Management', desc: 'Manage all your suppliers, track supply dates, and maintain strong business relationships.' },
    { icon: '📊', title: 'Smart Dashboard', desc: 'Get a complete overview of your pharmacy inventory with beautiful charts and statistics.' },
  ];

  const stats = [
    { icon: '💊', value: medicines.length, label: 'Total Medicines', color: '#00d4ff', path: '/medicines' },
    { icon: '⚠️', value: expiring.length, label: 'Expiring Soon', color: '#ff4444', path: '/expiring' },
    { icon: '🏭', value: suppliers.length, label: 'Suppliers', color: '#00b894', path: '/suppliers' },
    { icon: '✅', value: medicines.length - expiring.length, label: 'Healthy Stock', color: '#a855f7', path: '/medicines' },
  ];

  return (
    <div style={styles.container}>

      {/* HERO SECTION */}
      <div style={{ ...styles.hero, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease' }}>
        <div style={styles.heroBadge}>🏥 Pharmacy Management System</div>
        <h1 style={styles.heroTitle}>
          Modern Pharmacy
          <span style={styles.heroAccent}> Inventory</span>
          <br />Management
        </h1>
        <p style={styles.heroDesc}>
          A complete solution for pharmacists to manage medicines, track expiry dates,
          monitor stock levels, and handle supplier relationships — all in one place.
        </p>
        <div style={styles.heroButtons}>
          <button style={styles.primaryBtn} onClick={() => navigate('/dashboard')}>
            📊 View Dashboard
          </button>
          <button style={styles.secondaryBtn} onClick={() => navigate('/medicines')}>
            💊 Manage Medicines
          </button>
        </div>
      </div>

      {/* RED EXPIRY ALERT */}
      {expiring.length > 0 && (
        <div style={styles.alertSection}>
          <div style={styles.alertBox}>
            <div style={styles.alertHeader}>
              <div style={styles.alertLeft}>
                <span style={styles.alertDot} />
                <span style={styles.alertTitle}>🚨 LIVE EXPIRY ALERT</span>
              </div>
              <button style={styles.alertBtn} onClick={() => navigate('/expiring')}>
                View All →
              </button>
            </div>
            <p style={styles.alertSubtitle}>
              {expiring.length} medicine(s) are expiring within the next 30 days!
            </p>
            <div style={styles.alertGrid}>
              {expiring.map((med) => {
                const days = getDaysLeft(med.expiryDate);
                return (
                  <div key={med._id} style={styles.alertCard}>
                    <div style={styles.alertMedIcon}>💊</div>
                    <div style={styles.alertMedInfo}>
                      <div style={styles.alertMedName}>{med.name}</div>
                      <div style={styles.alertMedBrand}>{med.brand}</div>
                    </div>
                    <div style={{ ...styles.alertDaysLeft, color: days <= 7 ? '#ff4444' : '#ffaa00' }}>
                      {days}d left
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* LIVE STATS */}
      <div style={styles.statsSection}>
        <h2 style={styles.sectionTitle}>📈 Live Statistics</h2>
        <p style={styles.sectionSubtitle}>Click any card to navigate directly</p>
        <div style={styles.statsGrid}>
          {stats.map((stat, i) => (
            <div
              key={i}
              style={{ ...styles.statCard, borderColor: stat.color, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: `all 0.6s ease ${i * 0.1}s` }}
              onClick={() => navigate(stat.path)}
            >
              <div style={styles.statIcon}>{stat.icon}</div>
              <div style={{ ...styles.statValue, color: stat.color }}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
              <div style={{ ...styles.statArrow, color: stat.color }}>→</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>✨ Features</h2>
        <p style={styles.sectionSubtitle}>Everything you need to manage your pharmacy</p>
        <div style={styles.featuresGrid}>
          {features.map((f, i) => (
            <div key={i} style={{ ...styles.featureCard, opacity: visible ? 1 : 0, transition: `all 0.6s ease ${i * 0.15}s` }}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA SECTION */}
      <div style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to manage your pharmacy?</h2>
        <p style={styles.ctaDesc}>Access your complete inventory dashboard now</p>
        <button style={styles.ctaBtn} onClick={() => navigate('/dashboard')}>
          🚀 Go to Dashboard
        </button>
      </div>

      {/* FOOTER */}
      <div style={styles.footer}>
        <p>💊 PharmaCare — Pharmacy Inventory Management System</p>
        <p style={styles.footerSub}>Built with Express.js • MongoDB • PostgreSQL • React</p>
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#060612', minHeight: '100vh', color: 'white' },

  // HERO
  hero: { textAlign: 'center', padding: '100px 40px 80px', background: 'radial-gradient(ellipse at top, rgba(0,212,255,0.1) 0%, transparent 70%)' },
  heroBadge: { display: 'inline-block', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff', padding: '8px 20px', borderRadius: '50px', fontSize: '14px', fontWeight: '600', marginBottom: '25px' },
  heroTitle: { fontSize: '64px', fontWeight: '900', lineHeight: 1.1, marginBottom: '20px', color: 'white' },
  heroAccent: { background: 'linear-gradient(135deg, #00d4ff, #7b2ff7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroDesc: { fontSize: '18px', color: 'rgba(255,255,255,0.5)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.7 },
  heroButtons: { display: 'flex', gap: '15px', justifyContent: 'center' },
  primaryBtn: { background: 'linear-gradient(135deg, #00d4ff, #7b2ff7)', color: 'white', border: 'none', padding: '15px 35px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '16px', transition: 'all 0.3s ease' },
  secondaryBtn: { background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '15px 35px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '16px', transition: 'all 0.3s ease' },

  // ALERT
  alertSection: { padding: '0 40px 60px' },
  alertBox: { background: 'linear-gradient(135deg, rgba(180,0,0,0.2), rgba(80,0,0,0.3))', border: '1px solid rgba(255,68,68,0.4)', borderRadius: '20px', padding: '30px', animation: 'pulse 2s infinite' },
  alertHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  alertLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  alertDot: { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff4444', display: 'inline-block', animation: 'pulse 1s infinite' },
  alertTitle: { fontSize: '20px', fontWeight: '800', color: '#ff6666' },
  alertBtn: { background: 'rgba(255,68,68,0.2)', color: '#ff6666', border: '1px solid rgba(255,68,68,0.4)', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  alertSubtitle: { color: 'rgba(255,150,150,0.7)', marginBottom: '20px', fontSize: '15px' },
  alertGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' },
  alertCard: { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: '12px', padding: '15px', display: 'flex', alignItems: 'center', gap: '12px' },
  alertMedIcon: { fontSize: '24px' },
  alertMedInfo: { flex: 1 },
  alertMedName: { fontWeight: '700', color: 'white', fontSize: '15px' },
  alertMedBrand: { color: 'rgba(255,255,255,0.4)', fontSize: '12px' },
  alertDaysLeft: { fontWeight: '800', fontSize: '15px' },

  // STATS
  statsSection: { padding: '60px 40px', textAlign: 'center' },
  sectionTitle: { fontSize: '36px', fontWeight: '800', marginBottom: '10px' },
  sectionSubtitle: { color: 'rgba(255,255,255,0.4)', marginBottom: '40px', fontSize: '15px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' },
  statCard: { background: 'linear-gradient(135deg, #0a0a1a, #0d0d2b)', border: '1px solid', borderRadius: '20px', padding: '35px 20px', cursor: 'pointer', transition: 'all 0.3s ease', textAlign: 'center', position: 'relative', overflow: 'hidden' },
  statIcon: { fontSize: '40px', marginBottom: '15px' },
  statValue: { fontSize: '56px', fontWeight: '900', lineHeight: 1 },
  statLabel: { color: 'rgba(255,255,255,0.5)', marginTop: '8px', fontSize: '14px', fontWeight: '500' },
  statArrow: { fontSize: '20px', marginTop: '15px', fontWeight: '700' },

  // FEATURES
  featuresSection: { padding: '60px 40px', background: 'rgba(255,255,255,0.02)' },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' },
  featureCard: { background: 'linear-gradient(135deg, #0a0a1a, #0d0d2b)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '30px', transition: 'all 0.3s ease' },
  featureIcon: { fontSize: '40px', marginBottom: '15px' },
  featureTitle: { fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: 'white' },
  featureDesc: { color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: 1.7 },

  // CTA
  ctaSection: { padding: '80px 40px', textAlign: 'center', background: 'radial-gradient(ellipse at center, rgba(123,47,247,0.1) 0%, transparent 70%)' },
  ctaTitle: { fontSize: '42px', fontWeight: '800', marginBottom: '15px' },
  ctaDesc: { color: 'rgba(255,255,255,0.4)', marginBottom: '35px', fontSize: '16px' },
  ctaBtn: { background: 'linear-gradient(135deg, #7b2ff7, #00d4ff)', color: 'white', border: 'none', padding: '18px 50px', borderRadius: '14px', cursor: 'pointer', fontWeight: '800', fontSize: '18px', transition: 'all 0.3s ease' },

  // FOOTER
  footer: { textAlign: 'center', padding: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', fontSize: '14px' },
  footerSub: { marginTop: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.2)' },
};

export default Home;