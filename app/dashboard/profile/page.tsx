"use client";

import { useState } from "react";
import { useClientUser, ClientUser } from "@/hooks/useClientUser";
import { FiUser, FiPhone, FiHash, FiKey, FiRefreshCw, FiCopy, FiCheck } from "react-icons/fi";
import Swal from "sweetalert2";

function ProfileForm({ user, refresh }: { user: ClientUser; refresh: () => void }) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [senderId, setSenderId] = useState(user.senderId || "");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/client/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, senderId }),
    });
    setStatus({ ok: res.ok, message: res.ok ? "Profile updated successfully" : "Failed to update profile" });
    if (res.ok) refresh();
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Full Name</label>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", display: "flex" }}><FiUser /></div>
          <input className="form-input" style={{ paddingLeft: "2.5rem" }} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
      </div>
      
      <div className="form-group">
        <label className="form-label">Phone Number</label>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", display: "flex" }}><FiPhone /></div>
          <input className="form-input" style={{ paddingLeft: "2.5rem" }} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>
      
      <div className="form-group">
        <label className="form-label">Default Sender ID (Optional)</label>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", display: "flex" }}><FiHash /></div>
          <input className="form-input" style={{ paddingLeft: "2.5rem" }} value={senderId} onChange={(e) => setSenderId(e.target.value)} placeholder="Leave blank for default" />
        </div>
      </div>

      {status && (
        <div style={{ padding: "1rem", marginBottom: "1.5rem", borderRadius: "8px", backgroundColor: status.ok ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", color: status.ok ? "#10b981" : "#ef4444", fontSize: "0.9rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {status.message}
        </div>
      )}
      
      <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: "100%", opacity: submitting ? 0.7 : 1 }}>
        {submitting ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

export default function ProfilePage() {
  const { user, loading, refresh } = useClientUser();
  const [regenerating, setRegenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopy = (text: string, type: 'id' | 'key') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  async function handleRegenerate() {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Old keys will instantly stop working once you regenerate.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, regenerate it!'
    });

    if (!result.isConfirmed) return;

    setRegenerating(true);
    const res = await fetch("/api/client/regenerate-key", { method: "POST" });
    if (res.ok) {
      refresh();
      Swal.fire('Regenerated!', 'Your API key has been regenerated.', 'success');
    } else {
      Swal.fire('Error', 'Failed to regenerate API key.', 'error');
    }
    setRegenerating(false);
  }

  if (loading || !user) return <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading profile...</div>;

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">User Profile</h1>
          <p className="dashboard-subtitle">Manage your personal information and API credentials.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
        
        {/* Profile Settings Card */}
        <div style={{ background: "var(--card-bg, white)", padding: "2.5rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)" }}>
            <FiUser style={{ color: "var(--accent)" }} /> Profile Details
          </h2>
          <ProfileForm key={user.id} user={user} refresh={refresh} />
        </div>

        {/* API Credentials Card */}
        <div style={{ background: "var(--card-bg, white)", padding: "2.5rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)" }}>
            <FiKey style={{ color: "var(--accent)" }} /> API Credentials
          </h2>
          
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
              Use these credentials to authenticate your API requests. Keep your API Key secret.
            </p>
            
            <div className="form-group">
              <label className="form-label">Client ID</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input className="form-input" value={user.clientId} readOnly style={{ background: "rgba(0,0,0,0.02)", color: "var(--text-secondary)" }} />
                <button type="button" onClick={() => handleCopy(user.clientId, 'id')} className="btn" style={{ background: "var(--bg-color)", border: "1px solid var(--border-color)", padding: "0 1rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }} title="Copy Client ID">
                  {copiedId ? <FiCheck style={{ color: "#10b981" }} /> : <FiCopy />}
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">API Key</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input className="form-input" value={user.apiKey} readOnly style={{ background: "rgba(0,0,0,0.02)", color: "var(--text-secondary)" }} />
                <button type="button" onClick={() => handleCopy(user.apiKey, 'key')} className="btn" style={{ background: "var(--bg-color)", border: "1px solid var(--border-color)", padding: "0 1rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }} title="Copy API Key">
                  {copiedKey ? <FiCheck style={{ color: "#10b981" }} /> : <FiCopy />}
                </button>
              </div>
            </div>
          </div>
          
          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
            <button 
              onClick={handleRegenerate} 
              disabled={regenerating}
              className="btn"
              style={{ background: "rgba(225, 29, 72, 0.1)", color: "#e11d48", border: "1px solid rgba(225, 29, 72, 0.2)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}
            >
              <FiRefreshCw /> 
              {regenerating ? "Regenerating..." : "Regenerate API Key"}
            </button>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.75rem", lineHeight: "1.4" }}>
              Warning: Regenerating your API key will immediately invalidate your old key. All integrations using the old key will break.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
