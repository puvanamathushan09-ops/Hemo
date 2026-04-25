import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../hemo.css";

function HemoLogoSVG({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="hg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e63946" />
          <stop offset="100%" stopColor="#9b111e" />
        </linearGradient>
      </defs>
      <path d="M20 3C20 3 7 16.5 7 25.5C7 32.9 12.9 39 20 39C27.1 39 33 32.9 33 25.5C33 16.5 20 3 20 3Z" fill="url(#hg2)" />
      <path d="M14 18.5L14 30M14 24L26 24M26 18.5L26 30" stroke="rgba(255,255,255,0.93)" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Hardcoded check for demo purposes
    if (formData.email === "admin@hemo.com" && formData.password === "admin123") {
      const mockUser = { id: 'admin-123', full_name: 'Super Admin', email: 'admin@hemo.com', role: 'admin' };
      localStorage.setItem("hemo_token", "mock_admin_token");
      localStorage.setItem("user", JSON.stringify(mockUser));
      toast.success("Welcome back, Administrator");
      setTimeout(() => navigate("/admin-dashboard"), 1000);
      return;
    }

    try {
      const data = await api.login(formData);
      if (data.user.role !== "admin") {
        toast.error("Access Denied: You are not an administrator.");
        setLoading(false);
        return;
      }
      localStorage.setItem("hemo_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Authentication successful");
      setTimeout(() => navigate("/admin-dashboard"), 800);
    } catch (err) {
      toast.error(err.message || "Invalid Admin Credentials.");
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="hemo-form-wrap page-content">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="hemo-form-bg-orb hemo-form-bg-orb-1" />
      <div className="hemo-form-bg-orb hemo-form-bg-orb-2" />
      
      <div className="hemo-form-card" data-aos="fade-up" data-aos-duration="1000">
        <Link to="/" className="hemo-form-logo">
          <HemoLogoSVG size={32} />
          <span className="hemo-logotype">Hemo Admin</span>
        </Link>
        <div className="hemo-form-header">
          <h1 className="hemo-form-title">System Dashboard</h1>
          <p className="hemo-form-sub">Restricted access area. Authenticate to manage the life-saving network.</p>
        </div>
        
        <form onSubmit={handleAdminSubmit} className="hemo-modern-form">
          <div className="hemo-field">
            <label className="hemo-label" htmlFor="email">Admin Email</label>
            <input 
              type="email" id="email" className="hemo-input" 
              placeholder="admin@hemo.com" required
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="hemo-field" style={{ marginBottom: "2rem" }}>
            <label className="hemo-label" htmlFor="password">Security Password</label>
            <input 
              type="password" id="password" className="hemo-input" 
              placeholder="••••••••" required
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
            
          <button 
            id="login-button" 
            type="submit" 
            className="hemo-form-submit"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Authenticate Access"}
          </button>
        </form>
        
        <div className="hemo-form-divider">OR</div>
        <div className="hemo-form-link">
          Return to <Link to="/">Public Website</Link>
        </div>
      </div>
    </div>
  );
}
