import React from "react";
import { Link } from "react-router-dom";
import "../hemo.css";
import { Icons } from "../components/Icons";
import imgBlood from "../assets/img/blood-5053771.webp";
import imgJansihan from "../assets/img/S.Jansihan.jpg";
import imgPhensiah from "../assets/img/S.Phensiah.jpg";
import imgMathushan from "../assets/img/P.Mathushan.jpg";
import imgGayanen from "../assets/img/K.Gayanen.jpg";

const team = [
  { name: "S. Jansihan", role: "CEO", img: imgJansihan, icon: <Icons.Award size={16} /> },
  { name: "S. Phensiah", role: "Developer", img: imgPhensiah, icon: <Icons.Search size={16} /> },
  { name: "P. Mathushan", role: "QA", img: imgMathushan, icon: <Icons.Rocket size={16} /> },
  { name: "K. Gayanen", role: "Project Manager", img: imgGayanen, icon: <Icons.Tool size={16} /> },
];

const values = [
  { icon: <Icons.Heart size={24} />, color: "var(--hemo-red)", title: "Compassion", desc: "Helping people in their most vulnerable moments — unconditionally and without barriers." },
  { icon: <Icons.Zap size={24} />, color: "#fca311", title: "Speed", desc: "Emergency blood requests matched in minutes. Every second counts in a crisis." },
  { icon: <Icons.Lock size={24} />, color: "var(--text-100)", title: "Trust", desc: "Your health data is handled with maximum care, privacy, and security." },
  { icon: <Icons.Globe size={24} />, color: "#48cae4", title: "Accessibility", desc: "Free for everyone. No barriers to life-saving blood services, ever." },
  { icon: <Icons.Users size={24} />, color: "#f4a261", title: "Community", desc: "Built by students for students, families, and everyone in between." },
  { icon: <Icons.Smartphone size={24} />, color: "#a8dadc", title: "Simplicity", desc: "Register, donate, or request in under 3 steps. Simple by design." },
];

const stats = [
  { value: "500+", label: "Donors Registered" },
  { value: "24/7", label: "System Uptime" },
  { value: "3", label: "Cities Covered" },
  { value: "100%", label: "Free Forever" },
];

