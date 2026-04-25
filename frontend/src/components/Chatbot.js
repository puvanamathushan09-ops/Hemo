import React, { useState } from "react";
import "../hemo.css";
import { Icons } from "./Icons";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const faqs = [
    {
      q: "How often can I donate blood?",
      a: "Whole blood donations can be made every 56 days for men and every 84 days for women."
    },
    {
      q: "Who can register as a user?",
      a: "Anyone aged 18+ weighing at least 50kg, in good health can register to donate."
    },
    {
      q: "How does the matching process work?",
      a: "Our centralized system broadcasts urgent requests to all eligible donors nearby in real-time."
    },
    {
      q: "Is it completely free?",
      a: "Yes, Hemo is an entirely free and voluntarily managed network."
    }
  ];

  return (
    <>
      <div 
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "var(--hemo-red)",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 4px 14px rgba(230, 57, 70, 0.4)",
          cursor: "pointer",
          zIndex: 9999,
          transition: "transform 0.3s ease",
          transform: isOpen ? "scale(0.9)" : "scale(1)"
        }}
      >
        {isOpen ? <Icons.X size={26} /> : <Icons.MessageSquare size={26} />}
      </div>

      {isOpen && (
        <div style={{
          position: "fixed",
          bottom: "100px",
          right: "30px",
          width: "350px",
          maxHeight: "500px",
          background: "var(--bg-800)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          zIndex: 9998,
          border: "1px solid var(--border)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          animation: "fadeUp 0.3s ease"
        }}>
          <div style={{
            padding: "1rem 1.5rem",
            background: "linear-gradient(135deg, var(--hemo-red) 0%, #9b111e 100%)",
            color: "white"
          }}>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600" }}>Hemo Support</h3>
            <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>We usually reply instantly</span>
          </div>

          <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1, maxHeight: "350px" }}>
            <div style={{ marginBottom: "1rem", textAlign: "center", fontSize: "0.85rem", color: "var(--text-400)" }}>
              Frequently Asked Questions
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {faqs.map((faq, idx) => (
                <div key={idx} style={{
                  background: "var(--bg-700)",
                  padding: "1rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(255,255,255,0.05)"
                }}>
                  <strong style={{ display: "block", color: "var(--text-100)", marginBottom: "0.5rem", fontSize: "0.95rem" }}>
                    {faq.q}
                  </strong>
                  <span style={{ display: "block", color: "var(--text-300)", fontSize: "0.85rem", lineHeight: "1.5" }}>
                    {faq.a}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{
            padding: "1rem",
            borderTop: "1px solid var(--border)",
            background: "var(--bg-900)",
            textAlign: "center",
            fontSize: "0.85rem",
            color: "var(--text-400)"
          }}>
            Live chat functionality coming soon!
          </div>
        </div>
      )}
      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(10px) }
            to { opacity: 1; transform: translateY(0) }
          }
        `}
      </style>
    </>
  );
}
