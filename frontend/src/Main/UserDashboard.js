import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { toast } from "react-hot-toast";
import "../hemo.css";
import { Icons } from "../components/Icons";

export default function UserDashboard() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const [tab, setTab] = useState(searchParams.get("tab") || "overview");
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [editForm, setEditForm] = useState({ full_name: "", city: "", phone: "", blood_group: "", address: "" });

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
      blood_group: storedUser.blood_group || "",
      address: storedUser.address || "",
      avatar_url: storedUser.avatar_url || ""
    });

    const fetchData = async () => {
      try {
        const [allReqs, allDons] = await Promise.all([
          api.getBloodRequests(),
          api.getDonations()
        ]);
        setRequests(allReqs); // Keep all requests for donors to see alerts
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
      const updatedUser = { ...user, ...data, avatar_url: editForm.avatar_url };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Identity profile updated");
      setModal(null);
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Secure Session Terminated");
    navigate("/");
  };

  if (loading && !user) {
    return (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'var(--bg-800)'}}>
        <div style={{textAlign:'center'}}>
          <div className="hemo-preloader-spinner" style={{marginBottom: 20}}></div>
          <p style={{color:'var(--text-600)',fontWeight:600,letterSpacing:1.5}}>INITIALIZING SECURE LINK...</p>
        </div>
      </div>
    );
  }

  const isDonor = user?.role === 'donor';
  const completedDons = donations.filter(d => d.status === 'completed').length;

  return (
    <div className="admin-layout" style={{background: 'var(--bg-900)'}}>
      {/* ─── SIDEBAR ─── */}
      <aside className="admin-sidebar" style={{boxShadow: '20px 0 50px rgba(0,0,0,0.2)'}}>
        <div className="admin-sidebar-header" style={{padding: '24px 20px'}}>
          <Link to="/" className="admin-logo" style={{textDecoration:'none', display: 'flex', alignItems: 'center', gap: 12}}>
            <div className="logo-icon" style={{width: 32, height: 32, borderRadius: 8, background: 'var(--hemo-red)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 900}}>H</div>
            <div className="logo-text" style={{fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-100)', letterSpacing: -0.5}}>Hemo<span>HUB</span></div>
          </Link>
        </div>

        <nav className="admin-nav" style={{marginTop: 10, padding: '0 12px'}}>
          <div className="admin-nav-section">
            <div className="admin-nav-label" style={{paddingLeft: 16, marginBottom: 8}}>Operations</div>
            <button className={`admin-nav-item ${tab === "alerts" ? "active" : ""}`} onClick={() => setTab("alerts")}>
              <span className="nav-icon"><Icons.ActivityAlert /></span> <span>Live Alerts</span>
            </button>
            <button className={`admin-nav-item ${tab === "overview" ? "active" : ""}`} onClick={() => setTab("overview")}>
              <span className="nav-icon"><Icons.Overview /></span> <span>Dashboard</span>
            </button>
            <button className={`admin-nav-item ${tab === "profile" ? "active" : ""}`} onClick={() => setTab("profile")}>
              <span className="nav-icon"><Icons.User /></span> <span>Identity Profile</span>
            </button>
            {isDonor ? (
              <button className={`admin-nav-item ${tab === "history" ? "active" : ""}`} onClick={() => setTab("history")}>
                <span className="nav-icon"><Icons.Donations /></span> <span>My Impact</span>
              </button>
            ) : (
              <button className={`admin-nav-item ${tab === "history" ? "active" : ""}`} onClick={() => setTab("history")}>
                <span className="nav-icon"><Icons.Requests /></span> <span>Request Logs</span>
              </button>
            )}
          </div>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-card" style={{background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 12}}>
            <img src={user?.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.full_name}`} alt="Avatar" style={{width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--hemo-red)'}} />
            <div className="admin-user-info">
              <div className="name" style={{fontSize: '0.9rem'}}>{user?.full_name}</div>
              <div className="role" style={{fontSize: '0.7rem'}}>{(user?.role || "").toUpperCase()}</div>
            </div>
          </div>
          <button className="admin-btn admin-btn-ghost" style={{width:'100%', marginTop: 12, justifyContent:'center'}} onClick={handleLogout}>
            <Icons.Logout /> <span>Terminate</span>
          </button>
        </div>
      </aside>

      {/* ─── MAIN AREA ─── */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <span className="section-tag" style={{marginBottom: 4, display:'block', fontSize:'0.7rem', color:'var(--hemo-red)', fontWeight:800, textTransform:'uppercase', letterSpacing:1.5}}>User Terminal</span>
            <h1 style={{margin:0, fontSize:'1.6rem', fontWeight:900, color:'var(--text-100)'}}>
              {tab === "alerts" ? "Live Emergency Alerts" : tab === "overview" ? "System Overview" : tab === "profile" ? "Identity Profile" : "Temporal History"}
            </h1>
          </div>
          <div className="admin-topbar-actions">
            <button className="admin-btn admin-btn-secondary" onClick={handleSync}>
              <Icons.Refresh /> <span>Refresh Logic</span>
            </button>
          </div>
        </div>

        <div className="admin-content">
          {/* ─── ALERTS TAB ─── */}
          {tab === "alerts" && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>Real-Time Life-Saving Opportunities</h2>
              </div>
              <div style={{padding: 24}}>
                {(() => {
                  const filteredPledged = donations.map(d => d.request_id);
                  const activeRequests = Array.isArray(requests) 
                    ? requests.filter(r => r.status === 'approved' && !filteredPledged.includes(r.id) && !dismissedAlerts.includes(r.id)) 
                    : [];

                  const matchingRequests = activeRequests.filter(r => 
                    r.blood_group?.trim().toUpperCase() === user.blood_group?.trim().toUpperCase() &&
                    r.city?.trim().toLowerCase() === user.city?.trim().toLowerCase()
                  );

                  const globalRequests = activeRequests.filter(r => 
                    r.blood_group?.trim().toUpperCase() === user.blood_group?.trim().toUpperCase() &&
                    r.city?.trim().toLowerCase() !== user.city?.trim().toLowerCase()
                  );

                  if (matchingRequests.length === 0 && globalRequests.length === 0) {
                    return (
                      <div style={{textAlign: 'center', padding: '60px', opacity: 0.5}}>
                        <Icons.DoneAll size={64} style={{marginBottom: 20, color: 'var(--hemo-green)'}} />
                        <h3 style={{fontSize: '1.5rem', fontWeight: 800}}>Secure Sector: Zero Active Alerts</h3>
                        <p style={{maxWidth: 400, margin: '0 auto'}}>
                          {activeRequests.length > 0 
                            ? `Detected ${activeRequests.length} external SOS signals, but none currently synchronize with your ${user.blood_group || "unverified"} profile in ${user.city || "this city"}.`
                            : "We'll notify you on your secure communication frequency if an emergency matching your frequency occurs."
                          }
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 24}}>
                      {matchingRequests.map(r => (
                        <div key={r.id} className="glass-card" style={{padding: 24, border: '2px solid var(--hemo-red)', borderRadius: 24, position: 'relative', background: 'rgba(230, 57, 70, 0.03)'}}>
                          <div style={{position: 'absolute', top: 16, right: 16, background: 'var(--hemo-red)', color: '#fff', fontSize: '0.65rem', fontWeight: 900, padding: '6px 12px', borderRadius: 20, letterSpacing: 1}}>LOCAL SOS</div>
                          <div style={{fontSize: '1.6rem', fontWeight: 900, color: 'var(--hemo-red)', marginBottom: 4}}>{r.blood_group} Needed</div>
                          <div style={{fontSize: '0.85rem', marginBottom: 20, opacity: 0.7, fontWeight: 600}}>Sector Node: <span style={{color: 'var(--text-100)'}}>{r.city}</span></div>
                          
                          <div style={{display: 'flex', gap: 12, marginTop: 24}}>
                            <button 
                              className="admin-btn admin-btn-primary" 
                              style={{flex: 1, padding: '14px'}}
                              onClick={async () => {
                                try {
                                  await api.createDonation({
                                    donor_id: user.id,
                                    request_id: r.id,
                                    donation_date: new Date().toISOString().split('T')[0],
                                    status: 'pledged',
                                    units: 1
                                  });
                                  toast.success("Emergency Signal Accepted! Proceed to hospital.");
                                  handleSync();
                                } catch (err) {
                                  toast.error("Hub Sync Failure");
                                }
                              }}
                            >
                              Accept SOS
                            </button>
                            <button 
                              className="admin-btn admin-btn-ghost" 
                              style={{flex: 1}}
                              onClick={() => setDismissedAlerts([...dismissedAlerts, r.id])}
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      ))}

                      {globalRequests.map(r => (
                        <div key={r.id} className="glass-card" style={{padding: 24, border: '1px solid var(--glass-border)', borderRadius: 24, position: 'relative', opacity: 0.9}}>
                          <div style={{position: 'absolute', top: 16, right: 16, background: 'var(--bg-700)', color: 'var(--text-400)', fontSize: '0.65rem', fontWeight: 900, padding: '6px 12px', borderRadius: 20, letterSpacing: 1}}>OUTER SECTOR</div>
                          <div style={{fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-200)', marginBottom: 4}}>{r.blood_group} Needed</div>
                          <div style={{fontSize: '0.85rem', marginBottom: 20, opacity: 0.6}}>Sector Node: <strong>{r.city}</strong></div>
                          
                          <div style={{display: 'flex', gap: 12, marginTop: 24}}>
                            <button 
                              className="admin-btn admin-btn-secondary" 
                              style={{flex: 1}}
                              onClick={async () => {
                                try {
                                  await api.createDonation({
                                    donor_id: user.id,
                                    request_id: r.id,
                                    donation_date: new Date().toISOString().split('T')[0],
                                    status: 'pledged',
                                    units: 1
                                  });
                                  toast.success("External SOS Accepted! Check mission details.");
                                  handleSync();
                                } catch (err) {
                                  toast.error("Pledge sync failed");
                                }
                              }}
                            >
                              Volunteer
                            </button>
                            <button 
                              className="admin-btn admin-btn-ghost" 
                              style={{flex: 0.5}}
                              onClick={() => setDismissedAlerts([...dismissedAlerts, r.id])}
                            >
                              <Icons.Delete size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ─── OVERVIEW TAB ─── */}
          {tab === "overview" && (
            <>
              <div className="admin-stats" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 40}}>
                <div className="admin-stat-card glass-card">
                  <div className="stat-icon red"><Icons.Drop /></div>
                  <div className="stat-value">{donations.reduce((acc, d) => acc + (d.units || 0), 0)}</div>
                  <div className="stat-label">Verified Units Donated</div>
                </div>
                <div className="admin-stat-card glass-card">
                  <div className="stat-icon purple"><Icons.Activity /></div>
                  <div className="stat-value">{user?.blood_group || "??"}</div>
                  <div className="stat-label">Emergency Blood Group</div>
                </div>
                <div className="admin-stat-card glass-card">
                  <div className="stat-icon blue"><Icons.MapPin /></div>
                  <div className="stat-value" style={{fontSize: '1.2rem', padding: '10px 0'}}>{user?.city || "Unknown Sector"}</div>
                  <div className="stat-label">Assigned Node Location</div>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24}}>
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2>Recent Network Activity</h2>
                  </div>
                  <table className="admin-table">
                    <thead>
                      <tr><th>Temporal Point</th><th>Event Type</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {isDonor ? donations.slice(0, 5).map(d => (
                        <tr key={d.id}>
                          <td>{d.donation_date}</td>
                          <td>Donation Pledge Confirmation</td>
                          <td><span className={`admin-badge admin-badge-${d.status}`}>{d.status}</span></td>
                        </tr>
                      )) : requests.slice(0, 5).map(r => (
                        <tr key={r.id}>
                          <td>{new Date(r.created_at).toLocaleDateString()}</td>
                          <td>Emergency Signal (SOS)</td>
                          <td><span className={`admin-badge admin-badge-${r.status}`}>{r.status}</span></td>
                        </tr>
                      ))}
                      {(isDonor ? donations : requests).length === 0 && (
                        <tr><td colSpan="3" align="center" style={{padding: '3rem', opacity: 0.5}}>No activity recorded in recent cycles.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="admin-card" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40}}>
                  <div style={{width: 120, height: 120, background: 'rgba(230, 57, 70, 0.1)', borderRadius: '50%', display: 'grid', placeItems: 'center', color: 'var(--hemo-red)', marginBottom: 20}}>
                    <Icons.Award size={64} />
                  </div>
                  <h3 style={{margin: 0, fontSize: '1.4rem'}}>Level: {completedDons >= 10 ? 'Elite Guardian' : completedDons >= 5 ? 'Elite Donor' : 'Network Hero'}</h3>
                  <p style={{opacity: 0.6, fontSize: '0.9rem', marginTop: 10}}>
                    You have saved approximately {completedDons * 3} lives through the Hemo network cycles.
                  </p>
                  <div style={{width: '100%', marginTop: 24}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, marginBottom: 8}}>
                      <span>Next Rank: {completedDons < 5 ? 'Silver' : 'Gold'}</span>
                      <span>{completedDons} / {completedDons < 5 ? 5 : 10}</span>
                    </div>
                    <div style={{height: 8, background: 'var(--bg-700)', borderRadius: 10, overflow: 'hidden'}}>
                      <div style={{
                        height: '100%', 
                        width: `${Math.min((completedDons / (completedDons < 5 ? 5 : 10)) * 100, 100)}%`,
                        background: 'var(--hemo-red)',
                        borderRadius: 10
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ─── PROFILE TAB ─── */}
          {tab === "profile" && (
            <div className="admin-card" style={{maxWidth: 800}}>
              <div className="admin-card-header">
                <h2>Clinical Identity Settings</h2>
              </div>
              <div style={{padding: 32}}>
                <div style={{display: 'flex', gap: 32, alignItems: 'center', marginBottom: 40}}>
                  <div style={{position: 'relative'}} onClick={() => setModal("avatar")}>
                    <img src={user?.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.full_name}`} alt="Profile" style={{width: 100, height: 100, borderRadius: '24%', border: '2px solid var(--bg-700)', cursor: 'pointer'}} />
                    <div style={{position: 'absolute', bottom: -10, right: -10, background: 'var(--hemo-red)', color: '#fff', padding: 8, borderRadius: '50%', fontSize: '0.8rem'}}><Icons.Camera size={14}/></div>
                  </div>
                  <div>
                    <h3 style={{margin:0, fontSize: '1.4rem'}}>{user?.full_name}</h3>
                    <p style={{margin:0, opacity: 0.6}}>{user?.email} • {(user?.role || "").toUpperCase()} NODE</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 24}}>
                  <div className="admin-modal-field" style={{gridColumn: 'span 2'}}>
                    <label>Assigned Display Name</label>
                    <input className="hemo-input" value={editForm.full_name} onChange={e => setEditForm({...editForm, full_name: e.target.value})} required />
                  </div>
                  <div className="admin-modal-field">
                    <label>Temporal City Zone</label>
                    <input className="hemo-input" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} required />
                  </div>
                  <div className="admin-modal-field">
                    <label>Communication Frequency (Phone)</label>
                    <input className="hemo-input" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                  </div>
                  <div className="admin-modal-field">
                    <label>Biological Group (Blood)</label>
                    <select className="hemo-input" value={editForm.blood_group} onChange={e => setEditForm({...editForm, blood_group: e.target.value})} style={{height: 46}}>
                      {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                  <div className="admin-modal-field" style={{gridColumn: 'span 2'}}>
                    <label>Geographic Node Address</label>
                    <input className="hemo-input" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} placeholder="e.g. 123 Main St, Sector 4" />
                  </div>
                  <div style={{gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: 12}}>
                    <button type="submit" className="admin-btn admin-btn-primary" style={{padding: '12px 32px'}}>Sync Identity Changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ─── HISTORY TAB ─── */}
          {tab === "history" && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>{isDonor ? "Donation Cycle History" : "Emergency Request History"}</h2>
              </div>
              <table className="admin-table">
                <thead>
                  {isDonor ? (
                    <tr><th>Date</th><th>Alert Reference</th><th>Status</th><th>Impact</th></tr>
                  ) : (
                    <tr><th>Request Date</th><th>Blood Group</th><th>Location</th><th>Status</th></tr>
                  )}
                </thead>
                <tbody>
                  {isDonor ? donations.map(d => (
                    <tr key={d.id}>
                      <td><strong>{d.donation_date}</strong></td>
                      <td style={{opacity: 0.6, fontSize: '0.8rem'}}>{d.request_id ? d.request_id.slice(-8).toUpperCase() : "GENERAL"}</td>
                      <td><span className={`admin-badge admin-badge-${d.status}`}>{d.status}</span></td>
                      <td style={{fontWeight: 600}}>{d.status === 'completed' ? (d.units ? `${d.units} Unit(s) Collected` : "1 Unit Verified") : "Wait for Hospital"}</td>
                    </tr>
                  )) : requests.map(r => (
                    <tr key={r.id}>
                      <td>{new Date(r.created_at).toLocaleDateString()}</td>
                      <td><strong style={{color:'var(--hemo-red)'}}>{r.blood_group}</strong></td>
                      <td>{r.city}</td>
                      <td><span className={`admin-badge admin-badge-${r.status}`}>{r.status}</span></td>
                    </tr>
                  ))}
                  {(isDonor ? donations : requests).length === 0 && (
                    <tr><td colSpan="4" style={{textAlign: 'center', padding: '4rem', opacity: 0.5}}>Historical archives are empty. No life-saving data points found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ─── MODALS ─── */}
      {modal === "avatar" && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{maxWidth: 450}}>
            <h3 style={{marginBottom: 20}}>Modify Clinical Identity Avatar</h3>
            <div className="admin-modal-field">
              <label>Identity Image Component</label>
              <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 12}}>
                <img src={editForm.avatar_url || user?.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.full_name}`} alt="Preview" style={{width: 80, height: 80, borderRadius: '24%', border: '2px solid var(--hemo-red)'}} />
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setEditForm({...editForm, avatar_url: reader.result});
                    reader.readAsDataURL(file);
                  }
                }} style={{fontSize: '0.8rem'}} />
              </div>
            </div>
            <div className="admin-modal-actions" style={{marginTop: 32}}>
              <button className="admin-btn admin-btn-ghost" onClick={() => setModal(null)}>Discard</button>
              <button className="admin-btn admin-btn-primary" onClick={handleUpdateProfile}>Synchronize Avatar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