export default function About() {
  return (
    <div className="page-content" style={{ background: "var(--bg-800)", overflowX: "hidden" }}>

      <style>{`
        /* ── local enhancements, zero theme override ── */
        .ab-noise {
          position: absolute; inset: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.5;
        }
        .ab-hero-pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 16px 6px 8px;
          background: rgba(230,57,70,0.12);
          border: 1px solid rgba(230,57,70,0.3);
          border-radius: 100px;
          font-size: 0.72rem; font-weight: 700;
          color: var(--hemo-red); text-transform: uppercase; letter-spacing: 1.5px;
          margin-bottom: 1.5rem;
        }
        .ab-hero-pill span.dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--hemo-red);
          animation: pulse-dot 2s ease infinite;
        }
        @keyframes pulse-dot {
          0%,100% { box-shadow: 0 0 0 0 rgba(230,57,70,0.6); }
          50%      { box-shadow: 0 0 0 6px rgba(230,57,70,0);  }
        }

        /* stat counter cards */
        .ab-stat {
          position: relative;
          padding: 2rem 1.5rem;
          border-radius: 16px;
          background: var(--bg-700);
          border: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
          text-align: center;
          transition: transform .25s, border-color .25s;
        }
        .ab-stat:hover { transform: translateY(-4px); border-color: rgba(230,57,70,0.35); }
        .ab-stat-value {
          font-size: clamp(2rem,4vw,2.8rem);
          font-weight: 900;
          color: var(--text-100);
          letter-spacing: -2px;
          line-height: 1;
          margin-bottom: 0.4rem;
        }
        .ab-stat-label { font-size: 0.78rem; font-weight: 600; color: var(--text-400); letter-spacing: 0.5px; text-transform: uppercase; }
        .ab-stat::before {
          content:''; position:absolute; bottom:-20px; right:-20px;
          width:70px; height:70px; border-radius:50%;
          background: radial-gradient(circle, rgba(230,57,70,0.2) 0%, transparent 70%);
        }

        /* mission section */
        .ab-mission-img-wrap {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          aspect-ratio: 4/3;
        }
        .ab-mission-img-wrap img { width:100%; height:100%; object-fit:cover; display:block; }
        .ab-mission-img-wrap::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(135deg, rgba(230,57,70,0.18) 0%, transparent 60%);
          pointer-events:none;
        }
        .ab-mission-badge {
          position: absolute; bottom: 20px; left: 20px;
          background: rgba(15,15,20,0.85);
          border: 1px solid rgba(230,57,70,0.4);
          backdrop-filter: blur(12px);
          border-radius: 14px;
          padding: 14px 18px;
          display: flex; align-items: center; gap: 12px;
        }
        .ab-mission-badge-dot {
          width:10px; height:10px; border-radius:50%;
          background:var(--hemo-red);
          animation: pulse-dot 2s ease infinite;
          flex-shrink:0;
        }

        /* value cards */
        .ab-value-card {
          position: relative;
          padding: 2rem;
          border-radius: 20px;
          background: var(--bg-700);
          border: 1px solid rgba(255,255,255,0.06);
          transition: transform .3s, border-color .3s, box-shadow .3s;
          overflow: hidden;
          cursor: default;
        }
        .ab-value-card:hover {
          transform: translateY(-6px);
          border-color: rgba(230,57,70,0.25);
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .ab-value-icon-wrap {
          width: 48px; height: 48px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.25rem;
        }
        .ab-value-card::after {
          content: ''; position: absolute; top: -40px; right: -40px;
          width: 120px; height: 120px; border-radius: 50%;
          background: radial-gradient(circle, currentColor 0%, transparent 70%);
          opacity: 0.04;
          transition: opacity .3s;
        }
        .ab-value-card:hover::after { opacity: 0.08; }

        /* team cards */
        .ab-team-card {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          background: var(--bg-700);
          border: 1px solid rgba(255,255,255,0.07);
          transition: transform .3s, box-shadow .3s;
          group: true;
        }
        .ab-team-card:hover { transform: translateY(-8px); box-shadow: 0 32px 80px rgba(0,0,0,0.4); }
        .ab-team-img-wrap {
          position: relative;
          width: 100%; aspect-ratio: 1;
          overflow: hidden;
        }
        .ab-team-img-wrap img {
          width:100%; height:100%; object-fit:cover; display:block;
          transition: transform .5s ease;
        }
        .ab-team-card:hover .ab-team-img-wrap img { transform: scale(1.06); }
        .ab-team-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(10,10,16,0.85) 0%, transparent 50%);
          pointer-events: none;
        }
        .ab-team-info {
          padding: 1.25rem 1.5rem 1.5rem;
        }
        .ab-team-role-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px;
          background: rgba(230,57,70,0.12);
          border: 1px solid rgba(230,57,70,0.25);
          border-radius: 100px;
          font-size: 0.68rem; font-weight: 700;
          color: #f4828b; letter-spacing: 0.5px;
          margin-bottom: 0.4rem;
        }

        /* CTA section */
        .ab-cta-wrap {
          position: relative;
          border-radius: 32px;
          overflow: hidden;
          padding: 5rem 3rem;
          text-align: center;
          background: var(--bg-700);
          border: 1px solid rgba(230,57,70,0.15);
        }
        .ab-cta-wrap::before {
          content:''; position:absolute; top:50%; left:50%;
          transform: translate(-50%,-50%);
          width: 600px; height: 600px; border-radius:50%;
          background: radial-gradient(circle, rgba(230,57,70,0.08) 0%, transparent 70%);
          pointer-events:none;
        }
        .ab-line-deco {
          display: flex; align-items: center; gap: 16px;
          margin: 1.5rem 0;
        }
        .ab-line-deco::before, .ab-line-deco::after {
          content:''; flex:1; height:1px;
          background: linear-gradient(to right, transparent, rgba(230,57,70,0.3), transparent);
        }
        .ab-divider {
          width: 40px; height: 2px; border-radius: 2px;
          background: var(--hemo-red); margin: 1.5rem auto 0;
        }
        .ab-btn-glow {
          position: relative;
          transition: box-shadow .3s;
        }
        .ab-btn-glow:hover {
          box-shadow: 0 0 32px rgba(230,57,70,0.45);
        }

        @media (max-width: 768px) {
          .ab-mission-grid { grid-template-columns: 1fr !important; }
          .ab-stats-grid   { grid-template-columns: repeat(2,1fr) !important; }
          .ab-values-grid  { grid-template-columns: 1fr !important; }
          .ab-team-grid    { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════════ */}
      <section style={{ position: "relative", minHeight: "72vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "6rem", overflow: "hidden" }}>
        {/* Background layers */}
        <div className="page-banner-bg" style={{ position: "absolute", inset: 0 }} />
        <div className="page-banner-grid" style={{ position: "absolute", inset: 0 }} />
        <div className="ab-noise" />

        {/* Radial glow */}
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(230,57,70,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />

        {/* Decorative ring */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, borderRadius: "50%", border: "1px solid rgba(230,57,70,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 340, height: 340, borderRadius: "50%", border: "1px solid rgba(230,57,70,0.05)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 720, padding: "0 2rem" }} data-aos="fade-up">
          <div className="ab-hero-pill">
            <span className="dot" />
            Who We Are
          </div>

          <h1 style={{
            fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
            fontWeight: 900,
            color: "var(--text-100)",
            lineHeight: 1.05,
            letterSpacing: "-3px",
            marginBottom: "1.5rem"
          }}>
            About{" "}
            <span style={{
              color: "var(--hemo-red)",
              display: "inline-block",
              position: "relative"
            }}>
              Hemo
              <svg style={{ position: "absolute", bottom: -8, left: 0, width: "100%", height: 8, overflow: "visible" }} viewBox="0 0 100 8" preserveAspectRatio="none">
                <path d="M0,7 Q25,1 50,6 Q75,11 100,5" stroke="var(--hemo-red)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
              </svg>
            </span>
          </h1>

          <p style={{ fontSize: "1.1rem", color: "var(--text-400)", lineHeight: 1.75, marginBottom: "2.5rem", maxWidth: 560, margin: "0 auto 2.5rem" }}>
            A student-led blood bank initiative bridging donors and patients — for free, for everyone, around the clock.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/donate" className="hemo-btn-primary ab-btn-glow" id="about-hero-donate" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.95rem" }}>
              <Icons.Drop size={18} /> Donate Blood
            </Link>
            <Link to="/register" className="hemo-btn-secondary" id="about-hero-register" style={{ fontSize: "0.95rem" }}>
              Join the Network
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to bottom, transparent, var(--bg-800))", pointerEvents: "none" }} />
      </section>

      {/* ══════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════ */}
      <section style={{ padding: "0 2rem 5rem", maxWidth: 1400, margin: "0 auto" }}>
        <div className="ab-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
          {stats.map((s, i) => (
            <div key={s.label} className="ab-stat" data-aos="fade-up" data-aos-delay={i * 80}>
              <div className="ab-stat-value">{s.value}</div>
              <div className="ab-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MISSION
      ══════════════════════════════════════════ */}
      <section style={{ padding: "4rem 2rem 6rem", maxWidth: 1400, margin: "0 auto" }}>
        <div className="ab-mission-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>

          {/* Left: text */}
          <div data-aos="fade-right">
            <div className="ab-hero-pill" style={{ marginBottom: "1.25rem" }}>
              <span className="dot" />
              Our Mission
            </div>
            <h2 style={{ fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 900, color: "var(--text-100)", lineHeight: 1.15, letterSpacing: "-1.5px", marginBottom: "1.5rem" }}>
              Blood Should Never<br />
              <span style={{ color: "var(--hemo-red)" }}>Have a Price Tag</span>
            </h2>

            <div style={{ width: 40, height: 3, background: "var(--hemo-red)", borderRadius: 2, marginBottom: "1.75rem" }} />

            <p style={{ color: "var(--text-400)", lineHeight: 1.8, marginBottom: "1rem", fontSize: "0.95rem" }}>
              Hemo (formerly LSBB) is an initiative by <strong style={{ color: "var(--text-100)", fontWeight: 700 }}>UOB HDIT</strong> students to provide a reliable, free platform for blood donation and acceptance across Sri Lanka.
            </p>
            <p style={{ color: "var(--text-400)", lineHeight: 1.8, fontSize: "0.95rem" }}>
              We connect donors with patients in real-time, reducing waiting times dramatically. Reachable 24/7 and designed to work even in the most critical emergencies.
            </p>

            <div style={{ display: "flex", gap: "1rem", marginTop: "2.25rem", flexWrap: "wrap" }}>
              <Link to="/donate" className="hemo-btn-primary ab-btn-glow" id="about-donate-btn" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Icons.Drop size={17} /> Donate Now
              </Link>
              <Link to="/register" className="hemo-btn-secondary" id="about-register-btn">
                Register Free
              </Link>
            </div>
          </div>

          {/* Right: image */}
          <div data-aos="fade-left">
            <div className="ab-mission-img-wrap" style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.4)" }}>
              <img src={imgBlood} alt="Blood Donation" />

              {/* floating badge */}
              <div className="ab-mission-badge">
                <div className="ab-mission-badge-dot" />
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-400)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Live Network</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-100)", fontWeight: 800 }}>Matching donors now</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          VALUES
      ══════════════════════════════════════════ */}
      <section style={{ background: "var(--bg-700)", padding: "6rem 2rem", position: "relative", overflow: "hidden" }}>
        {/* Background accent */}
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(230,57,70,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }} data-aos="fade-up">
            <div className="ab-hero-pill" style={{ justifyContent: "center" }}>
              <span className="dot" />
              What We Stand For
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 900, color: "var(--text-100)", letterSpacing: "-1.5px" }}>
              Our Core Values
            </h2>
            <div className="ab-divider" />
          </div>

          <div className="ab-values-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }}>
            {values.map((v, idx) => (
              <div key={v.title} className="ab-value-card" data-aos="fade-up" data-aos-delay={idx * 80} style={{ color: v.color }}>
                <div className="ab-value-icon-wrap" style={{ background: `${v.color}15`, color: v.color }}>
                  {v.icon}
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-100)", marginBottom: "0.5rem", letterSpacing: "-0.3px" }}>
                  {v.title}
                </h3>
                <p style={{ fontSize: "0.855rem", color: "var(--text-400)", lineHeight: 1.7, margin: 0 }}>{v.desc}</p>

                {/* corner number */}
                <div style={{ position: "absolute", top: 16, right: 20, fontSize: "0.65rem", fontWeight: 900, color: v.color, opacity: 0.25, letterSpacing: 1 }}>
                  0{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TEAM
      ══════════════════════════════════════════ */}
      <section style={{ padding: "6rem 2rem", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }} data-aos="fade-up">
          <div className="ab-hero-pill" style={{ justifyContent: "center" }}>
            <span className="dot" />
            The People
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 900, color: "var(--text-100)", letterSpacing: "-1.5px", marginBottom: "0.75rem" }}>
            Meet Our Team
          </h2>
          <p style={{ color: "var(--text-400)", fontSize: "0.95rem", maxWidth: 480, margin: "0 auto" }}>
            Passionate students dedicated to making a difference, one pint at a time.
          </p>
          <div className="ab-divider" />
        </div>

        <div className="ab-team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.25rem" }}>
          {team.map((m, idx) => (
            <div key={m.name} className="ab-team-card" data-aos="zoom-in" data-aos-delay={idx * 100}>
              <div className="ab-team-img-wrap">
                <img src={m.img} alt={m.name} />
                <div className="ab-team-img-overlay" />
              </div>

              <div className="ab-team-info">
                <div className="ab-team-role-pill">
                  {m.icon}
                  {m.role}
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-100)", margin: 0, letterSpacing: "-0.3px" }}>
                  {m.name}
                </h3>
              </div>

              {/* Red corner accent */}
              <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "0 40px 40px 0", borderColor: `transparent var(--hemo-red) transparent transparent`, opacity: 0.6 }} />
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <section style={{ padding: "4rem 2rem 6rem", maxWidth: 1100, margin: "0 auto" }}>
        <div className="ab-cta-wrap" data-aos="zoom-in" data-aos-duration="900">
          <div className="ab-hero-pill" style={{ justifyContent: "center" }}>
            <span className="dot" />
            Be Part of Something Real
          </div>

          <h2 style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 900, color: "var(--text-100)", letterSpacing: "-2px", lineHeight: 1.1, marginBottom: "1rem" }}>
            Join the Hemo<br />
            <span style={{ color: "var(--hemo-red)" }}>Community</span>
          </h2>

          <div className="ab-line-deco">
            <span style={{ fontSize: "0.8rem", color: "var(--text-400)", fontWeight: 600, whiteSpace: "nowrap" }}>Donor · Patient · Healthcare Pro</span>
          </div>

          <p style={{ color: "var(--text-400)", fontSize: "0.95rem", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 460, margin: "0 auto 2.5rem" }}>
            Whatever your role, there's a place for you here. Help us save lives — it only takes a few minutes to sign up.
          </p>

          <Link to="/register" className="hemo-btn-primary ab-btn-glow" id="about-cta-register" style={{ fontSize: "1rem", padding: "1rem 2.5rem", display: "inline-flex", alignItems: "center", gap: 10 }}>
            <Icons.Rocket size={20} /> Create Your Account
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="hemo-footer">
        <div className="hemo-footer-inner">
          <div className="hemo-footer-bottom" style={{ justifyContent: "center" }}>
            <p style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              © 2024 Hemo Blood Bank. Built with <Icons.Heart size={14} color="var(--hemo-red)" /> by UOB HDIT, SLIIT &amp; Jaffna Students
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}