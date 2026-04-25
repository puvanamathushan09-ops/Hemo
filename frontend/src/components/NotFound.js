import React from "react";
import { Link } from "react-router-dom";
import "../hemo.css";

const Icons = {
  Alert: () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
  ),
  Home: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
  )
};

export default function NotFound() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const targetPath = storedUser 
    ? (storedUser.role === 'admin' ? "/admin-dashboard" : "/dashboard")
    : "/";

  return (
    <div className="hemo-notfound-wrap page-content">
      <div className="hemo-form-bg-orb hemo-form-bg-orb-1" style={{ top: '10%', left: '10%' }} />
      <div className="hemo-form-bg-orb hemo-form-bg-orb-2" style={{ bottom: '10%', right: '10%' }} />

      <div className="hemo-notfound-card" data-aos="zoom-in" data-aos-duration="800">
        <div className="notfound-icon">
          <Icons.Alert />
        </div>
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">Area Restricted or Not Found</h2>
        <p className="notfound-text">
          The coordinates you've entered do not match any known sector in the Hemo network.
          Please check your URL or return to the main hub.
        </p>

        <div className="notfound-actions">
          <Link to={targetPath} className="admin-btn admin-btn-primary">
            <Icons.Home /> <span>Back to Home Hub</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
