import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import "../hemo.css";
import { Icons } from "../components/Icons";

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

export default function DonatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ donation_date: "", request_id: "" });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        const data = await api.getBloodRequests();
        setRequests(data.filter(r => r.status === 'pending'));
      } catch (err) {
        console.error("Failed to load requests", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      const payload = {
        donor_id: user.id,
        request_id: formData.request_id || null,
        donation_date: formData.donation_date,
        status: "pledged"
      };
      await api.createDonation(payload);
      setSuccessMsg("Donation pledged successfully! Thank you for your kindness.");
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to pledge donation.");
    }
  };

  return (
    <div className="hemo-form-wrap page-content">
      <div className="hemo-form-bg-orb hemo-form-bg-orb-1" />
      <div className="hemo-form-bg-orb hemo-form-bg-orb-2" />
      
      <div className="hemo-form-card" style={{ maxWidth: '800px' }} data-aos="zoom-in">
        <Link to="/" className="hemo-form-logo">
          <HemoLogoSVG size={32} />
          <span className="hemo-logotype">Hemo</span>
        </Link>
        
        <div className="hemo-form-header">
          <h1 className="hemo-form-title">Pledge a Donation</h1>
          <p className="hemo-form-sub">
            Your contribution is a beacon of hope. Select a type and schedule your visit.
          </p>
        </div>

        {errorMsg && <div className="hemo-msg-error">{errorMsg}</div>}
        {successMsg && <div className="hemo-msg-success">{successMsg}</div>}
        
        <form onSubmit={handleSubmit} className="hemo-modern-form">
          <div className="hemo-field">
            <label className="hemo-label">Deployment Date *</label>
            <input type="date" className="hemo-input shadow-glow" required 
              value={formData.donation_date} onChange={e=>setFormData({...formData, donation_date: e.target.value})} />
          </div>

          <div className="hemo-field" style={{ marginTop: "2.5rem" }}>
            <label className="hemo-label">Fulfill Specific Request (Select One)</label>
            <p className="hemo-form-sub" style={{ fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'left', opacity: 0.8 }}>
              Are you answering an SOS call? Select the patient request you wish to match (Optional).
            </p>

            <div className="sos-selection-grid">
              <div 
                className={`sos-card ${formData.request_id === "" ? "active" : ""}`}
                onClick={() => setFormData({...formData, request_id: ""})}
              >
                <div className="sos-card-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.Hospitals size={24} /></div>
                <div className="sos-card-group">GENERAL</div>
                <div className="sos-card-city">Network</div>
              </div>

              {requests.map(req => (
                <div 
                  key={req.id} 
                  className={`sos-card ${formData.request_id === req.id ? "active" : ""}`}
                  onClick={() => setFormData({...formData, request_id: req.id})}
                >
                  <div className="sos-card-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.Drop size={24} /></div>
                  <div className="sos-card-group">{req.blood_group}</div>
                  <div className="sos-card-city">{req.city}</div>
                </div>
              ))}
            </div>
            
            {/* Live Alerts Marquee moved directly under chips Phase 20 */}
            <div className="hemo-marquee" style={{ background: 'rgba(230, 57, 70, 0.03)', margin: '0.5rem 0 2rem', height: 40, borderRadius: 12, border: 'none' }}>
              <div className="marquee-content highlight">
                <span className="marquee-item" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '6px', verticalAlign:'text-bottom' }}><Icons.ActivityAlert size={14} /> <strong>URGENT:</strong> Hospital centers are reporting low reserves in {formData.request_id ? "your selected region" : "all sectors"}.</span>
                <span className="marquee-item" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '6px', verticalAlign:'text-bottom' }}><Icons.Shield size={14} /> Your data is encrypted and HIPAA compliant.</span>
                <span className="marquee-item" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '6px', verticalAlign:'text-bottom' }}><Icons.ActivityAlert size={14} /> NETWORK ALERT: EMERGENCY SUPPLIES NEEDED</span>
              </div>
            </div>
          </div>

          <div className="hemo-info-box" style={{ background: 'var(--bg-700)', color: 'var(--text-400)', border: 'none', borderRadius: 16, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icons.Lock size={18} style={{ flexShrink: 0 }} /> <div><strong>Session Authenticated:</strong> Your donor record will be linked to this pledge automatically.</div>
          </div>

          <button type="submit" className="hemo-form-submit" disabled={loading} style={{ borderRadius: 16, height: 60, fontSize: '1.1rem' }}>
            {loading ? "PROCESSING..." : "CONFIRM SECURE PLEDGE"}
          </button>
        </form>
      </div>
    </div>
  );
}
