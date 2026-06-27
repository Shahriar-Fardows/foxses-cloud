"use client";

import { useState } from "react";
import { FiMail, FiArrowLeft } from "react-icons/fi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setIsSent(true);
    } else {
      const data = await res.json();
      setError(data.message || "Something went wrong");
    }
    setSubmitting(false);
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {!isSent ? (
          <>
            <div className="auth-header">
              <h1 className="auth-title">Reset Password</h1>
              <p className="auth-subtitle">Enter your email and we&apos;ll send you a link to reset your password.</p>
            </div>

            <form className="auth-form" onSubmit={handleReset}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}>
                    <FiMail />
                  </div>
                  <input
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: "2.5rem" }}
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div style={{ color: "#ef4444", fontSize: "0.9rem", marginBottom: "1rem", textAlign: "center", backgroundColor: "#fef2f2", padding: "0.5rem", borderRadius: "6px" }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={submitting} className="btn btn-primary">
                {submitting ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 1.5rem" }}>
              ✓
            </div>
            <h2 className="auth-title" style={{ fontSize: "1.75rem" }}>Check your email</h2>
            <p className="auth-subtitle" style={{ marginBottom: "2rem" }}>
              If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link.
            </p>
          </div>
        )}

        <div className="auth-links">
          <a href="/login" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
            <FiArrowLeft /> Back to login
          </a>
        </div>
      </div>
    </div>
  );
}
