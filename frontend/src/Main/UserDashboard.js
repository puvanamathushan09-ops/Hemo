import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { toast } from "react-hot-toast";
import "../hemo.css";

// Premium SVG Icons
const Icons = {
  Activity: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
  ),
  Award: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
  ),
  Drop: () => (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="currentColor"><path d="M20 3C20 3 7 16.5 7 25.5C7 32.9 12.9 39 20 39C27.1 39 33 32.9 33 25.5C33 16.5 20 3 20 3Z"/></svg>
  ),
  Edit: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
  ),
  Camera: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
  )
};

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Caleb&backgroundColor=d1d4f9",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Avery&backgroundColor=ffd5dc",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=ffdfbf",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia&backgroundColor=c1f2e1"
];

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [editForm, setEditForm] = useState({ full_name: "", city: "", phone: "", blood_group: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }
    if (storedUser.role === "admin") {
      navigate("/admin-dashboard");
      return;
    }
    setUser(storedUser);
    setEditForm({
      full_name: storedUser.full_name,
      city: storedUser.city || "",
      phone: storedUser.phone || "",
      blood_group: storedUser.blood_group || ""
    });

    const fetchData = async () => {
      try {
        const [allReqs, allDons] = await Promise.all([
          api.getBloodRequests(),
          api.getDonations()
        ]);
        setRequests(allReqs.filter(r => r.patient_id === storedUser.id));
        setDonations(allDons.filter(d => d.donor_id === storedUser.id));
      } catch (err) {
        console.error("Dashboard data load error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleSync = () => {
    toast.promise(
      api.getDonations().then(dons => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setDonations(dons.filter(d => d.donor_id === storedUser.id));
      }),
      {
        loading: 'Synchronizing with Secure Hub...',
        success: 'HUD Updated!',
        error: 'Sync Failed'
      }
    );
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.updateUser(user.id, editForm);
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Identity profile updated");
      setModal(null);
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  const handleChangeAvatar = async (url) => {
    try {
      const { data } = await api.updateUser(user.id, { avatar_url: url });
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Avatar modified");
      setModal(null);
    } catch (err) {
      toast.error("Avatar update failed");
    }
  };

  if (loading) return <div className="hemo-preloader-text" style={{padding: '100px', textAlign: 'center'}}>SYNCHRONIZING SECURE NODE...</div>;

  const isDonor = user?.role === 'donor';
  const completedDons = donations.filter(d => d.status === 'completed').length;

  return (
    <div className="hemo-dash-wrap page-content">
      <div className="hemo-form-bg-orb hemo-form-bg-orb-1" />
      <div className="hemo-form-bg-orb hemo-form-bg-orb-2" />
      
      <div className="hemo-section" style={{ maxWidth: 1100, margin: '0 auto' }}>
        
        {/* ─── Profile Hero Section ─── */}
        <div className="admin-card glass-card" style={{ padding: '2rem', marginBottom: '3rem', borderLeft: '4px solid var(--hemo-red)' }} data-aos="fade-down">
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            
            {/* Avatar with Edit Toggle */}
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setModal("avatar")}>
               <div className="profile-avatar-large shadow-glow" style={{ 
                 width: 120, height: 120, borderRadius: '24%', overflow: 'hidden', 
                 background: 'var(--bg-100)', border: '2px solid #fff' 
               }}>
                 <img src={user?.avatar_url || "https://api.dicebear.com/7.x/identicon/svg?seed=default"} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
               <div style={{ 
                 position: 'absolute', bottom: -5, right: -5, background: 'var(--hemo-red)', 
                 color: '#fff', width: 32, height: 32, borderRadius: '50%', 
                 display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #fff' 
               }}>
                 <Icons.Camera />
               </div>
            </div>

            {/* Profile Content */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="section-tag" style={{ border: '1px solid var(--hemo-red)', borderRadius: 4, padding: '2px 8px', fontSize: '0.7rem' }}>
                    {user?.role?.toUpperCase()} NODE
                  </span>
                  <h1 style={{ marginTop: '0.5rem', fontSize: '1.8rem', fontWeight: 800 }}>{user?.full_name}</h1>
                  <p style={{ color: 'var(--text-400)', fontSize: '0.95rem', margin: '4px 0' }}>{user?.city || "Location Not Set"} • Registered Member</p>
                  
                  {/* Milestone Badges */}
                  <div style={{display:'flex', gap:8, marginTop:12}}>
                    <span className={`hemo-badge-${completedDons >= 1 ? 'red' : 'ghost'}`} style={{fontSize:'0.65rem', fontWeight:800}}>BRONZE MEMBER</span>
                    {completedDons >= 5 && <span className="hemo-badge-red" style={{fontSize:'0.65rem', fontWeight:800}}>SILVER HERO</span>}
                    {completedDons >= 10 && <span className="hemo-badge-red" style={{fontSize:'0.65rem', fontWeight:800}}>GOLD GUARDIAN</span>}
                  </div>
                </div>

                <div style={{textAlign:'right', display:'flex', gap: 10, justifyContent:'flex-end'}}>
                  <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={handleSync}>
                    🔄 Sync Hub
                  </button>
                  <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => {
                    setEditForm({ full_name: user.full_name, city: user.city, phone: user.phone, blood_group: user.blood_group, avatar_url: user.avatar_url });
                    setModal("editProfile");
                  }}>
                    <Icons.Edit /> Edit Node
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
                 <div className="profile-hero-stat">
                    <span className="lbl">Blood Group</span>
                    <span className="val" style={{ color: 'var(--hemo-red)' }}>{user?.blood_group || "??"}</span>
                 </div>
                 <div className="profile-hero-stat">
                    <span className="lbl">Mobile Line</span>
                    <span className="val">{user?.phone || "N/A"}</span>
                 </div>
                 <div className="profile-hero-stat">
                    <span className="lbl">Contribution</span>
                    <span className="val">{completedDons} Units</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* ─── Impact & Progress HUD ─── */}
        <div data-aos="fade-up" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:24, marginBottom:40, marginTop: '2rem'}}>
          
          {/* Donation Unit Counter */}
          <div className="admin-card glass-card" style={{padding:30}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
              <div>
                <div style={{fontSize:'0.75rem', fontWeight:800, color:'var(--hemo-red)', textTransform:'uppercase', marginBottom:8}}>Verified Contribution</div>
                <div style={{fontSize:'2.8rem', fontWeight:800}}>{completedDons} <span style={{fontSize:'1.2rem', opacity:0.3, fontWeight:500}}>Units</span></div>
              </div>
              <div style={{background:'rgba(230, 57, 70, 0.1)', padding:15, borderRadius:20, color:'var(--hemo-red)'}}>
                <Icons.Drop />
              </div>
            </div>
            
            <div style={{marginTop: 24}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem', fontWeight:700, marginBottom:10}}>
                <span style={{opacity:0.6}}>Next Milestone: {completedDons < 5 ? 'Silver' : 'Gold'}</span>
                <span style={{color:'var(--hemo-red)'}}>{completedDons} / {completedDons < 5 ? 5 : 10}</span>
              </div>
              <div style={{height: 10, background: 'rgba(0,0,0,0.05)', borderRadius: 10, overflow: 'hidden'}}>
                <div style={{
                  height: '100%', 
                  width: `${Math.min((completedDons / (completedDons < 5 ? 5 : 10)) * 100, 100)}%`,
                  background: 'linear-gradient(90deg, #e63946, #ff6b6b)',
                  borderRadius: 10,
                  transition: '1.5s cubic-bezier(0.16, 1, 0.3, 1)'
                }}></div>
              </div>
            </div>
          </div>

          {/* Activity/Donor Standing */}
          <div className="admin-card glass-card" style={{padding:30, display:'flex', flexDirection:'column', justifyContent:'center'}}>
            <div style={{fontSize:'0.75rem', fontWeight:800, color:'var(--text-400)', textTransform:'uppercase', marginBottom:12}}>Status Level</div>
            <h2 style={{margin:0, fontSize:'1.8rem'}}>{completedDons >= 10 ? 'Elite Guardian' : completedDons >= 5 ? 'Elite Donor' : 'Network Hero'}</h2>
            <p style={{fontSize:'0.9rem', opacity:0.6, marginTop:8}}>Your verified contributions have helped save up to {completedDons * 3} lives across the network.</p>
          </div>
        </div>

        {/* ─── Conditional Tables ─── */}
        {!isDonor && (
          <div className="admin-card" style={{ marginTop: '2rem' }} data-aos="fade-up">
            <div className="admin-card-header">
              <h2>My Blood Requests Tracker</h2>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>Blood Group</th><th>Location</th><th>Status</th><th>Request Date</th></tr>
              </thead>
              <tbody>
                {requests.length > 0 ? requests.map(r => (
                  <tr key={r.id}>
                    <td><strong style={{ color: 'var(--hemo-red)' }}>{r.blood_group}</strong></td>
                    <td>{r.city}</td>
                    <td><span className={`admin-badge admin-badge-${r.status}`}>{r.status}</span></td>
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-600)' }}>
                    No active requests. <Link to="/request" style={{ color: 'var(--hemo-red)', fontWeight: 700 }}>Initiate Request &rarr;</Link>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {isDonor && (
          <div className="admin-card" style={{ marginTop: '2rem', marginBottom: '5rem' }} data-aos="fade-up">
            <div className="admin-card-header">
              <h2>Donation Lifecycle History</h2>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>Scheduled Date</th><th>Alert Reference</th><th>Status</th><th>Impact</th></tr>
              </thead>
              <tbody>
                {donations.length > 0 ? donations.map(d => (
                  <tr key={d.id}>
                    <td><strong>{d.donation_date}</strong></td>
                    <td style={{ opacity: 0.6, fontSize: '0.8rem' }}>{d.request_id ? d.request_id.slice(-8).toUpperCase() : "GENERAL"}</td>
                    <td><span className={`admin-badge admin-badge-${d.status}`}>{d.status}</span></td>
                    <td style={{ fontWeight: 600 }}>{d.status === 'completed' ? "1 Unit Red Cell" : "—"}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-600)' }}>
                    Your donation list is clear. <Link to="/donate" style={{ color: 'var(--hemo-red)', fontWeight: 700 }}>Find a Patient &rarr;</Link>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Modals ─── */}
      {modal === "avatar" && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
           <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 450 }}>
              <h3>Select Clinical Avatar</h3>
              <div className="admin-modal-field" style={{marginBottom: 20}}>
                <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>Profile Identity Image</label>
                <div style={{display:'flex', alignItems:'center', gap: 16}}>
                  <img 
                    src={editForm.avatar_url || user.avatar_url} 
                    className="hemo-avatar" 
                    style={{width:64, height:64, border:'2px solid var(--hemo-red)', borderRadius: '50%'}} 
                    alt="Preview"
                  />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setEditForm({...editForm, avatar_url: reader.result});
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{fontSize:'0.8rem'}}
                  />
                </div>
              </div>
              <div className="admin-modal-actions" style={{ marginTop: '1.5rem' }}>
                 <button className="admin-btn admin-btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                 <button className="admin-btn admin-btn-primary" onClick={handleUpdateProfile}>Save Avatar</button>
              </div>
           </div>
        </div>
      )}

      {modal === "editProfile" && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
           <div className="admin-modal" onClick={e => e.stopPropagation()}>
              <h3>Update Identity Profile</h3>
              <form onSubmit={handleUpdateProfile}>
                 <div className="admin-modal-field">
                    <label>Full Display Name</label>
                    <input className="hemo-input" value={editForm.full_name} onChange={e => setEditForm({...editForm, full_name: e.target.value})} required />
                 </div>
                 <div className="admin-modal-field">
                    <label>Current Location (City)</label>
                    <input className="hemo-input" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} required />
                 </div>
                 <div className="admin-modal-field">
                    <label>Mobile Contact</label>
                    <input className="hemo-input" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                 </div>
                 <div className="admin-modal-field">
                    <label>Medical Group (Blood Group)</label>
                    <select className="hemo-input" value={editForm.blood_group} onChange={e => setEditForm({...editForm, blood_group: e.target.value})} style={{ height: 46 }}>
                       {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                 </div>
                 <div className="admin-modal-actions" style={{ marginTop: '1rem' }}>
                    <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setModal(null)}>Discard</button>
                    <button type="submit" className="admin-btn admin-btn-primary">Commit Changes</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
