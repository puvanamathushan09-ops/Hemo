import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../hemo.css";

function HemoLogoSVG({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ng" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e63946" />
          <stop offset="100%" stopColor="#9b111e" />
        </linearGradient>
      </defs>
      <path d="M20 3C20 3 7 16.5 7 25.5C7 32.9 12.9 39 20 39C27.1 39 33 32.9 33 25.5C33 16.5 20 3 20 3Z" fill="url(#ng)" />
      <path d="M14 18.5L14 30M14 24L26 24M26 18.5L26 30" stroke="rgba(255,255,255,0.93)" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();


  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    else setUser(null);
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  const active = (p) => (location.pathname === p ? "hemo-active" : "");

  const homePath = user 
    ? (user.role === 'admin' ? "/admin-dashboard" : "/dashboard")
    : "/";

  return (
    <>
      <nav className={`hemo-nav${scrolled ? " scrolled" : ""}`}>
        <div className="hemo-nav-inner">
          <Link to={homePath} className="hemo-logo">
            <HemoLogoSVG size={36} />
            <span className="hemo-logo-wordmark">Hemo</span>
            <span className="hemo-logo-tag">Blood Bank</span>
          </Link>

          <ul className="hemo-nav-links">
            <li><Link to={homePath} className={active("/")}>Home</Link></li>
            <li><Link to="/about" className={active("/about")}>About</Link></li>
            <li><Link to="/donate" className={active("/donate")}>Donate</Link></li>
          </ul>

          <div className="hemo-nav-cta">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? "/admin-dashboard" : "/dashboard"} className="hemo-btn-ghost" style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '6px' }}>👤</span> Dashboard
                </Link>
                <Link to="/login" onClick={handleLogout} className="hemo-btn-red" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="hemo-btn-ghost" id="nav-login-btn">Login</Link>
                <Link to="/register" className="hemo-btn-red" id="nav-register-btn">
                  🩸 Register
                </Link>
              </>
            )}
          </div>

          <button
            id="nav-hamburger"
            className={`hemo-burger${open ? " open" : ""}`}
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`hemo-mobile${open ? " open" : ""}`}>
        <Link to={homePath} className={active("/")}>🏠 Home</Link>
        <Link to="/about" className={active("/about")}>ℹ️ About</Link>
        <Link to="/donate" className={active("/donate")}>🩸 Donate Blood</Link>
        <div className="hemo-mobile-cta">
          {user ? (
            <>
              <Link to={user.role === 'admin' ? "/admin-dashboard" : "/dashboard"} className="hemo-btn-ghost">👤 My Dashboard</Link>
              <Link to="/login" onClick={handleLogout} className="hemo-btn-red">🚪 Logout</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="hemo-btn-ghost">Login</Link>
              <Link to="/register" className="hemo-btn-red">Register</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
