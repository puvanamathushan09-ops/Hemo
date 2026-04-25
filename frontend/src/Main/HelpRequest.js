import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import "../hemo.css";
import { Icons } from "../components/Icons";

export default function HelpRequest() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [patient, setPatient] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pledging, setPledging] = useState(false);
  const [distanceInfo, setDistanceInfo] = useState(null);

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
        const foundHospital = allHospitals.find(h => h.id === req.hospital_id);
        setHospital(foundHospital);

        // Logistics calculation
        const loggedUser = JSON.parse(localStorage.getItem("user"));
        if (loggedUser && req && foundHospital) {
          try {
            const donorFromDb = allUsers.find(ux => ux.id === loggedUser.id);
            const donorSource = donorFromDb?.address || donorFromDb?.city;
            const hospitalSource = foundHospital?.address || foundHospital?.city || req.city;

            if (donorSource && hospitalSource) {
              const [resD, resH] = await Promise.all([
                fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(donorSource)}&format=json&limit=1`, { headers: { 'Accept-Language': 'en-US,en;q=0.9' } }),
                fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(hospitalSource)}&format=json&limit=1`, { headers: { 'Accept-Language': 'en-US,en;q=0.9' } })
              ]);
              const jsonD = await resD.json();
              const jsonH = await resH.json();

              if (jsonD.length > 0 && jsonH.length > 0) {
                const routeRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${jsonD[0].lon},${jsonD[0].lat};${jsonH[0].lon},${jsonH[0].lat}?overview=false`);
                const routeJson = await routeRes.json();
                if (routeJson.routes && routeJson.routes[0]) {
                  setDistanceInfo({
                    distanceKm: (routeJson.routes[0].distance / 1000).toFixed(1),
                    durationMin: Math.ceil(routeJson.routes[0].duration / 60)
                  });
                }
              }
            }
          } catch(err) {
            console.error("OSRM Route Error:", err);
            setDistanceInfo({ error: true });
          }
        }

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
            <div className="hemo-badge-red" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Icons.ActivityAlert size={16} /> EMERGENCY MATCH</div>
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
              <div style={{fontSize:'0.85rem', opacity:0.6, marginTop:8, display: 'flex', gap: '6px', alignItems: 'center'}}><Icons.Hospitals size={14} /> Please report to this facility upon confirmation.</div>
            </div>

            {/* Logistics Node */}
            {distanceInfo && !distanceInfo.error && (
              <div className="hemo-profile-card" style={{background: 'var(--bg-700)', padding: 24, borderRadius: 24}}>
                <div style={{fontSize:'0.75rem', fontWeight:800, color:'var(--hemo-red)', marginBottom:12, textTransform:'uppercase'}}>Route Logistics</div>
                <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                   <div>
                     <span style={{opacity: 0.6, fontSize: '0.85rem'}}>Est. Travel Distance</span>
                     <div style={{fontSize: '1.2rem', fontWeight: 700}}>{distanceInfo.distanceKm} km</div>
                   </div>
                   <div style={{flex: 1, height: 1, background: 'rgba(255,255,255,0.1)'}}></div>
                   <div>
                     <span style={{opacity: 0.6, fontSize: '0.85rem'}}>Est. Travel Time</span>
                     <div style={{fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px'}}><Icons.Zap size={18} color="#fca311" /> {distanceInfo.durationMin} mins</div>
                   </div>
                </div>
              </div>
            )}

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
