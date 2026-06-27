"use client";

import { useEffect, useState } from "react";
import { FiCheck, FiX, FiClock } from "react-icons/fi";
import Swal from "sweetalert2";

type RechargeRow = {
  _id: string;
  amount: number;
  method: string;
  trxId?: string;
  status: string;
  createdAt: string;
  client: { name: string; email: string; clientId: string } | null;
};

export default function AdminRechargeRequestsPage() {
  const [requests, setRequests] = useState<RechargeRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/recharge-requests");
    const data = await res.json();
    setRequests(data.requests || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function review(id: string, action: "approve" | "reject") {
    const result = await Swal.fire({
      title: 'Confirm Action',
      text: `Are you sure you want to ${action} this request?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: action === 'approve' ? '#10b981' : '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: `Yes, ${action} it!`
    });

    if (!result.isConfirmed) return;
    
    const res = await fetch(`/api/admin/recharge-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    
    if (res.ok) {
      Swal.fire('Success!', `Request has been ${action}d successfully.`, 'success');
      load();
    } else {
      Swal.fire('Error', 'Failed to process request.', 'error');
    }
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Recharge Requests</h1>
          <p className="dashboard-subtitle">Review, approve, or decline balance reload requests from clients.</p>
        </div>
      </div>

      <div className="dashboard-table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Client Info</th>
              <th>Amount</th>
              <th>Method & TrxID</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                  Loading requests...
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                  No recharge requests are currently in the queue.
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r._id}>
                  <td>
                    <div style={{ color: "var(--text-primary)", fontWeight: 500, fontSize: "0.9rem" }}>
                      {new Date(r.createdAt).toLocaleDateString("en-GB")}
                    </div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                      {new Date(r.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                      {r.client?.name || "Unknown"}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <span>{r.client?.email || "—"}</span>
                      <span style={{ background: "rgba(0,0,0,0.05)", padding: "0.1rem 0.4rem", borderRadius: "4px", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
                        {r.client?.clientId || "—"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.05rem" }}>
                      ৳ {r.amount.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <div style={{ textTransform: "capitalize", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                      {r.method}
                    </div>
                    {r.trxId && (
                      <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                        TrxID: {r.trxId}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={
                      r.status === "pending" ? "badge badge-warning" : 
                      r.status === "approved" ? "badge badge-success" : 
                      "badge badge-neutral"
                    } style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                      {r.status === "pending" && <FiClock />}
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {r.status === "pending" ? (
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                        <button 
                          onClick={() => review(r._id, "approve")}
                          style={{ background: "#10b981", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 600, transition: "transform 0.2s, opacity 0.2s" }}
                          onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                          onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                        >
                          <FiCheck /> Approve
                        </button>
                        <button 
                          onClick={() => review(r._id, "reject")}
                          style={{ background: "white", color: "#ef4444", border: "1px solid #ef4444", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 600, transition: "background 0.2s" }}
                          onMouseOver={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)"}
                          onMouseOut={(e) => e.currentTarget.style.background = "white"}
                        >
                          <FiX /> Decline
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 500, fontStyle: "italic", paddingRight: "1rem" }}>
                        Processed
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
