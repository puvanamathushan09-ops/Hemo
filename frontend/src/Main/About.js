import React from "react";
import { Link } from "react-router-dom";
import "../hemo.css";
import imgBlood from "../assets/img/blood-5053771.webp";
import imgYash from "../assets/img/YASHWANTSIR.webp";
import imgHarsha from "../assets/img/harsha.jpg";
import imgSnehil from "../assets/img/snehil.jpg";
import imgShashank from "../assets/img/shashank.jpg";
import imgAkash from "../assets/img/akash.jpg";
import imgSudheer from "../assets/img/sudheer.jpg";

const team = [
  { name: "Yashwanth Amanapu", role: "Team Manager", img: imgYash, icon: "👑" },
  { name: "Snehil Sah",        role: "Team Member",  img: imgSnehil,   icon: "💻" },
  { name: "Shashank Sahay",    role: "Team Member",  img: imgShashank, icon: "🎨" },
  { name: "Akash Chowdary",    role: "Team Member",  img: imgAkash,    icon: "🔧" },
  { name: "P Sudheer Varma",   role: "Team Member",  img: imgSudheer,  icon: "📊" },
  { name: "S Harsha Kumar",    role: "Team Member",  img: imgHarsha,   icon: "🚀" },
];

export default function About() {
  return (
    <div className="page-content" style={{ background: "var(--bg-800)" }}>

      {/* ── Banner ── */}
      <div className="page-banner" style={{ paddingTop: "5rem" }}>
        <div className="page-banner-bg" />
        <div className="page-banner-grid" />
        <div className="page-banner-content" data-aos="fade-up">
          <div className="page-banner-label">Who We Are</div>
          <h1 className="page-banner-title">About <span style={{ color: "var(--hemo-red)" }}>Hemo</span></h1>
          <p className="page-banner-sub">
            A student-led blood bank initiative bridging donors and patients — for free, for everyone.
          </p>
        </div>
      </div>

      {/* ── Mission ── */}
      <section className="hemo-section" style={{ paddingBottom: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          <div data-aos="fade-right">
            <span className="section-tag">Our Mission</span>
            <h2 className="section-heading" style={{ marginBottom: "1.25rem" }}>
              Blood Should Never<br />Have a Price Tag
            </h2>
            <p className="section-desc" style={{ maxWidth: "100%" }}>
              Hemo (formerly LSBB) is an initiative by a group of <strong style={{ color: "var(--text-100)" }}>UOB HDIT</strong> students
              to provide the community with a reliable, free platform for blood donation and acceptance.
            </p>
            <p className="section-desc" style={{ maxWidth: "100%", marginTop: "1rem" }}>
              We connect donors with patients in real-time, reducing waiting times dramatically.
              Our system is reachable 24/7 and designed to work even in emergencies.
            </p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
              <Link to="/donate" className="hemo-btn-primary" id="about-donate-btn">🩸 Donate Now</Link>
              <Link to="/register" className="hemo-btn-secondary" id="about-register-btn">Register Free</Link>
            </div>
          </div>
          <div data-aos="fade-left" style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
            <img src={imgBlood} alt="Blood Donation" style={{ width: "100%", height: 380, objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(255,255,255,0.5) 0%, transparent 60%)" }} />
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{ background: "var(--bg-700)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div className="section-header-center" style={{ marginBottom: "3rem" }}>
            <span className="section-tag">What We Stand For</span>
            <h2 className="section-heading">Our Core Values</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
            {[
              { icon: "❤️", title: "Compassion", desc: "We believe in helping people in their most vulnerable moments — unconditionally." },
              { icon: "⚡", title: "Speed",       desc: "Emergency blood requests are matched in minutes, not hours. Every second counts." },
              { icon: "🔒", title: "Trust",       desc: "Your data and health information is handled with maximum care and privacy." },
              { icon: "🌍", title: "Accessibility", desc: "Free for everyone. No barriers to access life-saving blood services." },
              { icon: "🤝", title: "Community",   desc: "Built by students for students, families, and everyone in between." },
              { icon: "📱", title: "Simplicity",  desc: "A seamless experience — register, donate, or request in under 3 steps." },
            ].map((v, idx) => (
              <div key={v.title} className="glass-card" style={{ padding: "2rem" }} data-aos="fade-up" data-aos-delay={idx * 100}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{v.icon}</div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-100)", marginBottom: "0.5rem" }}>{v.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-400)", lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="hemo-section">
        <div className="section-header-center">
          <span className="section-tag">The People</span>
          <h2 className="section-heading">Meet Our Team</h2>
          <p className="section-desc">Passionate students dedicated to making a difference one pint at a time.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
          {team.map((m, idx) => (
            <div
              key={m.name}
              className="glass-card"
              style={{ padding: "2rem", textAlign: "center", position: "relative", overflow: "hidden" }}
              data-aos="zoom-in"
              data-aos-delay={idx * 100}
            >
              <div style={{
                width: 90, height: 90, borderRadius: "50%",
                overflow: "hidden", margin: "0 auto 1rem",
                border: "3px solid var(--hemo-red)",
                boxShadow: "0 0 20px var(--hemo-red-glow)"
              }}>
                <img src={m.img} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ fontSize: "1.3rem", marginBottom: "0.4rem" }}>{m.icon}</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-100)", marginBottom: "0.25rem" }}>{m.name}</h3>
              <span style={{
                display: "inline-block", padding: "0.2rem 0.75rem",
                background: "var(--hemo-red-soft)", border: "1px solid rgba(230,57,70,0.3)",
                borderRadius: "100px", fontSize: "0.72rem", fontWeight: 600, color: "#f4828b"
              }}>{m.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Strip ── */}
      <section style={{ background: "var(--bg-700)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }} data-aos="zoom-in" data-aos-duration="1000">
          <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 900, color: "var(--text-100)", letterSpacing: "-1px", marginBottom: "1rem" }}>
            Join the Hemo Community
          </h2>
          <p style={{ color: "var(--text-400)", fontSize:"1rem", lineHeight:1.75, marginBottom:"2rem" }}>
            Whether you're a donor, patient, or healthcare professional — there's a place for you here.
          </p>
          <Link to="/register" className="hemo-btn-primary" id="about-cta-register" style={{ fontSize: "1rem", padding: "1rem 2rem" }}>
            🚀 Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="hemo-footer">
        <div className="hemo-footer-inner">
          <div className="hemo-footer-bottom" style={{ justifyContent: "center" }}>
            <p>© 2024 Hemo Blood Bank. Built with ❤️ by UOB HDIT, SLIIT & Jaffna Students</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
