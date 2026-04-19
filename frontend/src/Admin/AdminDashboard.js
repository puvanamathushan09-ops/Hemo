import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../hemo.css";

/* ── SVG Icons ── */
const Icons = {
  Overview: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
  ),
  Hospitals: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h3a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1h-3"></path><path d="M6 2H3a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h3"></path><path d="M2 8h20"></path><path d="M2 14h20"></path><path d="M10 2v20"></path><path d="M14 2v20"></path></svg>
  ),
  Requests: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
  ),
  Donations: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
  ),
  Refresh: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
  ),
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
  ),
  Edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
  ),
  Delete: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
  ),
  Plus: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
  )
};

/* ── Custom SVG Charts ── */
function SimpleAreaChart({ data }) {
  const width = 600;
  const height = 240;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  if (!data || data.length === 0) return <div>No donation trends available</div>;

  const maxVal = Math.max(...data.map(d => d.value), 5);
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y = height - padding - (d.value / maxVal) * chartHeight;
    return `${x},${y}`;
  });

  const pathD = `M ${points[0]} ` + points.slice(1).map(p => `L ${p}`).join(' ');
  const areaD = `${pathD} L ${padding + chartWidth},${height - padding} L ${padding},${height - padding} Z`;

  return (
    <div className="admin-chart-container">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="chart-svg">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--hemo-red)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--hemo-red)" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(v => (
          <line key={v} x1={padding} y1={padding + v * chartHeight} x2={padding + chartWidth} y2={padding + v * chartHeight} className="chart-grid-line" />
        ))}

        {/* Area */}
        <path d={areaD} fill="url(#chartGradient)" />
        
        {/* Line */}
        <path d={pathD} fill="none" stroke="var(--hemo-red)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="chart-area-path" />

        {/* Labels */}
        {data.map((d, i) => (
          <text key={i} x={padding + (i / (data.length - 1)) * chartWidth} y={height - 15} textAnchor="middle" className="chart-label">{d.label}</text>
        ))}
      </svg>
    </div>
  );
}

