import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import "../hemo.css";

export default function HelpRequest() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [patient, setPatient] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pledging, setPledging] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allReqs = await api.getBloodRequests();
        const req = allReqs.find(r => r.id === requestId);
        if (!req) { toast.error("Request not found or expired"); navigate("/"); return; }
        setRequest(req);

        const allUsers = await api.getAllUsers();
        if (req.patient_id) setPatient(allUsers.find(u => u.id === req.patient_id));

        const allHospitals = await api.getHospitals();
        setHospital(allHospitals.find(h => h.id === req.hospital_id));

        setLoading(false);
      } catch (err) {
        toast.error("Failed to load request context");
        navigate("/");
      }
    };
    fetchData();
  }, [requestId, navigate]);

  const handlePledge = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("Please login to pledge a life-saving donation");
      return;
    }

    setPledging(true);
    try {
      await api.createDonation({
        donor_id: user.id,
        request_id: requestId,
        donation_date: new Date().toISOString().split('T')[0],
        status: "pledged"
      });
      toast.success("Life-Saving Pledge Confirmed! Please visit the hospital.");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Pledge failed: " + err.message);
    } finally {
      setPledging(false);
    }
  };

  if (loading) return <div className="hemo-loader">Initializing Satellite Link...</div>;

  return (
    <div className="hemo-page">
      <Navbar />
      <div className="hemo-container" style={{paddingTop: 120, maxWidth: 600}}>
        <div className="hemo-card" style={{animation: 'slideUp 0.6s ease-out'}}>
          <div style={{textAlign:'center', marginBottom: 30}}>
            <div className="hemo-badge-red">🚨 EMERGENCY MATCH</div>
            <h1 style={{marginTop: 15, fontSize: '2.4rem'}}>Life-Saving Response</h1>
            <p style={{opacity: 0.6}}>Verify the patient context below and confirm your contribution.</p>
          </div>

          <div style={{display:'grid', gap: 20}}>
            {/* Patient Context */}
            <div className="hemo-profile-card" style={{background: 'var(--bg-700)', padding: 24, borderRadius: 24}}>
              <div style={{fontSize:'0.75rem', fontWeight:800, color:'var(--hemo-red)', marginBottom:12, textTransform:'uppercase'}}>Patient Identity</div>
              <div style={{display:'flex', alignItems:'center', gap:16}}>
                <div style={{width:50, height:50, borderRadius:'50%', background:'var(--hemo-red)', display:'grid', placeItems:'center', color:'white', fontWeight:800, fontSize:'1.2rem'}}>
                  {request.blood_group}
                </div>
                <div>
                  <h3 style={{margin:0}}>{patient?.full_name || "Confidential Recipient"}</h3>
                  <div style={{fontSize:'0.85rem', opacity:0.6}}>Verified Medical Record</div>
                </div>
              </div>
            </div>

            {/* Target Node */}
            <div className="hemo-profile-card" style={{background: 'var(--bg-700)', padding: 24, borderRadius: 24}}>
              <div style={{fontSize:'0.75rem', fontWeight:800, color:'var(--hemo-red)', marginBottom:12, textTransform:'uppercase'}}>Hospital Node</div>
              <h3 style={{margin:0}}>{hospital?.name || "LifeCare Network Hub"}</h3>
              <div style={{fontSize:'1rem', marginTop:4}}>{hospital?.city || request.city} Sector</div>
              <div style={{fontSize:'0.85rem', opacity:0.6, marginTop:8}}>🏥 Please report to this facility upon confirmation.</div>
            </div>

            <button 
              className="hemo-btn-red" 
              style={{width: '100%', padding: '20px', fontSize: '1.2rem', marginTop: 20}}
              onClick={handlePledge}
              disabled={pledging}
            >
              {pledging ? "Processing Satellite Link..." : "Confirm Life-Saving Pledge"}
            </button>

            <button className="hemo-btn-ghost" onClick={() => navigate("/")} style={{width: '100%'}}>
              Back to Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
