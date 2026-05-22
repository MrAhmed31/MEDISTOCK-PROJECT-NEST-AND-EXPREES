import React, { useEffect, useState } from 'react';
import { getExpiryAnalytics, getExpiringWeek, getExpiringMonth, getExpiringYear, getExpired, getHealthyStock } from '../services/api';

const Expiring = () => {
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('week');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getExpiryAnalytics().then((res) => setAnalytics(res.data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const apiMap = {
      week: getExpiringWeek,
      month: getExpiringMonth,
      year: getExpiringYear,
      expired: getExpired,
      healthy: getHealthyStock,
    };
    apiMap[activeTab]().then((res) => {
      setData(res.data.data);
      setLoading(false);
    });
  }, [activeTab]);

  const tabs = [
    { key: 'week', label: '🟠 This Week', color: '#ff8c00' },
    { key: 'month', label: '🟡 This Month', color: '#ffc800' },
    { key: 'year', label: '🔵 This Year', color: '#0096ff' },
    { key: 'expired', label: '🔴 Expired', color: '#ff4444' },
    { key: 'healthy', label: '🟢 Healthy', color: '#00b894' },
  ];

  const colorMap = {
    red: '#ff4444', orange: '#ff8c00',
    yellow: '#ffc800', blue: '#0096ff', green: '#00b894',
  };

  const activeColor = tabs.find(t => t.key === activeTab)?.color || '#00d4ff';

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>⚠️ Advanced Expiry Tracking</h1>
        <p style={styles.subtitle}>Complete medicine expiry analysis and categorization</p>
      </div>

      {/* ANALYTICS CARDS */}
      {analytics && (
        <div style={styles.analyticsGrid}>
          {[
            { label: 'This Week', value: analytics.weekly, color: '#ff8c00', icon: '🟠' },
            { label: 'This Month', value: analytics.monthly, color: '#ffc800', icon: '🟡' },
            { label: 'This Year', value: analytics.yearly, color: '#0096ff', icon: '🔵' },
            { label: 'Expired', value: analytics.expired, color: '#ff4444', icon: '🔴' },
            { label: 'Healthy', value: analytics.healthy, color: '#00b894', icon: '🟢' },
          ].map((card, i) => (
            <div key={i} style={{ ...styles.analyticsCard, borderTop: `3px solid ${card.color}` }}>
              <div style={styles.analyticsIcon}>{card.icon}</div>
              <div style={{ ...styles.analyticsValue, color: card.color }}>{card.value}</div>
              <div style={styles.analyticsLabel}>{card.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* NEAREST EXPIRY */}
      {analytics?.nearestExpiry && (
        <div style={styles.nearestCard}>
          <div style={styles.nearestLeft}>
            <div style={styles.nearestBadge}>⚡ NEXT TO EXPIRE</div>
            <div style={styles.nearestMed}>{analytics.nearestExpiry.name}</div>
            <div style={styles.nearestBrand}>{analytics.nearestExpiry.brand}</div>
          </div>
          <div style={styles.nearestRight}>
            <div style={styles.timeGrid}>
              {[
                { value: analytics.nearestExpiry.timeLeft.daysLeft, label: 'Days' },
                { value: analytics.nearestExpiry.timeLeft.weeksLeft, label: 'Weeks' },
                { value: analytics.nearestExpiry.timeLeft.monthsLeft, label: 'Months' },
                { value: analytics.nearestExpiry.timeLeft.yearsLeft, label: 'Years' },
              ].map((t, i) => (
                <div key={i} style={styles.timeBox}>
                  <div style={styles.timeValue}>{t.value}</div>
                  <div style={styles.timeLabel}>{t.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TABS */}
      <div style={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            style={{ ...styles.tab, ...(activeTab === tab.key ? { ...styles.activeTab, borderColor: tab.color, color: tab.color, background: `${tab.color}15` } : {}) }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {analytics && (
              <span style={{ ...styles.tabCount, background: tab.color }}>
                {activeTab === 'week' && tab.key === 'week' ? analytics.weekly :
                 tab.key === 'month' ? analytics.monthly :
                 tab.key === 'year' ? analytics.yearly :
                 tab.key === 'expired' ? analytics.expired :
                 tab.key === 'healthy' ? analytics.healthy : 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* MEDICINES GRID */}
      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : data.length === 0 ? (
        <div style={styles.empty}>✅ No medicines in this category!</div>
      ) : (
        <div style={styles.grid}>
          {data.map((med) => {
            const color = colorMap[med.timeLeft?.color] || '#00b894';
            return (
              <div key={med._id} style={{ ...styles.medCard, borderLeft: `4px solid ${color}` }}>
                <div style={styles.medHeader}>
                  <div style={styles.medName}>💊 {med.name}</div>
                  <div style={{ ...styles.medStatus, background: `${color}20`, color, border: `1px solid ${color}` }}>
                    {med.timeLeft?.status?.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
                <div style={styles.medBrand}>{med.brand} • {med.category}</div>

                {/* TIME LEFT BOXES */}
                <div style={styles.timeRow}>
                  {[
                    { value: med.timeLeft?.daysLeft, label: 'Days' },
                    { value: med.timeLeft?.weeksLeft, label: 'Weeks' },
                    { value: med.timeLeft?.monthsLeft, label: 'Months' },
                    { value: med.timeLeft?.yearsLeft, label: 'Years' },
                  ].map((t, i) => (
                    <div key={i} style={{ ...styles.timeBox2, borderColor: color }}>
                      <div style={{ ...styles.timeVal2, color }}>{t.value}</div>
                      <div style={styles.timeLab2}>{t.label}</div>
                    </div>
                  ))}
                </div>

                <div style={styles.medFooter}>
                  <span>📦 Qty: {med.quantity}</span>
                  <span>💰 Rs. {med.price}</span>
                  <span>📅 {new Date(med.expiryDate).toLocaleDateString()}</span>
                </div>

                {/* PROGRESS BAR */}
                <div style={styles.progressBg}>
                  <div style={{
                    ...styles.progressFill,
                    width: `${Math.min(Math.max((365 - (med.timeLeft?.daysLeft || 0)) / 365 * 100, 0), 100)}%`,
                    background: color
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '35px 40px', backgroundColor: '#060612', minHeight: '100vh', color: 'white' },
  header: { marginBottom: '25px' },
  title: { fontSize: '32px', fontWeight: '800', color: 'white' },
  subtitle: { color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' },
  analyticsGrid: { display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '15px', marginBottom: '20px' },
  analyticsCard: { background: 'linear-gradient(135deg, #0a0a1a, #0d0d2b)', borderRadius: '12px', padding: '20px', textAlign: 'center' },
  analyticsIcon: { fontSize: '28px', marginBottom: '10px' },
  analyticsValue: { fontSize: '40px', fontWeight: '900', lineHeight: 1 },
  analyticsLabel: { color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '6px' },
  nearestCard: { background: 'linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,68,68,0.1))', border: '1px solid rgba(255,140,0,0.3)', borderRadius: '16px', padding: '25px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  nearestLeft: {},
  nearestBadge: { background: 'rgba(255,140,0,0.2)', color: '#ff8c00', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', display: 'inline-block', marginBottom: '10px' },
  nearestMed: { fontSize: '22px', fontWeight: '800', color: 'white' },
  nearestBrand: { color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' },
  nearestRight: {},
  timeGrid: { display: 'flex', gap: '15px' },
  timeBox: { background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px 16px', textAlign: 'center', minWidth: '70px' },
  timeValue: { fontSize: '28px', fontWeight: '900', color: '#ff8c00' },
  timeLabel: { color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  tab: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease' },
  activeTab: { fontWeight: '700' },
  tabCount: { color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' },
  loading: { textAlign: 'center', padding: '50px', color: 'rgba(255,255,255,0.3)', fontSize: '16px' },
  empty: { background: 'rgba(0,184,148,0.1)', border: '1px solid rgba(0,184,148,0.3)', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#00b894', fontSize: '18px', fontWeight: '600' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' },
  medCard: { background: 'linear-gradient(135deg, #0a0a1a, #0d0d2b)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)' },
  medHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
  medName: { fontWeight: '700', color: 'white', fontSize: '16px' },
  medStatus: { padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', letterSpacing: '0.5px' },
  medBrand: { color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '15px' },
  timeRow: { display: 'flex', gap: '8px', marginBottom: '15px' },
  timeBox2: { flex: 1, border: '1px solid', borderRadius: '8px', padding: '8px', textAlign: 'center' },
  timeVal2: { fontSize: '20px', fontWeight: '800', lineHeight: 1 },
  timeLab2: { color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '3px' },
  medFooter: { display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '12px' },
  progressBg: { background: 'rgba(255,255,255,0.05)', borderRadius: '50px', height: '4px', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: '50px', transition: 'width 1s ease' },
};

export default Expiring;