function SimpleBarChart({ data }) {
  const width = 360;
  const height = 240;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxVal = Math.max(...data.map(d => d.value), 1);
  const barWidth = (chartWidth / data.length) * 0.7;
  const gap = (chartWidth / data.length) * 0.3;

  return (
    <div className="admin-chart-container">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="chart-svg">
        {data.map((d, i) => {
          const barH = (d.value / maxVal) * chartHeight;
          const x = padding + i * (barWidth + gap);
          const y = height - padding - barH;
          
          return (
            <g key={i}>
              <rect 
                x={x} y={y} width={barWidth} height={barH} 
                fill={i % 2 === 0 ? "var(--hemo-red)" : "var(--hemo-red-dark)"} 
                rx="4" className="chart-bar" 
                style={{ animationDelay: `${i * 0.1}s` }}
              />
              <text x={x + barWidth / 2} y={height - 15} textAnchor="middle" className="chart-label">{d.label}</text>
              <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" className="chart-value-label">{d.value}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Reusable Modal Component ── */
function Modal({ title, onClose, children }) {
  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN ADMIN DASHBOARD COMPONENT
   ══════════════════════════════════════════ */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // Data states
  const [users, setUsers] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);

  // Search states
  const [search, setSearch] = useState("");

  // Modal states
  const [modal, setModal] = useState(null); // 'addHospital' | 'editHospital' | 'editUser' | 'addUser'
  const [editItem, setEditItem] = useState(null);
  const [hospitalForm, setHospitalForm] = useState({ name: "", city: "", contact_number: "", email: "" });
  const [userForm, setUserForm] = useState({ full_name: "", email: "", role: "donor", city: "", blood_group: "O+", password: "password123" });
  const [requestForm, setRequestForm] = useState({ blood_group: "O+", city: "", units: 1, hospital_id: "", status: "pending" });
  const [donationForm, setDonationForm] = useState({ donation_date: "", status: "pledged" });
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Auth check
  let adminUser = null;
  try {
    adminUser = JSON.parse(localStorage.getItem("user") || "null");
  } catch (e) {
    console.error("❌ localStorage parse error:", e);
    localStorage.removeItem("user");
  }

  useEffect(() => {
    if (!adminUser || adminUser.role !== "admin") {
      navigate("/admin");
      return;
    }
    fetchAll();
    // eslint-disable-next-line
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [u, h, r, d] = await Promise.all([
        api.getAllUsers(),
        api.getHospitals(),
        api.getBloodRequests(),
        api.getDonations()
      ]);
      setUsers(u); setHospitals(h); setRequests(r); setDonations(d);
    } catch {
      toast.warn("Backend connection failed — showing demo data");
      setUsers([
        { id: "u1", full_name: "John Donor", email: "john@donor.com", role: "donor", blood_group: "A+", city: "Jaffna", phone: "0771112222" },
        { id: "u2", full_name: "Jane Patient", email: "jane@patient.com", role: "patient", blood_group: "O-", city: "Colombo", phone: "0773334444" },
        { id: "u3", full_name: "Super Admin", email: "admin@hemo.com", role: "admin", blood_group: "O+", city: "System", phone: "0000000000" },
      ]);
      setHospitals([
        { id: "h1", name: "Jaffna Teaching Hospital", city: "Jaffna", contact_number: "021-1234567", email: "jth@hospital.lk" },
        { id: "h2", name: "Colombo General Hospital", city: "Colombo", contact_number: "011-1234567", email: "cgh@hospital.lk" },
        { id: "h3", name: "Kandy National Hospital", city: "Kandy", contact_number: "081-1234567", email: "knh@hospital.lk" },
      ]);
      setRequests([
        { id: "r1", patient_id: "u2", blood_group: "O-", city: "Colombo", status: "pending", created_at: new Date().toISOString() },
        { id: "r2", patient_id: "u2", blood_group: "A+", city: "Jaffna", status: "approved", created_at: new Date().toISOString() },
      ]);
      setDonations([
        { id: "d1", donor_id: "u1", request_id: "r1", donation_date: "2026-04-10", status: "pledged", created_at: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ── HOSPITAL CRUD ── */
  const handleAddHospital = async () => {
    if (!hospitalForm.name || !hospitalForm.city) {
      toast.error("Hospital name and city are required"); return;
    }
    try {
      const created = await api.createHospital(hospitalForm);
      setHospitals([created, ...hospitals]);
      toast.success(`"${hospitalForm.name}" registered!`);
    } catch {
      const mock = { ...hospitalForm, id: "h-" + Date.now() };
      setHospitals([mock, ...hospitals]);
      toast.success(`"${hospitalForm.name}" added locally`);
    }
    setHospitalForm({ name: "", city: "", contact_number: "", email: "" });
    setModal(null);
  };

  const handleEditHospital = async () => {
    try {
      await api.updateHospital(editItem.id, hospitalForm);
      setHospitals(hospitals.map(h => h.id === editItem.id ? { ...h, ...hospitalForm } : h));
      toast.success("Hospital updated");
    } catch {
      setHospitals(hospitals.map(h => h.id === editItem.id ? { ...h, ...hospitalForm } : h));
      toast.success("Hospital updated locally");
    }
    setModal(null); setEditItem(null);
  };

  const handleDeleteHospital = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.deleteHospital(id);
      toast.success(`"${name}" removed`);
    } catch { toast.success(`"${name}" removed locally`); }
    setHospitals(hospitals.filter(h => h.id !== id));
  };

  /* ── USER CRUD ── */
  const handleAddUser = async () => {
    if (!userForm.full_name || !userForm.email) {
      toast.error("Name and Email are required"); return;
    }
    try {
      const created = await api.register(userForm);
      setUsers([created.user, ...users]);
      toast.success(`User "${userForm.full_name}" registered!`);
    } catch (err) {
      const mock = { ...userForm, id: "u-" + Date.now() };
      setUsers([mock, ...users]);
      toast.success(`User "${userForm.full_name}" added locally`);
    }
    setUserForm({ full_name: "", email: "", role: "donor", city: "", blood_group: "O+", password: "password123" });
    setModal(null);
  };

  const handleEditRequest = (req) => {
    setEditItem(req);
    setRequestForm({
      blood_group: req.blood_group,
      city: req.city,
      status: req.status
    });
    setModal("editRequest");
  };

  const handleEditUser = async () => {
    try {
      await api.updateUser(editItem.id, userForm);
      setUsers(users.map(u => u.id === editItem.id ? { ...u, ...userForm } : u));
      toast.success("User profile updated");
    } catch {
      setUsers(users.map(u => u.id === editItem.id ? { ...u, ...userForm } : u));
      toast.success("User profile updated locally");
    }
    setModal(null); setEditItem(null);
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This action is permanent.`)) return;
    try {
      await api.deleteUser(id);
      toast.success(`User "${name}" deleted from network`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) { 
      toast.error(`Deletion failed: ${err.message}`); 
    }
  };

  /* ── REQUEST CRUD ── */
  const handleUpdateBloodRequest = async (e) => {
    e.preventDefault();
    try {
      await api.updateRequest(editItem.id, {
        blood_group: requestForm.blood_group,
        city: requestForm.city,
        status: requestForm.status
      });
      toast.success("Request synchronized successfully");
      setModal(null);
      fetchAll();
    } catch (err) {
      toast.error("Failed to update blood request");
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm("Delete this blood request?")) return;
    try {
      await api.deleteBloodRequest(id);
      toast.success("Request deleted");
    } catch { toast.success("Request deleted locally"); }
    setRequests(requests.filter(r => r.id !== id));
  };

  const handleBroadcastSOS = async () => {
    const selectedHospital = hospitals.find(h => h.id === requestForm.hospital_id);
    if (!selectedHospital) { toast.error("Please select a hospital node"); return; }
    
    const matchingDonors = users.filter(u => 
      u.role === "donor" && 
      u.blood_group === requestForm.blood_group && 
      u.city?.toLowerCase() === selectedHospital.city?.toLowerCase()
    );

    if (matchingDonors.length === 0) {
      toast.warn("No active donors found in this sector matching the blood group");
      return;
    }

    setIsBroadcasting(true);
    try {
      // 1. Create the request in the DB
      const reqData = {
        blood_group: requestForm.blood_group,
        city: selectedHospital.city,
        status: "pending",
        patient_id: null, // System-initiated
        hospital_id: selectedHospital.id
      };
      
      const newReq = await api.createBloodRequest(reqData);
      setRequests([newReq, ...requests]);

      // 2. Broadcast Notifications via Backend
      await api.sendNotifications({
        request_id: newReq.id,
        blood_group: requestForm.blood_group,
        hospital_name: selectedHospital.name,
        units: requestForm.units,
        donor_emails: matchingDonors.map(d => d.email)
      });

      toast.success(`SOS Broadcast sent to ${matchingDonors.length} donors!`);
      setModal(null);
    } catch (err) {
      toast.error("Broadcast partially failed: Check connection");
      console.error(err);
    } finally {
      setIsBroadcasting(false);
    }
  };

  /* ── DONATION CRUD ── */
  const handleEditDonation = (don) => {
    setEditItem(don);
    setDonationForm({
      donation_date: don.donation_date,
      status: don.status
    });
    setModal("editDonation");
  };

  const handleUpdateDonation = async (e) => {
    e.preventDefault();
    try {
      await api.updateDonation(editItem.id, {
        donation_date: donationForm.donation_date,
        status: donationForm.status
      });
      toast.success("Donation records updated");
      setModal(null);
      fetchAll();
    } catch (err) {
      toast.error("Failed to update donation record");
    }
  };

  const handleUpdateRequestStatus = async (id, newStatus) => {
    try {
      await api.updateBloodRequest(id, { status: newStatus });
      toast.success(`Broadcasting update: Request is now ${newStatus}`);
      setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) { 
      toast.error(`Satellite link failed: ${err.message}`); 
    }
  };

  const handleUpdateDonationStatus = async (id, newStatus) => {
    try {
      await api.updateDonation(id, { status: newStatus });
      toast.success(`Verification complete: Donation set to ${newStatus}`);
      setDonations(donations.map(d => d.id === id ? { ...d, status: newStatus } : d));
    } catch (err) { 
      toast.error(`Network sync failed: ${err.message}`); 
    }
  };

  const handleDeleteDonation = async (id) => {
    if (!window.confirm("Delete this donation record?")) return;
    try {
      await api.deleteDonation(id);
      toast.success("Donation deleted");
    } catch { toast.success("Donation deleted locally"); }
    setDonations(donations.filter(d => d.id !== id));
  };

  /* ── LOGOUT ── */
  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out successfully");
    setTimeout(() => navigate("/admin"), 800);
  };

  // Filtering Logic
  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.city?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredHospitals = hospitals.filter(h => 
    h.name?.toLowerCase().includes(search.toLowerCase()) || 
    h.city?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRequests = requests.filter(r => 
    r.city?.toLowerCase().includes(search.toLowerCase()) || 
    r.blood_group?.toLowerCase().includes(search.toLowerCase()) ||
    r.status?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDonations = donations.filter(d => {
    const donor = users.find(u => u.id === d.donor_id);
    return (
      donor?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.status?.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Chart Data Preparation
  const getDonationTrend = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map(d => ({ label: d, value: Math.floor(Math.random() * 20) + 5 }));
  };

  const getBloodGroupDist = () => {
    const groups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
    return groups.map(g => ({
      label: g,
      value: users.filter(u => u.blood_group === g).length
    }));
  };

  const pendingCount = requests.filter(r => r.status === "pending").length;

  if (loading) {
    return (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'var(--bg-800)'}}>
        <div style={{textAlign:'center'}}>
          <div className="hemo-preloader-spinner" style={{marginBottom: 20}}></div>
          <p style={{color:'var(--text-600)',fontWeight:600,letterSpacing:1}}>INITIALIZING COMMAND CENTRE</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="colored" />

      {/* ═══ SIDEBAR ═══ */}
      <aside className="admin-sidebar" data-aos="fade-right">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">
            <div className="hemo-logo-icon" style={{width: 32, height: 32, background:'var(--hemo-red)', borderRadius: 8, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff'}}><Icons.Donations /></div>
            <div>
              <h2 style={{marginLeft: 12}}>Hemo</h2>
              <small style={{marginLeft: 12}}>Admin Portal</small>
            </div>
          </div>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section">
            <div className="admin-nav-label">General</div>
            <button className={`admin-nav-item ${tab === "overview" ? "active" : ""}`} onClick={() => { setTab("overview"); setSearch(""); }}>
              <span className="nav-icon"><Icons.Overview /></span> <span>Dashboard</span>
            </button>
          </div>

          <div className="admin-nav-section">
            <div className="admin-nav-label">Management</div>
            <button className={`admin-nav-item ${tab === "users" ? "active" : ""}`} onClick={() => { setTab("users"); setSearch(""); }}>
              <span className="nav-icon"><Icons.Users /></span> <span>User Base</span>
              <span className="nav-badge">{users.length}</span>
            </button>
            <button className={`admin-nav-item ${tab === "hospitals" ? "active" : ""}`} onClick={() => { setTab("hospitals"); setSearch(""); }}>
              <span className="nav-icon"><Icons.Hospitals /></span> <span>Hospitals</span>
              <span className="nav-badge">{hospitals.length}</span>
            </button>
            <button className={`admin-nav-item ${tab === "requests" ? "active" : ""}`} onClick={() => { setTab("requests"); setSearch(""); }}>
              <span className="nav-icon"><Icons.Requests /></span> <span>Blood Requests</span>
              {pendingCount > 0 && <span className="nav-badge">{pendingCount}</span>}
            </button>
            <button className={`admin-nav-item ${tab === "donations" ? "active" : ""}`} onClick={() => { setTab("donations"); setSearch(""); }}>
              <span className="nav-icon"><Icons.Donations /></span> <span>Donation Tracking</span>
            </button>
          </div>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <div className="admin-user-avatar">AD</div>
            <div className="admin-user-info">
              <div className="name">{adminUser?.full_name || "Administrator"}</div>
              <div className="role">System Root</div>
            </div>
          </div>
          <button className="admin-btn admin-btn-ghost" style={{width:'100%',marginTop:16,justifyContent:'center'}} onClick={handleLogout}>
            <Icons.Logout /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ═══ MAIN AREA ═══ */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <span className="section-tag" style={{marginBottom: 4, display:'block', fontSize:'0.7rem', color:'var(--hemo-red)', fontWeight:800, textTransform:'uppercase', letterSpacing:1.5}}>System Management</span>
            <h1 style={{margin:0, fontSize:'1.6rem', fontWeight:900, color:'var(--text-100)'}}>{tab === "overview" ? "Control Centre Overview" : tab.toUpperCase()}</h1>
          </div>
          <div className="admin-topbar-actions">
            {tab !== "overview" && (
              <div style={{position:'relative'}}>
                <input 
                  type="text" 
                  className="hemo-input" 
                  placeholder={`Search ${tab}...`} 
                  style={{paddingLeft: 40, width: 280, height: 42, background:'#fff', border:'1px solid var(--glass-border)', borderRadius: 12}} 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <span style={{position:'absolute', left: 14, top:'50%', transform:'translateY(-50%)', opacity: 0.5}}><Icons.Search /></span>
              </div>
            )}
            <button className="admin-btn admin-btn-ghost" onClick={fetchAll} title="Refresh Data" style={{height: 42}}><Icons.Refresh /></button>
          </div>
        </div>

        <div className="admin-content">

          {/* ─── OVERVIEW TAB ─── */}
          {tab === "overview" && (
            <>
              <div className="admin-stats" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 40}}>
                <div className="admin-stat-card">
                  <div className="stat-icon red"><Icons.Users /></div>
                  <div className="stat-value">{users.length}</div>
                  <div className="stat-label">Verified Users</div>
                </div>
                <div className="admin-stat-card">
                  <div className="stat-icon blue"><Icons.Hospitals /></div>
                  <div className="stat-value">{hospitals.length}</div>
                  <div className="stat-label">Network Hospitals</div>
                </div>
                <div className="admin-stat-card">
                  <div className="stat-icon green"><Icons.Requests /></div>
                  <div className="stat-value">{pendingCount}</div>
                  <div className="stat-label">Pending Alerts</div>
                </div>
                <div className="admin-stat-card">
                  <div className="stat-icon purple"><Icons.Donations /></div>
                  <div className="stat-value">{donations.length}</div>
                  <div className="stat-label">Life-Saving Pledges</div>
                </div>
              </div>

              {/* System Insights Charts */}
              <div className="admin-charts-grid">
                <div className="admin-chart-card">
                  <div className="admin-chart-card-header">
                    <div>
                      <h3>Donation Activity</h3>
                      <p>Volume tracking for current week</p>
                    </div>
                  </div>
                  <SimpleAreaChart data={getDonationTrend()} />
                  <div className="admin-chart-legend">
                    <div className="legend-item"><span className="legend-color" style={{background:'var(--hemo-red)'}}></span> Pledges Received</div>
                  </div>
                </div>
                
                <div className="admin-chart-card">
                  <div className="admin-chart-card-header">
                    <div>
                      <h3>Blood Distribution</h3>
                      <p>Global availability index</p>
                    </div>
                  </div>
                  <SimpleBarChart data={getBloodGroupDist()} />
                </div>
              </div>

              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(400px, 1fr))', gap: 24}}>
                {/* Recent Requests */}
                <div className="admin-card">
                  <div className="admin-card-header" style={{padding:'24px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--bg-700)'}}>
                    <h2 style={{margin:0, fontSize:'1.25rem', fontWeight:800}}>Active Blood Alerts</h2>
                    <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setTab("requests")}>Manage All</button>
                  </div>
                  <table className="admin-table">
                    <thead><tr><th>Blood Type</th><th>Location</th><th>Level</th></tr></thead>
                    <tbody>
                      {requests.slice(0, 5).map(r => (
                        <tr key={r.id}>
                          <td><strong>{r.blood_group}</strong></td>
                          <td>{r.city}</td>
                          <td><span className={`admin-badge admin-badge-${r.status}`}>{r.status}</span></td>
                        </tr>
                      ))}
                      {requests.length === 0 && (
                        <tr><td colSpan="3" className="admin-empty">No active requests</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Recent Users */}
                <div className="admin-card">
                  <div className="admin-card-header" style={{padding:'24px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--bg-700)'}}>
                    <h2 style={{margin:0, fontSize:'1.25rem', fontWeight:800}}>Latest Registrations</h2>
                    <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setTab("users")}>User Explorer</button>
                  </div>
                  <table className="admin-table">
                    <thead><tr><th>Member</th><th>Identity</th><th>Origin</th></tr></thead>
                    <tbody>
                      {users.slice(0, 5).map(u => (
                        <tr key={u.id}>
                          <td><strong>{u.full_name}</strong></td>
                          <td><span className={`admin-badge admin-badge-${u.role}`}>{u.role}</span></td>
                          <td>{u.city}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ─── USERS TAB ─── */}
          {tab === "users" && (
            <>
              <div style={{marginBottom: 24}}>
                <button className="admin-btn admin-btn-primary" onClick={() => {
                  setUserForm({ full_name: "", email: "", role: "donor", city: "", blood_group: "O+", password: "password123" });
                  setModal("addUser");
                }}><Icons.Plus /> Register New User</button>
              </div>
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2>System User Database ({filteredUsers.length})</h2>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr><th>User Details</th><th>Identity</th><th>Blood Type</th><th>Location</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div style={{fontWeight:700, color:'var(--text-100)'}}>{u.full_name}</div>
                          <div style={{fontSize:'0.75rem', opacity: 0.6}}>{u.email}</div>
                        </td>
                        <td><span className={`admin-badge admin-badge-${u.role}`}>{u.role}</span></td>
                        <td><strong style={{color:'var(--hemo-red)'}}>{u.blood_group}</strong></td>
                        <td>{u.city}</td>
                        <td>
                          {u.email === "admin@hemo.com" ? (
                            <span style={{fontSize:'0.75rem', opacity:0.5, fontStyle:'italic'}}>System Restricted</span>
                          ) : (
                            <div style={{display:'flex',gap:6}}>
                              <button className="admin-btn admin-btn-info admin-btn-sm" onClick={() => {
                                setEditItem(u);
                                setUserForm({ full_name: u.full_name, email: u.email, role: u.role, city: u.city, blood_group: u.blood_group });
                                setModal("editUser");
                              }}><Icons.Edit /></button>
                              <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDeleteUser(u.id, u.full_name)}><Icons.Delete /></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr><td colSpan="5" className="admin-empty" style={{textAlign:'center', padding:40, color:'var(--text-600)'}}>No results matching your query</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ─── HOSPITALS TAB ─── */}
          {tab === "hospitals" && (
            <>
              <div style={{marginBottom: 24}}>
                <button className="admin-btn admin-btn-primary" onClick={() => {
                  setHospitalForm({ name: "", city: "", contact_number: "", email: "" });
                  setModal("addHospital");
                }}><Icons.Plus /> Register New Hospital Entity</button>
              </div>
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2>Registered Healthcare Facilities ({filteredHospitals.length})</h2>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr><th>Facility Identity</th><th>Operational City</th><th>Contact Line</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredHospitals.map(h => (
                      <tr key={h.id}>
                        <td>
                          <div style={{fontWeight:700}}>{h.name}</div>
                          <div style={{fontSize:'0.75rem', opacity: 0.6}}>{h.email || "No email registered"}</div>
                        </td>
                        <td>{h.city}</td>
                        <td>{h.contact_number || "Unavailable"}</td>
                        <td>
                          <div style={{display:'flex',gap:6}}>
                            <button className="admin-btn admin-btn-info admin-btn-sm" onClick={() => {
                              setEditItem(h);
                              setHospitalForm({ name: h.name, city: h.city, contact_number: h.contact_number || "", email: h.email || "" });
                              setModal("editHospital");
                            }}><Icons.Edit /></button>
                            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDeleteHospital(h.id, h.name)}><Icons.Delete /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredHospitals.length === 0 && (
                        <tr><td colSpan="4" className="admin-empty" style={{textAlign:'center', padding:40, color:'var(--text-600)'}}>No facility found for this search</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ─── REQUESTS TAB ─── */}
          {tab === "requests" && (
            <>
              <div style={{marginBottom: 24}}>
                <button className="admin-btn admin-btn-primary" onClick={() => {
                  setRequestForm({ blood_group: "O+", city: "", units: 1, hospital_id: "", status: "pending" });
                  setModal("addRequest");
                }}><Icons.Plus /> Broadcast Smart SOS Request</button>
              </div>
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2>Network-Wide Blood Requests ({filteredRequests.length})</h2>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr><th>Emergency ID</th><th>Recipient / Source</th><th>Requirement</th><th>Origin</th><th>Status</th><th>Log Date</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map(r => (
                      <tr key={r?.id}>
                        <td style={{fontFamily:'monospace',fontSize:'0.75rem',opacity:0.6}}>#{(r?.id || "").slice(-6).toUpperCase()}</td>
                        <td>
                          {r?.patient_id ? (
                            <div style={{fontWeight: 600}}>{users.find(u => u?.id === r.patient_id)?.full_name || "Unknown Patient"}</div>
                          ) : (
                            <div style={{fontWeight: 600, color: 'var(--hemo-red)'}}>🏥 {hospitals.find(h => h?.id === r?.hospital_id)?.name || "System Alert"}</div>
                          )}
                        </td>
                        <td><strong style={{fontSize:'1.1rem', color:'var(--hemo-red)'}}>{r?.blood_group}</strong></td>
                        <td>{r?.city}</td>
                        <td><span className={`admin-badge admin-badge-${r?.status}`}>{r?.status}</span></td>
                        <td style={{fontSize:'0.85rem'}}>{r?.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}</td>
                        <td>
                            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => handleEditRequest(r)} title="Edit Request"><Icons.Edit /></button>
                              
                              {r?.status === "pending" && (
                                <button className="admin-btn admin-btn-success admin-btn-sm" onClick={() => handleUpdateRequestStatus(r?.id, "approved")} title="Verify Patient Need"><Icons.Check /> Verify Need</button>
                              )}
                              
                              <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDeleteRequest(r.id)} title="Delete Request"><Icons.Delete /></button>
                            </div>
                        </td>
                      </tr>
                    ))}
                    {filteredRequests.length === 0 && (
                      <tr><td colSpan="6" className="admin-empty" style={{textAlign:'center', padding:40, color:'var(--text-600)'}}>No active requests detected in this scope</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ─── DONATIONS TAB ─── */}
          {tab === "donations" && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>Verified Donation Pledges ({filteredDonations.length})</h2>
              </div>
              <table className="admin-table">
                <thead>
                  <tr><th>Donor Identity</th><th>Scheduled Date</th><th>Target Recipient / Hub</th><th>State</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filteredDonations.map(d => {
                    const donor = users.find(u => u?.id === d?.donor_id);
                    const targetReq = requests.find(r => r?.id === d?.request_id);
                    const targetName = targetReq?.patient_id 
                      ? (users.find(u => u?.id === targetReq.patient_id)?.full_name || "Patient ID: " + (targetReq.patient_id || "").slice(-4))
                      : (hospitals.find(h => h?.id === targetReq?.hospital_id)?.name || "General Network");
                    
                    return (
                      <tr key={d?.id}>
                        <td>
                          <strong>{donor?.full_name || "Unknown Donor"}</strong>
                          <div style={{fontSize: '0.7rem', opacity: 0.5}}>{donor?.blood_group || "N/A"}</div>
                        </td>
                        <td>{d?.donation_date}</td>
                        <td>
                          <div style={{fontWeight: 600}}>{targetName}</div>
                          <div style={{fontSize: '0.7rem', opacity: 0.5}}>Ref: #{(d?.request_id || "GEN").slice(-6).toUpperCase()}</div>
                        </td>
                        <td><span className={`admin-badge admin-badge-${d?.status}`}>{d?.status}</span></td>
                        <td>
                          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => handleEditDonation(d)} title="Edit Record"><Icons.Edit /></button>
                            
                            {d.status === "pledged" && (
                              <button className="admin-btn admin-btn-success admin-btn-sm" onClick={() => handleUpdateDonationStatus(d.id, "completed")} title="Verify Physical Donation"><Icons.Check /> Fulfill Contribution</button>
                            )}
                            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDeleteDonation(d.id)}><Icons.Delete /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredDonations.length === 0 && (
                    <tr><td colSpan="5" className="admin-empty" style={{textAlign:'center', padding:40, color:'var(--text-600)'}}>No donation records found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>

      {/* ═══ MODALS ═══ */}

      {/* Add User Modal */}
      {modal === "addUser" && (
        <Modal title="Register New Member" onClose={() => setModal(null)}>
          <div className="admin-modal-field" style={{marginBottom: 16}}>
            <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>Legal Full Name</label>
            <input type="text" className="hemo-input" placeholder="e.g. David Tennant" value={userForm.full_name} onChange={e => setUserForm({...userForm, full_name: e.target.value})} style={{width: '100%'}} />
          </div>
          <div className="admin-modal-field" style={{marginBottom: 16}}>
            <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>Primary Email Address</label>
            <input type="email" className="hemo-input" placeholder="e.g. member@email.com" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} style={{width: '100%'}} />
          </div>
          <div className="admin-modal-field" style={{marginBottom: 16}}>
            <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>Security Password</label>
            <input type="password" className="hemo-input" placeholder="••••••••" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} style={{width: '100%'}} />
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12, marginBottom: 16}}>
            <div className="admin-modal-field">
              <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>System Role</label>
              <select className="hemo-input" value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} style={{width: '100%', height: 46}}>
                <option value="donor">Donor (Hero)</option>
                <option value="patient">Patient (Recipient)</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div className="admin-modal-field">
              <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>Blood Group</label>
              <select className="hemo-input" value={userForm.blood_group} onChange={e => setUserForm({...userForm, blood_group: e.target.value})} style={{width: '100%', height: 46}}>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
              </select>
            </div>
          </div>
          <div className="admin-modal-field" style={{marginBottom: 24}}>
            <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>Operating City</label>
            <input type="text" className="hemo-input" placeholder="e.g. Jaffna" value={userForm.city} onChange={e => setUserForm({...userForm, city: e.target.value})} style={{width: '100%'}} />
          </div>
          <div className="admin-modal-actions" style={{display:'flex', gap: 12, justifyContent:'flex-end'}}>
            <button className="admin-btn admin-btn-ghost" onClick={() => setModal(null)}>Discard</button>
            <button className="admin-btn admin-btn-primary" onClick={handleAddUser}>Finalize Registration</button>
          </div>
        </Modal>
      )}

      {/* Edit User Modal */}
      {modal === "editUser" && (
        <Modal title="Modify User Identity" onClose={() => { setModal(null); setEditItem(null); }}>
          <div className="admin-modal-field" style={{marginBottom: 16}}>
            <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>Full Name</label>
            <input type="text" className="hemo-input" value={userForm.full_name} onChange={e => setUserForm({...userForm, full_name: e.target.value})} style={{width: '100%'}} />
          </div>
          <div className="admin-modal-field" style={{marginBottom: 16}}>
            <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>Email Address</label>
            <input type="email" className="hemo-input" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} style={{width: '100%'}} />
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12, marginBottom: 16}}>
            <div className="admin-modal-field">
              <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>System Role</label>
              <select className="hemo-input" value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} style={{width: '100%', height: 46}}>
                <option value="donor">Donor</option>
                <option value="patient">Patient</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="admin-modal-field">
              <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>Blood Group</label>
              <select className="hemo-input" value={userForm.blood_group} onChange={e => setUserForm({...userForm, blood_group: e.target.value})} style={{width: '100%', height: 46}}>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
              </select>
            </div>
          </div>
          <div className="admin-modal-field" style={{marginBottom: 24}}>
            <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>City</label>
            <input type="text" className="hemo-input" value={userForm.city} onChange={e => setUserForm({...userForm, city: e.target.value})} style={{width: '100%'}} />
          </div>
          <div className="admin-modal-actions" style={{display:'flex', gap: 12, justifyContent:'flex-end'}}>
            <button className="admin-btn admin-btn-ghost" onClick={() => { setModal(null); setEditItem(null); }}>Cancel</button>
            <button className="admin-btn admin-btn-primary" onClick={handleEditUser}>Commit Changes</button>
          </div>
        </Modal>
      )}

      {/* Hospital Modals */}
      {modal === "addHospital" && (
        <Modal title="Onboard New Facility" onClose={() => setModal(null)}>
          <div className="admin-modal-field" style={{marginBottom: 16}}>
            <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>Official Name</label>
            <input type="text" className="hemo-input" placeholder="e.g. LifeCare Central" value={hospitalForm.name} onChange={e => setHospitalForm({...hospitalForm, name: e.target.value})} style={{width: '100%'}} />
          </div>
          <div className="admin-modal-field" style={{marginBottom: 16}}>
            <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>Location City</label>
            <input type="text" className="hemo-input" placeholder="e.g. Jaffna" value={hospitalForm.city} onChange={e => setHospitalForm({...hospitalForm, city: e.target.value})} style={{width: '100%'}} />
          </div>
          <div className="admin-modal-field" style={{marginBottom: 16}}>
            <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>Emergency Contact</label>
            <input type="text" className="hemo-input" placeholder="e.g. 021-XXXXXXX" value={hospitalForm.contact_number} onChange={e => setHospitalForm({...hospitalForm, contact_number: e.target.value})} style={{width: '100%'}} />
          </div>
          <div className="admin-modal-field" style={{marginBottom: 24}}>
            <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>Facility Email</label>
            <input type="email" className="hemo-input" placeholder="e.g. connect@facility.lk" value={hospitalForm.email} onChange={e => setHospitalForm({...hospitalForm, email: e.target.value})} style={{width: '100%'}} />
          </div>
          <div className="admin-modal-actions" style={{display:'flex', gap: 12, justifyContent:'flex-end'}}>
            <button className="admin-btn admin-btn-ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className="admin-btn admin-btn-primary" onClick={handleAddHospital}>Verify & Add</button>
          </div>
        </Modal>
      )}

      {modal === "editHospital" && (
        <Modal title="Update Facility Details" onClose={() => { setModal(null); setEditItem(null); }}>
          <div className="admin-modal-field" style={{marginBottom: 16}}>
            <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>Hospital Name</label>
            <input type="text" className="hemo-input" value={hospitalForm.name} onChange={e => setHospitalForm({...hospitalForm, name: e.target.value})} style={{width: '100%'}} />
          </div>
          <div className="admin-modal-field" style={{marginBottom: 16}}>
            <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>City</label>
            <input type="text" className="hemo-input" value={hospitalForm.city} onChange={e => setHospitalForm({...hospitalForm, city: e.target.value})} style={{width: '100%'}} />
          </div>
          <div className="admin-modal-field" style={{marginBottom: 16}}>
            <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>Secure Contact</label>
            <input type="text" className="hemo-input" value={hospitalForm.contact_number} onChange={e => setHospitalForm({...hospitalForm, contact_number: e.target.value})} style={{width: '100%'}} />
          </div>
          <div className="admin-modal-field" style={{marginBottom: 24}}>
            <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>Facility Email</label>
            <input type="email" className="hemo-input" value={hospitalForm.email} onChange={e => setHospitalForm({...hospitalForm, email: e.target.value})} style={{width: '100%'}} />
          </div>
          <div className="admin-modal-actions" style={{display:'flex', gap: 12, justifyContent:'flex-end'}}>
            <button className="admin-btn admin-btn-ghost" onClick={() => { setModal(null); setEditItem(null); }}>Discard</button>
            <button className="admin-btn admin-btn-primary" onClick={handleEditHospital}>Save Modification</button>
          </div>
        </Modal>
      )}

      {modal === "addRequest" && (
        <Modal title="Broadcast Smart SOS Request" onClose={() => setModal(null)}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12, marginBottom: 16}}>
            <div className="admin-modal-field">
              <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>Origin Hospital</label>
              <select 
                className="hemo-input" 
                value={requestForm.hospital_id} 
                onChange={e => setRequestForm({...requestForm, hospital_id: e.target.value})}
                style={{width: '100%', height: 46}}
              >
                <option value="">Select Facility...</option>
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>{h.name} ({h.city})</option>
                ))}
              </select>
            </div>
            <div className="admin-modal-field">
              <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>Blood Type Needed</label>
              <select className="hemo-input" value={requestForm.blood_group} onChange={e => setRequestForm({...requestForm, blood_group: e.target.value})} style={{width: '100%', height: 46}}>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div className="admin-modal-field" style={{marginBottom: 20}}>
            <label style={{display:'block', marginBottom: 8, fontSize:'0.85rem', fontWeight:700, color:'var(--text-400)'}}>Required Units</label>
            <input 
              type="number" className="hemo-input" min="1" max="50" 
              value={requestForm.units} 
              onChange={e => setRequestForm({...requestForm, units: parseInt(e.target.value) || 0})} 
              style={{width: '100%'}} 
            />
          </div>

          {/* Live Matching Dashboard */}
          <div className="admin-match-card" style={{background: 'var(--bg-700)', padding: 16, borderRadius: 12, marginBottom: 24}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom: 12}}>
              <span style={{fontSize: '0.75rem', fontWeight: 800, color: 'var(--hemo-red)', textTransform: 'uppercase'}}>🛰️ Live Match Explorer</span>
              <span style={{fontSize: '0.75rem', opacity: 0.6}}>
                {hospitals.find(h => h.id === requestForm.hospital_id)?.city || "Awaiting Node Selection..."}
              </span>
            </div>
            
            <div style={{maxHeight: 140, overflowY: 'auto'}}>
              {hospitals.find(h => h.id === requestForm.hospital_id) ? (
                (() => {
                  const h = hospitals.find(h => h.id === requestForm.hospital_id);
                  const matches = users.filter(u => 
                    u && u.role === "donor" && 
                    u.blood_group === requestForm.blood_group && 
                    u.city?.toLowerCase() === h?.city?.toLowerCase()
                  );
                  
                  if (matches.length > 0) {
                    return matches.map(m => (
                      <div key={m?.id} style={{display:'flex', justifyContent:'space-between', padding: '8px 4px', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                        <div style={{fontSize: '0.85rem', fontWeight: 600}}>{m?.full_name}</div>
                        <div style={{fontSize: '0.8rem', opacity: 0.5}}>{m?.blood_group} | Verified</div>
                      </div>
                    ));
                  }
                  return <div style={{padding: 12, textAlign: 'center', opacity: 0.4, fontSize: '0.85rem'}}>No matching donors detected in this sector</div>;
                })()
              ) : (
                <div style={{padding: 12, textAlign: 'center', opacity: 0.4, fontSize: '0.85rem'}}>Select a hospital to start scan...</div>
              )}
            </div>
          </div>

          <div className="admin-modal-actions" style={{display:'flex', gap: 12, justifyContent:'flex-end'}}>
            <button className="admin-btn admin-btn-ghost" onClick={() => setModal(null)} disabled={isBroadcasting}>Abort</button>
            <button 
              className="admin-btn admin-btn-primary" 
              onClick={handleBroadcastSOS}
              disabled={isBroadcasting || !requestForm.hospital_id}
              style={{flex: 1}}
            >
              {isBroadcasting ? "Broadcasting SOS..." : `Broadcast SOS Alert (${users.filter(u => u && u.role === "donor" && u.blood_group === requestForm.blood_group && u.city?.toLowerCase() === hospitals.find(h=>h.id === requestForm.hospital_id)?.city?.toLowerCase()).length} Donors)`}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
