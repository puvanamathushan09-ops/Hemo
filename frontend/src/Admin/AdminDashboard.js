import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../hemo.css";

import { Icons } from "../components/Icons";

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
        {[0, 0.25, 0.5, 0.75, 1].map(v => (
          <line key={v} x1={padding} y1={padding + v * chartHeight} x2={padding + chartWidth} y2={padding + v * chartHeight} className="chart-grid-line" />
        ))}
        <path d={areaD} fill="url(#chartGradient)" />
        <path d={pathD} fill="none" stroke="var(--hemo-red)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="chart-area-path" />
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
              <rect x={x} y={y} width={barWidth} height={barH} fill={i % 2 === 0 ? "var(--hemo-red)" : "var(--hemo-red-dark)"} rx="4" className="chart-bar" style={{ animationDelay: `${i * 0.1}s` }} />
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

/* ── Leaflet Map Component ── */
function LeafletRouteMap({ mapCoords, hospitalName, donorName, onClose }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapCoords) return;

    const initMap = () => {
      if (!mapRef.current) return;

      // Destroy previous instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const L = window.L;

      const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: true });
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(map);

      // Hospital marker — red H
      const hospitalIcon = L.divIcon({
        className: '',
        html: `<div style="
          width:36px;height:36px;border-radius:50% 50% 50% 0;
          background:#e63946;border:3px solid #fff;
          box-shadow:0 4px 14px rgba(230,57,70,0.6);
          display:flex;align-items:center;justify-content:center;
          font-weight:900;font-size:14px;color:#fff;
          transform:rotate(-45deg);
        "><span style="transform:rotate(45deg)">H</span></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -40]
      });

      // Donor marker — blue D
      const donorIcon = L.divIcon({
        className: '',
        html: `<div style="
          width:36px;height:36px;border-radius:50% 50% 50% 0;
          background:#3a86ff;border:3px solid #fff;
          box-shadow:0 4px 14px rgba(58,134,255,0.6);
          display:flex;align-items:center;justify-content:center;
          font-weight:900;font-size:14px;color:#fff;
          transform:rotate(-45deg);
        "><span style="transform:rotate(45deg)">D</span></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -40]
      });

      const hLatLng = [mapCoords.hospital.lat, mapCoords.hospital.lng];
      const dLatLng = [mapCoords.donor.lat, mapCoords.donor.lng];

      L.marker(hLatLng, { icon: hospitalIcon })
        .addTo(map)
        .bindPopup(`<b>🏥 Hospital</b><br/>${hospitalName}`)
        .openPopup();

      L.marker(dLatLng, { icon: donorIcon })
        .addTo(map)
        .bindPopup(`<b>💉 Donor</b><br/>${donorName}`);

      // Dashed route line
      L.polyline([hLatLng, dLatLng], {
        color: '#e63946',
        weight: 3,
        dashArray: '10 6',
        opacity: 0.8
      }).addTo(map);

      // Fit both markers into view
      map.fitBounds([hLatLng, dLatLng], { padding: [40, 40] });
    };

    if (!window.L) {
      // Inject Leaflet CSS
      if (!document.querySelector('#leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      // Inject Leaflet JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapCoords]);

  return (
    <div style={{
      position: 'fixed',
      right: 24,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 360,
      height: 460,
      background: 'var(--bg-800, #1a1a2e)',
      borderRadius: 20,
      boxShadow: '0 24px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08)',
      overflow: 'hidden',
      zIndex: 10001,
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideInRight 0.35s cubic-bezier(0.34,1.56,0.64,1)'
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px',
        background: 'rgba(230,57,70,0.12)',
        borderBottom: '1px solid rgba(230,57,70,0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0
      }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--hemo-red, #e63946)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 }}>
            ◉ Live Route Map
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
            H → D Navigation Path
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: 'none',
            borderRadius: 8,
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 700
          }}
        >×</button>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: 16,
        padding: '10px 18px',
        background: 'rgba(0,0,0,0.2)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#e63946', flexShrink: 0 }} />
          <span style={{ fontWeight: 700 }}>H</span> — {hospitalName}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#3a86ff', flexShrink: 0 }} />
          <span style={{ fontWeight: 700 }}>D</span> — {donorName}
        </div>
      </div>

      {/* Map */}
      <div ref={mapRef} style={{ flex: 1, width: '100%' }} />

      {/* Footer */}
      <div style={{
        padding: '8px 18px',
        background: 'rgba(0,0,0,0.3)',
        fontSize: '0.65rem',
        color: 'rgba(255,255,255,0.3)',
        textAlign: 'center',
        flexShrink: 0
      }}>
        © OpenStreetMap contributors • Click donor to update
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateY(-50%) translateX(40px) scale(0.95); }
          to   { opacity: 1; transform: translateY(-50%) translateX(0)   scale(1);    }
        }
      `}</style>
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
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [hospitalForm, setHospitalForm] = useState({ name: "", city: "", contact_number: "", email: "", address: "" });
  const [userForm, setUserForm] = useState({ full_name: "", email: "", role: "donor", city: "", address: "", blood_group: "O+", password: "password123" });
  const [requestForm, setRequestForm] = useState({ blood_group: "O+", city: "", units: 1, hospital_id: "" });
  const [donationForm, setDonationForm] = useState({ donation_date: "", status: "pledged" });
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [logistics, setLogistics] = useState(null);
  const [mapCoords, setMapCoords] = useState(null);       // ← NEW: stores H + D coordinates
  const [showMap, setShowMap] = useState(false);           // ← NEW: floating map visibility
  const [confirmAction, setConfirmAction] = useState(null);

  // Auth check
  let adminUser = null;
  try {
    adminUser = JSON.parse(localStorage.getItem("user") || "null");
  } catch (e) {
    console.error("localStorage parse error:", e);
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
      setUsers(Array.isArray(u) ? u : []);
      setHospitals(Array.isArray(h) ? h : []);
      setRequests(Array.isArray(r) ? r : []);
      setDonations(Array.isArray(d) ? d : []);
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
    if (!hospitalForm.name || !hospitalForm.city) { toast.error("Hospital name and city are required"); return; }
    try {
      const created = await api.createHospital(hospitalForm);
      setHospitals([created, ...hospitals]);
      toast.success(`"${hospitalForm.name}" registered!`);
    } catch {
      const mock = { ...hospitalForm, id: "h-" + Date.now() };
      setHospitals([mock, ...hospitals]);
      toast.success(`"${hospitalForm.name}" added locally`);
    }
    setHospitalForm({ name: "", city: "", contact_number: "", email: "", address: "" });
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
    setConfirmAction({
      title: "Confirm Deletion",
      message: `Are you sure you want to retract Hospital Hub "${name}" from the network?`,
      onConfirm: async () => {
        try {
          await api.deleteHospital(id);
          toast.success(`Hub "${name}" de-registered`);
          setHospitals(hospitals.filter(h => h.id !== id));
        } catch { toast.error("De-registration failed"); }
        setConfirmAction(null);
      }
    });
  };

  /* ── USER CRUD ── */
  const handleAddUser = async () => {
    if (!userForm.full_name || !userForm.email) { toast.error("Name and Email are required"); return; }
    try {
      const resp = await api.register(userForm);
      const newUser = (resp.data && resp.data[0]) ? resp.data[0] : resp.user;
      setUsers([newUser, ...users]);
      toast.success(`User "${userForm.full_name}" synchronized with network`);
    } catch (err) {
      toast.error(`System Block: ${err.message || "Credential conflict"}`);
      const mock = { ...userForm, id: "u-" + Date.now() };
      setUsers([mock, ...users]);
    }
    setUserForm({ full_name: "", email: "", role: "donor", city: "", address: "", blood_group: "O+", password: "password123" });
    setModal(null);
  };

  const handleEditRequest = (req) => {
    setEditItem(req);
    setRequestForm({ blood_group: req.blood_group, city: req.city, status: req.status });
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
    setConfirmAction({
      title: "Terminate Identity",
      message: `Permanently remove "${name}" from the Hemo identity registry? This cannot be undone.`,
      onConfirm: async () => {
        try {
          await api.deleteUser(id);
          toast.success(`User "${name}" deleted from network`);
          setUsers(users.filter(u => u.id !== id));
        } catch (err) { toast.error(`Deletion failed: ${err.message}`); }
        setConfirmAction(null);
      }
    });
  };

  /* ── REQUEST CRUD ── */
  const handleDeleteRequest = async (id) => {
    setConfirmAction({
      title: "Retract SOS",
      message: "Are you sure you want to cancel this emergency request? Dispatched donors will be notified.",
      onConfirm: async () => {
        try {
          await api.deleteBloodRequest(id);
          toast.success("Request deleted");
        } catch { toast.error("Database sync failed"); }
        setRequests(requests.filter(r => r.id !== id));
        setConfirmAction(null);
      }
    });
  };

  /* ── LOGISTICS + MAP ── */
  const handleGetLogistics = async (donor) => {
    const hospital = hospitals.find(h => h.id === requestForm.hospital_id);
    if (!hospital || !donor) return;

    setSelectedDonor(donor);
    setLogistics(null);
    setMapCoords(null);
    setShowMap(false);

    try {
      const hospitalQuery = `${hospital.name}, ${hospital.address || hospital.city}, Sri Lanka`;
      const donorQuery = `${donor.address || donor.city}, Sri Lanka`;

      const [hRes, dRes] = await Promise.all([
        fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(hospitalQuery)}&limit=1`).then(r => r.json()),
        fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(donorQuery)}&limit=1`).then(r => r.json())
      ]);

      let hPoint = hRes.features?.[0]?.geometry?.coordinates;
      let dPoint = dRes.features?.[0]?.geometry?.coordinates;

      if (!hPoint) {
        const fall = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(hospital.city + ", Sri Lanka")}&limit=1`).then(r => r.json());
        hPoint = fall.features?.[0]?.geometry?.coordinates;
      }
      if (!dPoint) {
        const fall = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(donor.city + ", Sri Lanka")}&limit=1`).then(r => r.json());
        dPoint = fall.features?.[0]?.geometry?.coordinates;
      }

      if (hPoint && dPoint) {
        const [hLon, hLat] = hPoint;
        const [dLon, dLat] = dPoint;

        // Store coords for map ← NEW
        setMapCoords({
          hospital: { lat: hLat, lng: hLon },
          donor: { lat: dLat, lng: dLon }
        });
        setShowMap(true); // ← auto-open map when coords ready

        // Haversine distance
        const R = 6371;
        const dLatRad = (dLat - hLat) * Math.PI / 180;
        const dLonRad = (dLon - hLon) * Math.PI / 180;
        const a = Math.sin(dLatRad / 2) ** 2 +
          Math.cos(hLat * Math.PI / 180) * Math.cos(dLat * Math.PI / 180) * Math.sin(dLonRad / 2) ** 2;
        const haversineDist = (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);

        try {
          const routeRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${hLon},${hLat};${dLon},${dLat}?overview=false`).then(r => r.json());
          if (routeRes.code === 'Ok' && routeRes.routes?.[0]) {
            const dist = (routeRes.routes[0].distance / 1000).toFixed(1);
            const time = Math.round(routeRes.routes[0].duration / 60);
            setLogistics({ distance: parseFloat(dist) < 0.1 ? haversineDist : dist, duration: time || Math.round(haversineDist * 2) });
          } else throw new Error("OSRM Fail");
        } catch {
          setLogistics({ distance: haversineDist, duration: Math.round(haversineDist * 3) });
        }
      } else {
        setLogistics({ distance: "N/A", duration: "N/A" });
      }
    } catch (err) {
      console.error("Logistics Error", err);
      setLogistics({ distance: "!!", duration: "!!" });
    }
  };

  const handleBroadcastSOS = async (targetDonor = null) => {
    const selectedHospital = hospitals.find(h => h.id === requestForm.hospital_id);
    if (!selectedHospital) { toast.error("Please select a hospital node"); return; }

    let matchingDonors = [];
    if (targetDonor) {
      matchingDonors = [targetDonor];
    } else {
      matchingDonors = users.filter(u =>
        u.role === "donor" &&
        u.blood_group === requestForm.blood_group &&
        u.city?.toLowerCase() === selectedHospital.city?.toLowerCase()
      );
    }

    if (matchingDonors.length === 0) {
      toast.warn("No active donors found in this sector matching the blood group");
      return;
    }

    setIsBroadcasting(true);
    try {
      const reqData = {
        blood_group: requestForm.blood_group,
        city: selectedHospital.city,
        status: "approved",
        patient_id: null,
        hospital_id: selectedHospital.id
      };
      const newReq = await api.createBloodRequest(reqData);
      setRequests([newReq, ...requests]);
      await api.sendNotifications({
        request_id: newReq.id,
        blood_group: requestForm.blood_group,
        hospital_name: selectedHospital.name,
        units: requestForm.units,
        donor_emails: matchingDonors.map(d => d.email)
      });
      toast.success(targetDonor ? `SOS Alert sent to ${targetDonor.full_name}!` : `SOS Broadcast sent to ${matchingDonors.length} donors!`);
      setModal(null);
      setShowMap(false);
      setMapCoords(null);
    } catch {
      toast.error("Broadcast partially failed: Check connection");
    } finally {
      setIsBroadcasting(false);
    }
  };

  /* ── DONATION CRUD ── */
  const handleEditDonation = (don) => {
    setEditItem(don);
    setDonationForm({ donation_date: don.donation_date, status: don.status });
    setModal("editDonation");
  };

  const handleUpdateRequestStatus = async (id, newStatus) => {
    try {
      await api.updateBloodRequest(id, { status: newStatus });
      toast.success(`Broadcasting update: Request is now ${newStatus}`);
      setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) { toast.error(`Satellite link failed: ${err.message}`); }
  };

  const handleUpdateDonationStatus = async (id, newStatus) => {
    try {
      await api.updateDonation(id, { status: newStatus });
      toast.success(`Verification complete: Donation set to ${newStatus}`);
      setDonations(donations.map(d => d.id === id ? { ...d, status: newStatus } : d));
    } catch (err) { toast.error(`Network sync failed: ${err.message}`); }
  };

  const handleUpdateUnits = async (id, units) => {
    try {
      await api.updateDonation(id, { units: parseInt(units) || 0 });
      toast.success("Units updated");
      setDonations(donations.map(d => d.id === id ? { ...d, units: parseInt(units) } : d));
    } catch { toast.error("Sync failed"); }
  };

  const handleDeleteDonation = async (id) => {
    setConfirmAction({
      title: "Purge Record",
      message: "Permanently delete this donation entry? Clinical history will be adjusted.",
      onConfirm: async () => {
        try {
          await api.deleteDonation(id);
          toast.success("Donation deleted");
          setDonations(donations.filter(d => d.id !== id));
        } catch { toast.error("Purge failed"); }
        setConfirmAction(null);
      }
    });
  };

  /* ── LOGOUT ── */
  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out successfully");
    setTimeout(() => navigate("/login"), 800);
  };

  // Filtering Logic
  const filteredUsers = Array.isArray(users) ? users.filter(u =>
    (u?.full_name || "").toLowerCase().includes((search || "").toLowerCase()) ||
    (u?.email || "").toLowerCase().includes((search || "").toLowerCase()) ||
    (u?.city || "").toLowerCase().includes((search || "").toLowerCase())
  ) : [];

  const filteredHospitals = Array.isArray(hospitals) ? hospitals.filter(h =>
    (h?.name || "").toLowerCase().includes((search || "").toLowerCase()) ||
    (h?.city || "").toLowerCase().includes((search || "").toLowerCase())
  ) : [];

  const filteredRequests = Array.isArray(requests) ? requests.filter(r =>
    (r?.city || "").toLowerCase().includes((search || "").toLowerCase()) ||
    (r?.blood_group || "").toLowerCase().includes((search || "").toLowerCase()) ||
    (r?.status || "").toLowerCase().includes((search || "").toLowerCase())
  ) : [];

  const filteredDonations = Array.isArray(donations) ? donations.filter(d => {
    const donor = users.find(u => u.id === d?.donor_id);
    return (
      (donor?.full_name || "").toLowerCase().includes((search || "").toLowerCase()) ||
      (d?.status || "").toLowerCase().includes((search || "").toLowerCase())
    );
  }) : [];

  const getDonationTrend = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map(d => ({ label: d, value: Math.floor(Math.random() * 20) + 5 }));
  };

  const getBloodGroupDist = () => {
    const groups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
    return groups.map(g => ({ label: g, value: users.filter(u => u.blood_group === g).length }));
  };

  const pendingCount = requests.filter(r => r.status === "pending").length;

  // Derive selected hospital name for map legend
  const selectedHospitalName = hospitals.find(h => h.id === requestForm.hospital_id)?.name || "Hospital";

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-800)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="hemo-preloader-spinner" style={{ marginBottom: 20 }}></div>
          <p style={{ color: 'var(--text-600)', fontWeight: 600, letterSpacing: 1 }}>INITIALIZING COMMAND CENTRE</p>
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
            <div className="hemo-logo-icon" style={{ width: 32, height: 32, background: 'var(--hemo-red)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Icons.Donations /></div>
            <div>
              <h2 style={{ marginLeft: 12 }}>Hemo</h2>
              <small style={{ marginLeft: 12 }}>Admin Portal</small>
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
              <span className="nav-icon"><Icons.Requests /></span> <span>Direct Requests</span>
              {pendingCount > 0 && <span className="nav-badge">{pendingCount}</span>}
            </button>
            <button className={`admin-nav-item ${tab === "sos_pulse" ? "active" : ""}`} onClick={() => { setTab("sos_pulse"); setSearch(""); }}>
              <span className="nav-icon"><Icons.ActivityAlert /></span> <span>SOS Real-time Pulse</span>
            </button>
            <button className={`admin-nav-item ${tab === "attendance" ? "active" : ""}`} onClick={() => { setTab("attendance"); setSearch(""); }}>
              <span className="nav-icon"><Icons.DoneAll /></span> <span>Attendance & Units</span>
            </button>
            <button className={`admin-nav-item ${tab === "donations" ? "active" : ""}`} onClick={() => { setTab("donations"); setSearch(""); }}>
              <span className="nav-icon"><Icons.Donations /></span> <span>Donation History</span>
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
          <button className="admin-btn admin-btn-ghost" style={{ width: '100%', marginTop: 16, justifyContent: 'center' }} onClick={handleLogout}>
            <Icons.Logout /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ═══ MAIN AREA ═══ */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <span className="section-tag" style={{ marginBottom: 4, display: 'block', fontSize: '0.7rem', color: 'var(--hemo-red)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>System Management</span>
            <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-100)' }}>{tab === "overview" ? "Control Centre Overview" : tab.toUpperCase()}</h1>
          </div>
          <div className="admin-topbar-actions">
            {tab !== "overview" && (
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="hemo-input"
                  placeholder={`Search ${tab}...`}
                  style={{ paddingLeft: 40, width: 280, height: 42, background: '#fff', border: '1px solid var(--glass-border)', borderRadius: 12 }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}><Icons.Search /></span>
              </div>
            )}
            <button className="admin-btn admin-btn-ghost" onClick={fetchAll} title="Refresh Data" style={{ height: 42 }}><Icons.Refresh /></button>
          </div>
        </div>

        <div className="admin-content">

          {/* ─── OVERVIEW TAB ─── */}
          {tab === "overview" && (
            <>
              <div className="admin-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 40 }}>
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
                    <div className="legend-item"><span className="legend-color" style={{ background: 'var(--hemo-red)' }}></span> Pledges Received</div>
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
                <div className="admin-card">
                  <div className="admin-card-header" style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bg-700)' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Active Blood Alerts</h2>
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
                      {requests.length === 0 && <tr><td colSpan="3" className="admin-empty">No active requests</td></tr>}
                    </tbody>
                  </table>
                </div>
                <div className="admin-card">
                  <div className="admin-card-header" style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bg-700)' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Latest Registrations</h2>
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
                        <div style={{ fontWeight: 700, color: 'var(--text-100)' }}>{u.full_name}</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{u.email}</div>
                      </td>
                      <td><span className={`admin-badge admin-badge-${u.role}`}>{u.role}</span></td>
                      <td><strong style={{ color: 'var(--hemo-red)' }}>{u.blood_group}</strong></td>
                      <td>{u.city}</td>
                      <td>
                        {u.email === "admin@hemo.com" ? (
                          <span style={{ fontSize: '0.75rem', opacity: 0.5, fontStyle: 'italic' }}>System Restricted</span>
                        ) : (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="admin-btn admin-btn-info admin-btn-sm" onClick={() => {
                              setEditItem(u);
                              setUserForm({ full_name: u.full_name, email: u.email, role: u.role, city: u.city || "", address: u.address || "", blood_group: u.blood_group || "O+" });
                              setModal("editUser");
                            }}><Icons.Edit /></button>
                            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDeleteUser(u.id, u.full_name)}><Icons.Delete /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && <tr><td colSpan="5" className="admin-empty" style={{ textAlign: 'center', padding: 40, color: 'var(--text-600)' }}>No results matching your query</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* ─── HOSPITALS TAB ─── */}
          {tab === "hospitals" && (
            <>
              <div style={{ marginBottom: 24 }}>
                <button className="admin-btn admin-btn-primary" onClick={() => {
                  setHospitalForm({ name: "", city: "", contact_number: "", email: "", address: "" });
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
                          <div style={{ fontWeight: 700 }}>{h.name}</div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{h.email || "No email registered"}</div>
                        </td>
                        <td>{h.city}</td>
                        <td>{h.contact_number || "Unavailable"}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="admin-btn admin-btn-info admin-btn-sm" onClick={() => {
                              setEditItem(h);
                              setHospitalForm({ name: h.name, city: h.city, contact_number: h.contact_number || "", email: h.email || "", address: h.address || "" });
                              setModal("editHospital");
                            }}><Icons.Edit /></button>
                            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDeleteHospital(h.id, h.name)}><Icons.Delete /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredHospitals.length === 0 && <tr><td colSpan="4" className="admin-empty" style={{ textAlign: 'center', padding: 40, color: 'var(--text-600)' }}>No facility found for this search</td></tr>}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ─── REQUESTS TAB ─── */}
          {tab === "requests" && (
            <>
              <div style={{ marginBottom: 24 }}>
                <button className="admin-btn admin-btn-primary" onClick={() => {
                  setRequestForm({ blood_group: "O+", city: "", units: 1, hospital_id: "" });
                  setModalStep(1);
                  setSelectedDonor(null);
                  setLogistics(null);
                  setMapCoords(null);
                  setShowMap(false);
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
                        <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.6 }}>#{(r?.id || "").slice(-6).toUpperCase()}</td>
                        <td>
                          {r?.patient_id ? (
                            <div style={{ fontWeight: 600 }}>{users.find(u => u?.id === r.patient_id)?.full_name || "Unknown Patient"}</div>
                          ) : (
                            <div style={{ fontWeight: 600, color: 'var(--hemo-red)', display: 'flex', alignItems: 'center' }}><Icons.Hospitals size={14} style={{ marginRight: 4 }} /> {hospitals.find(h => h?.id === r?.hospital_id)?.name || "System Alert"}</div>
                          )}
                        </td>
                        <td><strong style={{ fontSize: '1.1rem', color: 'var(--hemo-red)' }}>{r?.blood_group}</strong></td>
                        <td>{r?.city}</td>
                        <td><span className={`admin-badge admin-badge-${r?.status}`} style={{ fontWeight: 900, letterSpacing: 0.5 }}>{(r?.status || "").toUpperCase()}</span></td>
                        <td style={{ fontSize: '0.85rem' }}>{r?.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => handleEditRequest(r)} title="Modify Alert Path"><Icons.Edit /></button>
                            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDeleteRequest(r.id)} title="Retract SOS Alert"><Icons.Delete /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredRequests.length === 0 && <tr><td colSpan="7" className="admin-empty" style={{ textAlign: 'center', padding: 40, color: 'var(--text-600)' }}>No active requests detected in this scope</td></tr>}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ─── SOS PULSE TAB ─── */}
          {tab === "sos_pulse" && (
            <div className="admin-card">
              <div className="admin-card-header" style={{ padding: '24px 32px', borderBottom: '1px solid var(--bg-700)' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>SOS Real-time Response Monitoring</h2>
              </div>
              <table className="admin-table">
                <thead>
                  <tr><th>SOS Reference</th><th>Node / Hospital</th><th>Target Blood</th><th>Pledged Donors</th><th>Action Status</th></tr>
                </thead>
                <tbody>
                  {requests.map(r => {
                    const hospital = hospitals.find(h => h.id === r.hospital_id);
                    const matchedDonations = donations.filter(d => d.request_id === r.id);
                    return (
                      <tr key={r.id}>
                        <td><code style={{ background: 'var(--bg-700)', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem' }}>#{(r.id || "").slice(-6).toUpperCase()}</code></td>
                        <td>
                          <div style={{ fontWeight: 700 }}>{hospital?.name || "System Request"}</div>
                          <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{r.city}</div>
                        </td>
                        <td><span style={{ color: 'var(--hemo-red)', fontWeight: 900, fontSize: '1.1rem' }}>{r.blood_group}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            {matchedDonations.length > 0 ? (
                              <button className="admin-btn admin-btn-secondary admin-btn-sm" style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px' }} onClick={() => { setEditItem(r); setModal("viewPledged"); }}>
                                <Icons.Users size={14} style={{ marginRight: 6 }} />{matchedDonations.length} Pledged Donors
                              </button>
                            ) : <span style={{ opacity: 0.3, fontSize: '0.8rem' }}>No Handshakes</span>}
                          </div>
                        </td>
                        <td><span className={`admin-badge admin-badge-${r?.status}`} style={{ fontWeight: 900, padding: '6px 16px' }}>{(r?.status || "").toUpperCase()}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ─── ATTENDANCE TAB ─── */}
          {tab === "attendance" && (
            <div className="admin-card">
              <div className="admin-card-header" style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bg-700)' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Clinical Attendance Hub</h2>
                <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={fetchAll}><Icons.Refresh /> Audit Hub Sync</button>
              </div>
              <table className="admin-table">
                <thead>
                  <tr><th>Donor Identity</th><th>Hospital Node</th><th>Pledge Date</th><th>Verified Units</th><th>Status Evolution</th></tr>
                </thead>
                <tbody>
                  {donations.filter(d => d.status !== 'deleted').map(d => {
                    const donor = users.find(u => u.id === d.donor_id);
                    const request = requests.find(r => r.id === d.request_id);
                    const hospital = hospitals.find(h => h.id === request?.hospital_id);
                    const statusColors = {
                      pledged: { bg: 'rgba(52,152,219,0.25)', text: '#2980b9', border: '#3498db' },
                      completed: { bg: 'rgba(46,204,113,0.25)', text: '#27ae60', border: '#2ecc71' },
                      cancelled: { bg: 'rgba(149,165,166,0.25)', text: '#7f8c8d', border: '#95a5a6' },
                      absent: { bg: 'rgba(231,76,60,0.25)', text: '#c0392b', border: '#e74c3c' }
                    };
                    const currentStyle = statusColors[d.status] || statusColors.pledged;
                    return (
                      <tr key={d.id}>
                        <td style={{ padding: '20px 32px' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{donor?.full_name}</div>
                          <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{donor?.blood_group} • {donor?.email}</div>
                        </td>
                        <td>{hospital?.name || "Life-Saving Node"}</td>
                        <td>{d.donation_date}</td>
                        <td>
                          <input type="number" className="hemo-input" value={d.units || 0} onChange={(e) => handleUpdateUnits(d.id, e.target.value)} style={{ width: 80, height: 32, fontSize: '0.85rem', fontWeight: 800, textAlign: 'center' }} />
                        </td>
                        <td>
                          <select className="hemo-input" value={d.status} onChange={(e) => handleUpdateDonationStatus(d.id, e.target.value)} style={{ width: '100%', height: 36, fontSize: '0.7rem', fontWeight: 900, background: currentStyle.bg, color: currentStyle.text, border: `2px solid ${currentStyle.border}`, borderRadius: 20, padding: '0 12px', textTransform: 'uppercase', textAlign: 'center', appearance: 'none', cursor: 'pointer', letterSpacing: 0.5 }}>
                            <option value="pledged">Pledged</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="absent">Absent</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ─── DONATIONS TAB ─── */}
          {tab === "donations" && (
            <div className="admin-card">
              <div className="admin-card-header" style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bg-700)' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Verified Pledge Archives</h2>
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
                          <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{donor?.blood_group || "N/A"}</div>
                        </td>
                        <td>{d?.donation_date}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{targetName}</div>
                          <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>Ref: #{(d?.request_id || "GEN").slice(-6).toUpperCase()}</div>
                        </td>
                        <td><span className={`admin-badge admin-badge-${d?.status}`}>{d?.status}</span></td>
                        <td>
                          <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDeleteDonation(d.id)}><Icons.Delete /></button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredDonations.length === 0 && <tr><td colSpan="5" className="admin-empty" style={{ textAlign: 'center', padding: 40, color: 'var(--text-600)' }}>No archived pledges discovered</td></tr>}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>

      {/* ─── CONFIRMATION OVERLAY ─── */}
      {confirmAction && (
        <div className="admin-modal-overlay" style={{ zIndex: 9999 }}>
          <div className="admin-modal" style={{ maxWidth: 400, textAlign: 'center', padding: 40 }}>
            <div style={{ color: 'var(--hemo-red)', marginBottom: 20 }}><Icons.ActivityAlert size={64} /></div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 12, color: 'var(--text-100)' }}>{confirmAction.title}</h3>
            <p style={{ opacity: 0.7, marginBottom: 32, lineHeight: 1.6 }}>{confirmAction.message}</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="admin-btn admin-btn-ghost" style={{ flex: 1 }} onClick={() => setConfirmAction(null)}>Abort</button>
              <button className="admin-btn admin-btn-danger" style={{ flex: 1 }} onClick={confirmAction.onConfirm}>Confirm Action</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODALS ═══ */}

      {/* Edit User Modal */}
      {modal === "editUser" && (
        <Modal title="Modify User Identity" onClose={() => { setModal(null); setEditItem(null); }}>
          <div className="admin-modal-field" style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>Full Name</label>
            <input type="text" className="hemo-input" value={userForm.full_name} onChange={e => setUserForm({ ...userForm, full_name: e.target.value })} style={{ width: '100%' }} />
          </div>
          <div className="admin-modal-field" style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>Email Address</label>
            <input type="email" className="hemo-input" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} style={{ width: '100%' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div className="admin-modal-field">
              <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>System Role</label>
              <select className="hemo-input" value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })} style={{ width: '100%', height: 46 }}>
                <option value="donor">Donor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="admin-modal-field">
              <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>Blood Group</label>
              <select className="hemo-input" value={userForm.blood_group} onChange={e => setUserForm({ ...userForm, blood_group: e.target.value })} style={{ width: '100%', height: 46 }}>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <div className="admin-modal-field">
              <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>City</label>
              <input type="text" className="hemo-input" value={userForm.city} onChange={e => setUserForm({ ...userForm, city: e.target.value })} style={{ width: '100%' }} />
            </div>
            <div className="admin-modal-field">
              <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>Address</label>
              <input type="text" className="hemo-input" value={userForm.address || ""} onChange={e => setUserForm({ ...userForm, address: e.target.value })} style={{ width: '100%' }} />
            </div>
          </div>
          <div className="admin-modal-actions" style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button className="admin-btn admin-btn-ghost" onClick={() => { setModal(null); setEditItem(null); }}>Cancel</button>
            <button className="admin-btn admin-btn-primary" onClick={handleEditUser}>Commit Changes</button>
          </div>
        </Modal>
      )}

      {/* Edit Request Modal */}
      {modal === "editRequest" && (
        <Modal title="Modify SOS Node Alert" onClose={() => setModal(null)}>
          <div className="admin-modal-field" style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>Emergency Blood Type</label>
            <select className="hemo-input" value={requestForm.blood_group} onChange={e => setRequestForm({ ...requestForm, blood_group: e.target.value })} style={{ width: '100%', height: 46 }}>
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <div className="admin-modal-field" style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>Sector City</label>
            <input type="text" className="hemo-input" value={requestForm.city} onChange={e => setRequestForm({ ...requestForm, city: e.target.value })} style={{ width: '100%' }} />
          </div>
          <div className="admin-modal-field" style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>Operational Status</label>
            <select className="hemo-input" value={requestForm.status} onChange={e => setRequestForm({ ...requestForm, status: e.target.value })} style={{ width: '100%', height: 46 }}>
              <option value="pending">Pending</option>
              <option value="approved">Approved (Live Alert)</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="admin-modal-actions" style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button className="admin-btn admin-btn-ghost" onClick={() => setModal(null)}>Discard</button>
            <button className="admin-btn admin-btn-primary" onClick={async () => {
              try {
                await api.updateBloodRequest(editItem.id, requestForm);
                toast.success("SOS Alert synchronized");
                fetchAll();
                setModal(null);
              } catch { toast.error("Hub Sync failed"); }
            }}>Modify SOS Node</button>
          </div>
        </Modal>
      )}

      {/* View Pledged Donors Modal */}
      {modal === "viewPledged" && (
        <Modal title={`Pledged Donors for Alert #${(editItem?.id || "").slice(-6).toUpperCase()}`} onClose={() => setModal(null)}>
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <table className="admin-table" style={{ width: '100%' }}>
              <thead>
                <tr><th>Donor Detail</th><th>Contact Info</th><th>Blood Group</th></tr>
              </thead>
              <tbody>
                {donations.filter(d => d.request_id === editItem?.id).map(don => {
                  const donor = users.find(u => u.id === don.donor_id);
                  return (
                    <tr key={don.id}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{donor?.full_name || "Unknown Donor"}</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{donor?.city} • Sri Lanka</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>{donor?.email}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--hemo-red)', fontWeight: 600 }}>{donor?.phone || "No Phone"}</div>
                      </td>
                      <td><span style={{ color: 'var(--hemo-red)', fontWeight: 800 }}>{donor?.blood_group}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="admin-modal-actions" style={{ marginTop: 24, textAlign: 'right' }}>
            <button className="admin-btn admin-btn-primary" onClick={() => setModal(null)}>Close Inspector</button>
          </div>
        </Modal>
      )}

      {/* Hospital Modals */}
      {modal === "addHospital" && (
        <Modal title="Onboard New Facility" onClose={() => setModal(null)}>
          <div className="admin-modal-field" style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>Official Name</label>
            <input type="text" className="hemo-input" placeholder="e.g. LifeCare Central" value={hospitalForm.name} onChange={e => setHospitalForm({ ...hospitalForm, name: e.target.value })} style={{ width: '100%' }} />
          </div>
          <div className="admin-modal-field" style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>Location City</label>
            <input type="text" className="hemo-input" placeholder="e.g. Jaffna" value={hospitalForm.city} onChange={e => setHospitalForm({ ...hospitalForm, city: e.target.value })} style={{ width: '100%' }} />
          </div>
          <div className="admin-modal-field" style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>Emergency Contact</label>
            <input type="text" className="hemo-input" placeholder="e.g. 021-XXXXXXX" value={hospitalForm.contact_number} onChange={e => setHospitalForm({ ...hospitalForm, contact_number: e.target.value })} style={{ width: '100%' }} />
          </div>
          <div className="admin-modal-field" style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>Facility Email</label>
            <input type="email" className="hemo-input" placeholder="e.g. connect@facility.lk" value={hospitalForm.email} onChange={e => setHospitalForm({ ...hospitalForm, email: e.target.value })} style={{ width: '100%' }} />
          </div>
          <div className="admin-modal-field" style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>Facility Address</label>
            <input type="text" className="hemo-input" placeholder="e.g. 123 Main St" value={hospitalForm.address || ""} onChange={e => setHospitalForm({ ...hospitalForm, address: e.target.value })} style={{ width: '100%' }} />
          </div>
          <div className="admin-modal-actions" style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button className="admin-btn admin-btn-ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className="admin-btn admin-btn-primary" onClick={handleAddHospital}>Verify & Add</button>
          </div>
        </Modal>
      )}

      {modal === "editHospital" && (
        <Modal title="Update Facility Details" onClose={() => { setModal(null); setEditItem(null); }}>
          <div className="admin-modal-field" style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>Hospital Name</label>
            <input type="text" className="hemo-input" value={hospitalForm.name} onChange={e => setHospitalForm({ ...hospitalForm, name: e.target.value })} style={{ width: '100%' }} />
          </div>
          <div className="admin-modal-field" style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>City</label>
            <input type="text" className="hemo-input" value={hospitalForm.city} onChange={e => setHospitalForm({ ...hospitalForm, city: e.target.value })} style={{ width: '100%' }} />
          </div>
          <div className="admin-modal-field" style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>Secure Contact</label>
            <input type="text" className="hemo-input" value={hospitalForm.contact_number} onChange={e => setHospitalForm({ ...hospitalForm, contact_number: e.target.value })} style={{ width: '100%' }} />
          </div>
          <div className="admin-modal-field" style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>Facility Email</label>
            <input type="email" className="hemo-input" value={hospitalForm.email} onChange={e => setHospitalForm({ ...hospitalForm, email: e.target.value })} style={{ width: '100%' }} />
          </div>
          <div className="admin-modal-field" style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>Facility Address</label>
            <input type="text" className="hemo-input" value={hospitalForm.address || ""} onChange={e => setHospitalForm({ ...hospitalForm, address: e.target.value })} style={{ width: '100%' }} />
          </div>
          <div className="admin-modal-actions" style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button className="admin-btn admin-btn-ghost" onClick={() => { setModal(null); setEditItem(null); }}>Discard</button>
            <button className="admin-btn admin-btn-primary" onClick={handleEditHospital}>Save Modification</button>
          </div>
        </Modal>
      )}

      {/* ─── SOS BROADCAST MODAL ─── */}
      {modal === "addRequest" && (
        <Modal title="Broadcast Smart SOS Request" onClose={() => { setModal(null); setShowMap(false); setMapCoords(null); setSelectedDonor(null); }}>
          {modalStep === 1 && (
            <>
              <div className="admin-modal-field" style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>Origin Hospital</label>
                <select className="hemo-input" value={requestForm.hospital_id} onChange={e => setRequestForm({ ...requestForm, hospital_id: e.target.value })} style={{ width: '100%', height: 46 }}>
                  <option value="">Select Facility...</option>
                  {hospitals.map(h => <option key={h.id} value={h.id}>{h.name} ({h.city})</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div className="admin-modal-field">
                  <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>Blood Type Needed</label>
                  <select className="hemo-input" value={requestForm.blood_group} onChange={e => setRequestForm({ ...requestForm, blood_group: e.target.value })} style={{ width: '100%', height: 46 }}>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                  </select>
                </div>
                <div className="admin-modal-field">
                  <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-400)' }}>Required Units</label>
                  <input type="number" className="hemo-input" min="1" max="50" value={requestForm.units} onChange={e => setRequestForm({ ...requestForm, units: parseInt(e.target.value) || 0 })} style={{ width: '100%', height: 46 }} />
                </div>
              </div>
              <div className="admin-modal-actions" style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
                <button className="admin-btn admin-btn-ghost" onClick={() => { setModal(null); setShowMap(false); setMapCoords(null); }}>Close</button>
                <button className="admin-btn admin-btn-primary" onClick={() => setModalStep(2)} disabled={!requestForm.hospital_id}>Next: Find Matches</button>
              </div>
            </>
          )}

          {modalStep === 2 && (
            <>
              <div className="admin-match-card" style={{ background: 'var(--bg-700)', padding: 16, borderRadius: 12, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--hemo-red)', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                    <Icons.ActivityAlert size={14} style={{ marginRight: 6 }} /> Live Match Explorer
                  </span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>Sector: {hospitals.find(h => h.id === requestForm.hospital_id)?.city}</span>
                </div>

                <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                  {(() => {
                    const h = hospitals.find(h => h.id === requestForm.hospital_id);
                    const matches = users.filter(u =>
                      u && u.role === "donor" &&
                      u.blood_group === requestForm.blood_group &&
                      u.city?.toLowerCase() === h?.city?.toLowerCase()
                    );
                    if (matches.length > 0) {
                      return matches.map(m => (
                        <div
                          key={m?.id}
                          onClick={() => handleGetLogistics(m)}
                          style={{
                            display: 'flex', justifyContent: 'space-between', padding: '12px 10px',
                            borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer',
                            background: selectedDonor?.id === m?.id ? 'rgba(230,57,70,0.1)' : 'transparent',
                            borderRadius: 8, transition: '0.2s'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{m?.full_name}</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{m?.address || m?.city} • Bio-Verified</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--hemo-red)', fontWeight: 800 }}>{m?.blood_group}</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                              {selectedDonor?.id === m?.id && logistics
                                ? `${logistics.distance} km • ${logistics.duration} min`
                                : 'Click for route'}
                            </div>
                          </div>
                        </div>
                      ));
                    }
                    return <div style={{ padding: 24, textAlign: 'center', opacity: 0.4, fontSize: '0.85rem' }}>No matching donors detected in this sector</div>;
                  })()}
                </div>
              </div>

              {/* Logistics card — now includes map toggle */}
              {selectedDonor && (
                <div style={{ background: 'rgba(230,57,70,0.05)', border: '1px solid var(--hemo-red)', padding: 16, borderRadius: 12, marginBottom: 24 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--hemo-red)', marginBottom: 8 }}>
                    Route Logistics Tracker
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{logistics ? `${logistics.distance} KM` : 'Calculating...'}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Satellite Distance</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{logistics ? `${logistics.duration} MINS` : '...'}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Est. Arrival Time</div>
                    </div>
                    {/* Map toggle button */}
                    {mapCoords && (
                      <button
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        onClick={() => setShowMap(v => !v)}
                        style={{
                          border: `1px solid ${showMap ? 'var(--hemo-red)' : 'rgba(255,255,255,0.15)'}`,
                          color: showMap ? 'var(--hemo-red)' : 'rgba(255,255,255,0.6)',
                          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8
                        }}
                        title={showMap ? "Hide map" : "Show on map"}
                      >
                        {/* Map pin SVG icon */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                        {showMap ? 'Hide Map' : 'Show Map'}
                      </button>
                    )}
                  </div>
                  <button
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                    style={{ width: '100%', color: 'var(--hemo-red)' }}
                    onClick={() => handleBroadcastSOS(selectedDonor)}
                    disabled={isBroadcasting}
                  >
                    Send Direct SOS to {selectedDonor.full_name}
                  </button>
                </div>
              )}

              <div className="admin-modal-actions" style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button className="admin-btn admin-btn-ghost" onClick={() => { setModalStep(1); setSelectedDonor(null); setMapCoords(null); setShowMap(false); }}>Back</button>
                <button className="admin-btn admin-btn-primary" onClick={() => handleBroadcastSOS()} disabled={isBroadcasting} style={{ flex: 1, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 900 }}>
                  {isBroadcasting ? "Broadcasting SOS..." : "Confirm & Broadcast Approved SOS"}
                </button>
              </div>
            </>
          )}
        </Modal>
      )}

      {/* ─── FLOATING LEAFLET MAP PANEL ─── */}
      {showMap && mapCoords && (
        <LeafletRouteMap
          mapCoords={mapCoords}
          hospitalName={selectedHospitalName}
          donorName={selectedDonor?.full_name || "Donor"}
          onClose={() => setShowMap(false)}
        />
      )}

    </div>
  );
}