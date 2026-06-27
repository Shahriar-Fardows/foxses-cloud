"use client";

import { FiMail, FiPhoneCall, FiMessageCircle, FiHelpCircle } from "react-icons/fi";

export default function SupportPage() {
  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Support Center</h1>
          <p className="dashboard-subtitle">We're here to help! Get in touch with our team for any assistance.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        
        {/* Email Support Card */}
        <div style={{ background: "var(--card-bg, white)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(67, 56, 202, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", color: "var(--accent)" }}>
            <FiMail size={28} />
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Email Support</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>Drop us an email anytime. We usually reply within 24 hours.</p>
          <a href="mailto:info@foxses.com" style={{ background: "var(--accent)", color: "white", padding: "0.75rem 1.5rem", borderRadius: "8px", fontWeight: 600, textDecoration: "none", width: "100%", transition: "opacity 0.2s" }} onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"} onMouseOut={(e) => e.currentTarget.style.opacity = "1"}>
            info@foxses.com
          </a>
        </div>

        {/* Phone Support Card */}
        <div style={{ background: "var(--card-bg, white)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", color: "#10b981" }}>
            <FiPhoneCall size={28} />
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Phone Support</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>Call us directly for urgent matters during business hours.</p>
          <a href="tel:+8801617643566" style={{ background: "#10b981", color: "white", padding: "0.75rem 1.5rem", borderRadius: "8px", fontWeight: 600, textDecoration: "none", width: "100%", transition: "opacity 0.2s" }} onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"} onMouseOut={(e) => e.currentTarget.style.opacity = "1"}>
            +880 1617-643566
          </a>
        </div>

        {/* WhatsApp Card */}
        <div style={{ background: "var(--card-bg, white)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(37, 211, 102, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", color: "#25D366" }}>
            <FiMessageCircle size={28} />
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>WhatsApp</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>Send us a message on WhatsApp for quick assistance.</p>
          <a href="https://wa.me/8801617643566" target="_blank" rel="noopener noreferrer" style={{ background: "#25D366", color: "white", padding: "0.75rem 1.5rem", borderRadius: "8px", fontWeight: 600, textDecoration: "none", width: "100%", transition: "opacity 0.2s" }} onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"} onMouseOut={(e) => e.currentTarget.style.opacity = "1"}>
            Chat on WhatsApp
          </a>
        </div>

      </div>

      <div style={{ background: "var(--card-bg, white)", padding: "2.5rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
          <FiHelpCircle style={{ color: "var(--accent)" }} /> Frequently Asked Questions
        </h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "0.5rem" }}>How long does it take for recharge to be approved?</h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6" }}>Recharges are usually verified and approved within 1 to 6 hours during regular business hours.</p>
          </div>
          
          <div>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "0.5rem" }}>My API key is not working, what should I do?</h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6" }}>Make sure you are passing both the Client ID and API Key correctly in the JSON body. If it still fails, you can regenerate your key from the Profile page.</p>
          </div>

          <div>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "0.5rem" }}>Can I send messages outside Bangladesh?</h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6" }}>Currently, our system is optimized for Bangladesh numbers (01XXXXXXXXX / 8801XXXXXXXXX). For international routing, please contact our sales team.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
