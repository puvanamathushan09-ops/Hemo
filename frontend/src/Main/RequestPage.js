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

export default function RequestNew() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ blood_group: "", city: "", hospital_id: "" });
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    const loadHospitals = async () => {
      try {
        const data = await api.getHospitals();
        setHospitals(data);
      } catch (err) {
        console.error("Failed to load hospitals", err);
      } finally {
        setLoading(false);
      }
    };
    loadHospitals();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setErrorMsg("You must be logged in to create a request.");
      return;
    }

    try {
      const payload = {
        patient_id: user.id,
        hospital_id: formData.hospital_id || null,
        blood_group: formData.blood_group,
        city: formData.city,
        status: "pending"
      };
      await api.createBloodRequest(payload);
      setSuccessMsg("Blood request submitted successfully! We are notifying donors.");
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit request.");
    }
  };

  return (
    <div className="hemo-form-wrap page-content">
      <div className="hemo-form-bg-orb hemo-form-bg-orb-1" />
      <div className="hemo-form-bg-orb hemo-form-bg-orb-2" />
      
      <div className="hemo-form-card hemo-form-card-wide" data-aos="zoom-in" data-aos-duration="800">
        <Link to="/" className="hemo-form-logo">
          <HemoLogoSVG size={32} />
          <span className="hemo-logotype">Hemo</span>
        </Link>
        
        <div className="hemo-form-header">
          <h1 className="hemo-form-title">Request Blood Match</h1>
          <p className="hemo-form-sub">
            Fill out the required details below. Our system will immediately notify matching donors in your city.
          </p>
        </div>

        {errorMsg && <div className="hemo-msg-error">{errorMsg}</div>}
        {successMsg && <div className="hemo-msg-success">{successMsg}</div>}
        
        <form onSubmit={handleSubmit} className="hemo-modern-form">
          <div className="hemo-form-row">
            {/* Blood Group */}
            <div className="hemo-field">
              <label className="hemo-label" htmlFor="blood_group">Blood Group Required *</label>
              <div className="hemo-select-wrapper">
                <select id="blood_group" className="hemo-input hemo-select" required 
                  value={formData.blood_group} onChange={e=>setFormData({...formData, blood_group: e.target.value})}>
                  <option value="" disabled>Select Blood Type</option>
                  <option value="A+">A Positive (A+)</option>
                  <option value="A-">A Negative (A-)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="B-">B Negative (B-)</option>
                  <option value="O+">O Positive (O+)</option>
                  <option value="O-">O Negative (O-)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                  <option value="AB-">AB Negative (AB-)</option>
                </select>
              </div>
            </div>

            {/* City */}
            <div className="hemo-field">
              <label className="hemo-label" htmlFor="city">City Location *</label>
              <input type="text" id="city" className="hemo-input" placeholder="e.g. Jaffna, Colombo" required 
                value={formData.city} onChange={e=>setFormData({...formData, city: e.target.value})} />
            </div>
          </div>

          {/* Hospital */}
          <div className="hemo-field" style={{ marginTop: "1rem" }}>
            <label className="hemo-label" htmlFor="hospital_id">Hospital / Medical Center</label>
            <p style={{ fontSize:"0.75rem", color:"var(--text-600)", marginBottom:"0.5rem" }}>
              Select the registered hospital where the patient is admitted (Optional)
            </p>
            <div className="hemo-select-wrapper">
              <select id="hospital_id" className="hemo-input hemo-select" 
                value={formData.hospital_id} onChange={e=>setFormData({...formData, hospital_id: e.target.value})}>
                <option value="">-- I don't see my hospital / Not Applicable --</option>
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="hemo-info-box" data-aos="fade-up" data-aos-delay="200">
            <strong>Note:</strong> Your patient ID and request timestamps are automatically generated securely by the Hemo platform upon submission.
          </div>

          <button type="submit" className="hemo-form-submit" data-aos="fade-up" data-aos-delay="300" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Icons.ActivityAlert size={20} /> {loading ? "Loading..." : "Submit Emergency Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
