import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import "../hemo.css";
import { toast } from "react-toastify";

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

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await api.login(formData);
      localStorage.setItem("hemo_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful! Welcome to Hemo.");

      // Navigate based on role
      if (data.user.role === 'admin') {
        setTimeout(() => navigate("/life-saving-blood-bank/admin"), 1000);
      } else {
        setTimeout(() => navigate("/life-saving-blood-bank/dashboard"), 1000);
      }
    } catch (err) {
      toast.error(err.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="hemo-form-wrap page-content">
      <div className="hemo-form-bg-orb hemo-form-bg-orb-1" />
      <div className="hemo-form-bg-orb hemo-form-bg-orb-2" />

      <div className="hemo-form-card" data-aos="fade-up" data-aos-duration="1000">
        <Link to="/" className="hemo-form-logo">
          <HemoLogoSVG size={32} />
          <span className="hemo-logotype">Hemo</span>
        </Link>
        <div className="hemo-form-header">
          <h1 className="hemo-form-title">Welcome Back</h1>
          <p className="hemo-form-sub">Login to your account to manage your requests and donations.</p>
        </div>

        <form onSubmit={handleSubmit} className="hemo-modern-form">
          <div className="hemo-field">
            <label className="hemo-label" htmlFor="email">Email Address *</label>
            <input
              type="email" id="email" className="hemo-input"
              placeholder="Enter your email" required
              value={formData.email} onChange={handleChange}
            />
          </div>

          <div className="hemo-field">
            <label className="hemo-label" htmlFor="password">Secure Password *</label>
            <input
              type="password" id="password" className="hemo-input"
              placeholder="Enter your password" required
              value={formData.password} onChange={handleChange}
            />
          </div>

          <button type="submit" className="hemo-form-submit" data-aos="fade-up" data-aos-delay="200">
            Secure Login
          </button>
        </form>

        <div className="hemo-form-divider">OR</div>
        <div className="hemo-form-link">
          Don't have an account? <Link to="/register">Create Account</Link>
        </div>
      </div>
    </div>
  );
}
