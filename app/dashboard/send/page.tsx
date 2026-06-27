"use client";

import { useState } from "react";
import { useClientUser } from "@/hooks/useClientUser";
import { FiSend, FiUser, FiMessageSquare, FiInfo } from "react-icons/fi";

export default function SendPage() {
  const { user, refresh } = useClientUser();
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [senderId, setSenderId] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const res = await fetch("/api/client/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient, message, sender_id: senderId || undefined }),
    });
    const data = await res.json();
    setStatus({ ok: res.ok, message: data.message });
    if (res.ok) {
      setMessage("");
      refresh();
    }
    setSubmitting(false);
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Send SMS</h1>
          <p className="dashboard-subtitle">Instantly reach your audience. Available balance: ৳ {user ? user.balance.toFixed(2) : "..."}</p>
        </div>
      </div>

      <div style={{ background: "var(--card-bg, white)", padding: "2.5rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", maxWidth: "800px", margin: "0 auto", marginLeft: 0 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Recipient(s)</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", display: "flex" }}><FiUser /></div>
              <input
                className="form-input"
                style={{ paddingLeft: "2.5rem" }}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="01XXXXXXXXX, 01YYYYYYYYY (Comma separated)"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Sender ID (optional)</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", display: "flex" }}><FiInfo /></div>
              <input 
                className="form-input" 
                style={{ paddingLeft: "2.5rem" }}
                value={senderId} 
                onChange={(e) => setSenderId(e.target.value)} 
                placeholder="Leave blank for default"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Message</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "1rem", top: "1rem", color: "var(--text-secondary)", display: "flex" }}><FiMessageSquare /></div>
              <textarea 
                className="form-textarea" 
                style={{ paddingLeft: "2.5rem" }}
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                required 
                rows={5}
                placeholder="Type your message here..."
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Characters: {message.length}
            </div>
          </div>

          {status && (
            <div style={{ padding: "1rem", marginBottom: "1.5rem", borderRadius: "8px", backgroundColor: status.ok ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", color: status.ok ? "#10b981" : "#ef4444", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 500 }}>
              {status.message}
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: "100%", opacity: submitting ? 0.7 : 1 }}>
            <FiSend />
            {submitting ? "Sending..." : "Send SMS"}
          </button>
        </form>
      </div>
    </div>
  );
}
