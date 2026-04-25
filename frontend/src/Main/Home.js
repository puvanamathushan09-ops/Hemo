import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../hemo.css";
import "./Home.css";
import img3 from "../assets/img/blood-5053771.webp";
import img4 from "../assets/img/Blood7.webp";
import img5 from "../assets/img/GITAM Drone.webp";
import imgBlood from "../assets/img/Blood.webp";
import imgSample from "../assets/img/blood_sample1.webp";

const slidesData = [
  {
    image: img3,
    title: "Gift of Life",
    subtitle: "Your single donation can save up to three lives in your community.",
    cta: "Donate Now",
    link: "/donate"
  },
  {
    image: imgBlood,
    title: "Instant Matching",
    subtitle: "Our smart network connects donors to emergency cases in real-time.",
    cta: "Register Today",
    link: "/register"
  },
  {
    image: imgSample,
    title: "Secure Network",
    subtitle: "A trusted platform built for safety, privacy, and impact.",
    cta: "How it Works",
    link: "/#how-it-works"
  },
  {
    image: img4,
    title: "Emergency Support",
    subtitle: "Need blood urgently? Submit a request and find local heroes instantly.",
    cta: "Request Help",
    link: "/request"
  }
];

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

export default function Home() {
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % slidesData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Animate counter numbers on scroll
  useEffect(() => {
    const animateNum = (el, target, suffix = "") => {
      let startTime = null;
      const step = (ts) => {
        if (!startTime) startTime = ts;
        const p = Math.min((ts - startTime) / 2000, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(ease * target).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateNum(e.target, +e.target.dataset.val, e.target.dataset.sfx || "");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll("[data-val]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="page-content" style={{ background: "var(--bg-900)" }}>

      {/* ═══ LIVE ALERTS MARQUEE (Relocated Phase 26) ═══ */}
      <div className="hemo-marquee">
        <div className="marquee-content highlight">
          <span className="marquee-item">🚨 <strong>URGENT:</strong> O- Negative needed in Colombo General Hospital</span>
          <span className="marquee-item">🩸 <strong>RECENT:</strong> 5 Units of A+ Successful Donation in Jaffna Hub</span>
          <span className="marquee-item">🛡️ <strong>SECURE:</strong> 12,450+ Connections Verified Today</span>
          <span className="marquee-item">📢 <strong>NOTICE:</strong> Network Expand to Anuradhapura Region</span>
          <span className="marquee-item">🚨 <strong>URGENT:</strong> O- Negative needed in Colombo General Hospital</span>
          <span className="marquee-item">🩸 <strong>RECENT:</strong> 5 Units of A+ Successful Donation in Jaffna Hub</span>
        </div>
      </div>

      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-grid-bg" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />

        <div className="hero-inner">
          {/* Left */}
          <div className="hero-text">
            <div className="hemo-badge" data-aos="fade-up">
              <span className="hemo-badge-dot" />
              Live Life-Saving Network
            </div>

            <h1 className="hero-title" data-aos="fade-up" data-aos-delay="100">
              Every Drop<br />
              <span className="grad">Saves a Life.</span>
            </h1>

            <p className="hero-desc" data-aos="fade-up" data-aos-delay="200">
              Hemo is Sri Lanka's premium digital blood bank. We connect heroes with those in need
              through an intelligent, instantaneous, and secure platform.
            </p>

            <div className="hero-btns" data-aos="fade-up" data-aos-delay="300">
              <Link to="/donate" className="hemo-btn-primary" id="hero-donate">🩸 Donate Blood</Link>
              <Link to="/request" className="hemo-btn-secondary" id="hero-request">📋 Request Blood</Link>
            </div>

            <div className="hero-stats" data-aos="fade-up" data-aos-delay="400">
              {[
                { val: 2450, sfx: "+", lbl: "Active Donors" },
                { val: 1800, sfx: "+", lbl: "Matches Completed" },
                { val: 12, sfx: "", lbl: "Major Cities" },
              ].map((s) => (
                <div key={s.lbl}>
                  <div className="hero-stat-val">
                    <span data-val={s.val} data-sfx={s.sfx}>{s.val}{s.sfx}</span>
                  </div>
                  <div className="hero-stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual - Premium Slideshow */}
          <div className="hero-visual">
            <div className="hero-visual-container" data-aos="zoom-in" data-aos-duration="1200">
              <div className="hero-img-frame">
                {slidesData.map((slide, i) => (
                  <div
                    key={i}
                    className={`hero-slide-item ${i === slideIdx ? "active" : ""}`}
                  >
                    <img src={slide.image} alt={slide.title} className="hero-img-slide" />
                    <div className="hero-slide-caption">
                      <h3>{slide.title}</h3>
                      <p>{slide.subtitle}</p>
                    </div>
                  </div>
                ))}

                <div className="hero-img-overlay" />

                {/* Navigation Controls */}
                <div className="hero-nav-dots">
                  {slidesData.map((_, i) => (
                    <button
                      key={i}
                      className={`dot ${i === slideIdx ? "active" : ""}`}
                      onClick={() => setSlideIdx(i)}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>

                <div className="hero-img-chip">
                  <div className="hero-img-chip-icon">🛡️</div>
                  <div>
                    <strong>Secure & Authenticated</strong>
                    <span>Verified Medical Network</span>
                  </div>
                </div>
              </div>

              {/* Floating tags */}
              <div className="hero-float-container">
                <span className="hero-float-tag hero-float-tag-1">🩸 O- Negative Alert</span>
                <span className="hero-float-tag hero-float-tag-2">⚡ 99.8% Match Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <div className="hiw-section" id="how-it-works">
        <div className="hiw-inner">
          <div className="section-header-center hemo-section">
            <span className="section-tag">Digital Hub</span>
            <h2 className="section-heading">How Hemo Operates</h2>
            <p className="section-desc">We leverage smart technology to bridge the gap between donors and patients.</p>
          </div>
          <div className="hiw-grid">
            {[
              { n: "01", title: "Smart Registration", desc: "Create a verified profile. We classify your biological data securely." },
              { n: "02", title: "Urgency Analysis", desc: "Our system prioritizes requests based on proximity and blood group scarcity." },
              { n: "03", title: "Direct Connection", desc: "Once a match is found, we coordinate the safe transfer through medical facilities." },
            ].map((s, idx) => (
              <div className="hiw-card" key={s.n} data-aos="fade-up" data-aos-delay={idx * 150}>
                <div className="hiw-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ SERVICES ═══ */}
      <section className="hemo-section">
        <div className="section-header-center">
          <span className="section-tag">Network Scope</span>
          <h2 className="section-heading">Platform Services</h2>
          <p className="section-desc">Empowering healthcare through decentralized donor management.</p>
        </div>
        <div className="services-grid">
          {[
            { id: "svc-about", img: img5, icon: "🏥", title: "Medical Outreach", desc: "Our system connects directly with Jaffna's major teaching hospitals and clinics.", link: "/about", label: "Read Our Story" },
            { id: "svc-donate", img: img3, icon: "♥️", title: "Donor Portal", desc: "Manage your donation history, health stats, and future appointments seamlessly.", link: "/donate", label: "Be a Hero" },
            { id: "svc-request", img: img4, icon: "⚡", title: "Emergency SOS", desc: "A high-priority channel for life-threatening blood shortages across the district.", link: "/request", label: "Request SOS" },
          ].map((s, idx) => (
            <div className="svc-card" key={s.id} id={s.id} data-aos="zoom-in-up" data-aos-delay={idx * 100}>
              <img src={s.img} alt={s.title} />
              <div className="svc-overlay">
                <div className="svc-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <Link to={s.link} className="svc-link">{s.label} →</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <div className="stats-strip">
        <div className="stats-strip-inner">
          {[
            { val: 2450, sfx: "+", lbl: "Active Donors" },
            { val: 1800, sfx: "+", lbl: "Matches Found" },
            { val: 12, sfx: "", lbl: "Hospitals Joined" },
            { val: 100, sfx: "%", lbl: "Free Service" },
          ].map((s) => (
            <div key={s.lbl}>
              <div className="stat-big">
                <span data-val={s.val} data-sfx={s.sfx}>{s.val}{s.sfx}</span>
              </div>
              <div className="stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ CTA ═══ */}
      <section className="cta-band">
        <div className="cta-box">
          <div className="cta-bg-shine" />
          <h2>The Choice to Save a Life.</h2>
          <p>Join the movement that's reshaping emergency healthcare across Northern Sri Lanka.</p>
          <div className="cta-btns">
            <Link to="/register" className="hemo-btn-primary" id="cta-register">🚀 Join the Network</Link>
            <Link to="/login" className="hemo-btn-secondary" id="cta-login">Sign In to Account</Link>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="hemo-footer">
        <div className="hemo-footer-inner">
          <div className="hemo-footer-grid">
            <div className="hemo-footer-brand">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <HemoLogoSVG size={32} />
                <span style={{ fontSize: "1.3rem", fontWeight: 900, background: "linear-gradient(135deg,#fff 30%,#e63946)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Hemo</span>
              </div>
              <p>Hemo Protocol — Modernizing blood donation through technology, empathy, and speed. A student-led healthcare initiative.</p>
            </div>
            <div className="hemo-footer-col">
              <h5>Navigation</h5>
              <ul>
                <li><Link to="/">Home Central</Link></li>
                <li><Link to="/about">Protocol Info</Link></li>
                <li><Link to="/donate">Donor Zone</Link></li>
                <li><Link to="/request">SOS Requests</Link></li>
              </ul>
            </div>
            <div className="hemo-footer-col">
              <h5>Gateways</h5>
              <ul>
                <li><Link to="/login">Portal Login</Link></li>
                <li><Link to="/register">Create Identity</Link></li>
                <li><Link to="/admin">Admin Access</Link></li>
              </ul>
            </div>
            <div className="hemo-footer-col">
              <h5>Contact Protocol</h5>
              <div className="hemo-contact-item">
                <span className="ci-icon">📍</span>
                <a href="https://goo.gl/maps/bFanvvmbxhrSjWVC7" target="_blank" rel="noreferrer">Main Research Hub<br />Jaffna, Sri Lanka</a>
              </div>
              <div className="hemo-contact-item">
                <span className="ci-icon">📞</span>
                <a href="tel:+94766509678">+94 76650 9678</a>
              </div>
              <div className="hemo-contact-item">
                <span className="ci-icon">✉️</span>
                <span>ops@hemo.lk</span>
              </div>
            </div>
          </div>
          <div className="hemo-footer-bottom">
            <p>© 2026 Hemo Research & Development. Managed by UOB HDIT Excellence Hub.</p>
            <p>Empowered by Northern Medical Communities</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
