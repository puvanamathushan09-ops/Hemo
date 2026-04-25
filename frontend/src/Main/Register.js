import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import "../hemo.css";
import { Icons } from "../components/Icons";
import { toast } from "react-hot-toast";

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

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "", email: "", password: "",
    phone: "", blood_group: "O+", city: "", role: "donor", address: ""
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.register(formData);
      toast.success("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="hemo-form-wrap page-content">
      <div className="hemo-form-bg-orb hemo-form-bg-orb-1" />
      <div className="hemo-form-bg-orb hemo-form-bg-orb-2" />
      
      <div className="hemo-form-card hemo-form-card-wide" data-aos="fade-up" data-aos-duration="1000">
        <Link to="/" className="hemo-form-logo">
          <HemoLogoSVG size={32} />
          <span className="hemo-logotype">Hemo</span>
        </Link>
        <div className="hemo-form-header">
          <h1 className="hemo-form-title">Join the Network</h1>
          <p className="hemo-form-sub">Create your account to start donating or requesting blood.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="hemo-modern-form">
          <div className="hemo-form-row">
            <div className="hemo-field">
              <label className="hemo-label" htmlFor="full_name">Full Name *</label>
              <input 
                type="text" id="full_name" className="hemo-input" 
                placeholder="Enter Full Name" required
                value={formData.full_name} onChange={handleChange}
              />
            </div>
            <div className="hemo-field">
              <label className="hemo-label" htmlFor="email">Email Address *</label>
              <input 
                type="email" id="email" className="hemo-input" 
                placeholder="Enter Email" required
                value={formData.email} onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="hemo-form-row">
            <div className="hemo-field">
              <label className="hemo-label" htmlFor="password">Secure Password *</label>
              <input 
                type="password" id="password" className="hemo-input" 
                placeholder="Secure Password" required
                value={formData.password} onChange={handleChange}
              />
            </div>
            <div className="hemo-field">
              <label className="hemo-label" htmlFor="phone">Phone Number</label>
              <input 
                type="text" id="phone" className="hemo-input" 
                placeholder="Phone Number" required
                value={formData.phone} onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="hemo-form-row">
            <div className="hemo-field">
              <label className="hemo-label" htmlFor="blood_group">Blood Group</label>
              <div className="hemo-select-wrapper">
                <select id="blood_group" className="hemo-input hemo-select" required value={formData.blood_group} onChange={handleChange}>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
            <div className="hemo-field">
              <label className="hemo-label" htmlFor="city">City of Residence *</label>
              <input 
                type="text" id="city" className="hemo-input" 
                placeholder="Your City" required
                value={formData.city} onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="hemo-form-row">
            <div className="hemo-field" style={{ gridColumn: "span 2" }}>
              <label className="hemo-label" htmlFor="address">Address / Street *</label>
              <input 
                type="text" id="address" className="hemo-input" 
                placeholder="Full Street Address" required
                value={formData.address || ""} onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="hemo-info-box" style={{ margin: "1.5rem 0", display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Icons.Shield size={18} style={{ flexShrink: 0, marginTop: '2px' }} /> <div><strong>Secure Registration.</strong> Join a safe, medical-grade network connecting heroes to real-time needs.</div>
          </div>

          <button type="submit" className="hemo-form-submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Icons.Rocket size={20} /> Create Free Account
          </button>
        </form>
        
        <div className="hemo-form-divider">OR</div>
        <div className="hemo-form-link">
          Already a member? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
