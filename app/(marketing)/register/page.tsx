"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiUser, FiMail, FiPhone, FiUploadCloud, FiLock } from "react-icons/fi";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [nidFront, setNidFront] = useState<File | null>(null);
  const [nidBack, setNidBack] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!nidFront || !nidBack) {
      setError("Please upload both the front and back photo of your NID card.");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("nidFront", nidFront);
    formData.append("nidBack", nidBack);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError(data.message);
    }
    setSubmitting(false);
  }

  function handleFrontChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) setNidFront(e.target.files[0]);
  }

  function handleBackChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) setNidBack(e.target.files[0]);
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: "600px" }}>
        <div className="auth-header">
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">Join Foxses Cloude to start sending messages instantly</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}>
                  <FiUser />
                </div>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: "2.5rem" }}
                  placeholder="Rahim Rahman"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

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
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}>
                  <FiPhone />
                </div>
                <input
                  type="tel"
                  className="form-input"
                  style={{ paddingLeft: "2.5rem" }}
                  placeholder="+880 1XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}>
                  <FiLock />
                </div>
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: "2.5rem" }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">NID Verification (Front &amp; Back)</label>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
              For BTRC compliance, we require clear copies of both sides of your National ID. JPEG, PNG, or
              WEBP, up to 5MB each.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="file-input-wrapper">
                <div 
                  className="file-input-btn" 
                  style={{ 
                    padding: nidFront ? "1rem" : "1.5rem", 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    justifyContent: "center",
                    border: nidFront ? "2px solid var(--accent)" : "2px dashed var(--border-color)",
                    backgroundColor: nidFront ? "rgba(67, 56, 202, 0.03)" : "#f8fafc",
                    transition: "all 0.3s ease",
                    height: "100%",
                    minHeight: "140px"
                  }}
                >
                  {nidFront ? (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: "100%", height: "80px", position: "relative", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.05)" }}>
                        <img 
                          src={URL.createObjectURL(nidFront)} 
                          alt="NID Front Preview" 
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                        />
                        <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "0.25rem" }}>
                          <span style={{ color: "white", fontSize: "0.75rem", fontWeight: 600 }}>Front Side</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", justifyContent: "center" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "70%" }}>
                          {nidFront.name}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ 
                        width: "48px", 
                        height: "48px", 
                        borderRadius: "50%", 
                        backgroundColor: "white", 
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center"
                      }}>
                        <FiUploadCloud style={{ fontSize: "1.5rem", color: "var(--accent)" }} />
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>
                          Upload NID Front
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                          Click to browse (JPG, PNG)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/jpeg, image/png, image/webp" onChange={handleFrontChange} required />
              </div>

              <div className="file-input-wrapper">
                <div 
                  className="file-input-btn" 
                  style={{ 
                    padding: nidBack ? "1rem" : "1.5rem", 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    justifyContent: "center",
                    border: nidBack ? "2px solid var(--accent)" : "2px dashed var(--border-color)",
                    backgroundColor: nidBack ? "rgba(67, 56, 202, 0.03)" : "#f8fafc",
                    transition: "all 0.3s ease",
                    height: "100%",
                    minHeight: "140px"
                  }}
                >
                  {nidBack ? (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: "100%", height: "80px", position: "relative", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.05)" }}>
                        <img 
                          src={URL.createObjectURL(nidBack)} 
                          alt="NID Back Preview" 
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                        />
                        <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "0.25rem" }}>
                          <span style={{ color: "white", fontSize: "0.75rem", fontWeight: 600 }}>Back Side</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", justifyContent: "center" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "70%" }}>
                          {nidBack.name}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ 
                        width: "48px", 
                        height: "48px", 
                        borderRadius: "50%", 
                        backgroundColor: "white", 
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center"
                      }}>
                        <FiUploadCloud style={{ fontSize: "1.5rem", color: "var(--accent)" }} />
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>
                          Upload NID Back
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                          Click to browse (JPG, PNG)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/jpeg, image/png, image/webp" onChange={handleBackChange} required />
              </div>
            </div>
          </div>

          {error && (
            <div style={{ color: "#ef4444", fontSize: "0.9rem", marginBottom: "1rem", textAlign: "center", backgroundColor: "#fef2f2", padding: "0.5rem", borderRadius: "6px" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ marginTop: "0.5rem", opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
          >
            {submitting ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="auth-links">
          <span>
            Already have an account? <Link href="/login">Sign in</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
