import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaTachometerAlt, FaPills, FaExclamationTriangle, FaIndustry } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/medicines', label: 'Medicines', icon: <FaPills /> },
    { path: '/expiring', label: 'Expiring', icon: <FaExclamationTriangle /> },
    { path: '/suppliers', label: 'Suppliers', icon: <FaIndustry /> },
  ];

  return (
    <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
      <Link to="/" style={styles.brandLink}>
        <div style={styles.brand}>
          <span style={styles.brandIcon}>💊</span>
          <span style={styles.brandText}>
            Pharma<span style={styles.brandAccent}>Care</span>
          </span>
        </div>
      </Link>
      <div style={styles.links}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{ ...styles.link, ...(isActive ? styles.activeLink : {}) }}
            >
              <span style={styles.linkIcon}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: 'rgba(6, 6, 18, 0.8)',
    backdropFilter: 'blur(20px)',
    padding: '0 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '70px',
    borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease',
  },
  navScrolled: {
    background: 'rgba(6, 6, 18, 0.95)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
  },
  brandLink: { textDecoration: 'none' },
  brand: { display: 'flex', alignItems: 'center', gap: '10px' },
  brandIcon: { fontSize: '28px' },
  brandText: { fontSize: '22px', fontWeight: '800', color: 'white' },
  brandAccent: { color: '#00d4ff' },
  links: { display: 'flex', gap: '5px' },
  link: {
    color: 'rgba(255,255,255,0.6)',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    transition: 'all 0.3s ease',
  },
  activeLink: {
    background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(123,47,247,0.2))',
    color: '#00d4ff',
    fontWeight: '600',
    border: '1px solid rgba(0,212,255,0.3)',
  },
  linkIcon: { fontSize: '13px' },
};

export default Navbar;