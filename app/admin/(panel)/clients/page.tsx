"use client";

import { useEffect, useState } from "react";
import { FiEdit2, FiImage, FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import Swal from "sweetalert2";

type ClientRow = {
  _id: string;
  name: string;
  email: string;
  clientId: string;
  balance: number;
  status: string;
  messageType: string;
  nidFrontKey?: string;
  nidBackKey?: string;
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/clients");
    const data = await res.json();
    setClients(data.clients || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/clients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function updateMessageType(id: string, messageType: string) {
    await fetch(`/api/admin/clients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageType }),
    });
    load();
  }

  async function adjustBalance(id: string) {
    const { value } = await Swal.fire({
      title: 'Adjust Balance',
      input: 'number',
      inputLabel: 'Enter amount (use negative to deduct)',
      inputPlaceholder: 'e.g. 100 or -50',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
    });

    if (value === undefined || value === null || value === '') return;
    
    const balanceAdjustment = Number(value);
    if (Number.isNaN(balanceAdjustment)) return;
    
    const res = await fetch(`/api/admin/clients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ balanceAdjustment }),
    });
    
    if (res.ok) {
      Swal.fire('Success', 'Balance has been adjusted successfully.', 'success');
      load();
    } else {
      Swal.fire('Error', 'Failed to adjust balance.', 'error');
    }
  }

  const getStatusBadgeClass = (status: string) => {
    if (status === "Active") return "badge badge-success";
    if (status === "Suspended") return "badge badge-warning";
    return "badge badge-neutral";
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Client Management</h1>
          <p className="dashboard-subtitle">Manage all registered users, adjust balances, and update account statuses.</p>
        </div>
      </div>

      <div className="dashboard-table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Client Info</th>
              <th>Client ID</th>
              <th>Balance</th>
              <th>Msg Type</th>
              <th>NID Documents</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                  Loading clients from server...
                </td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                  No clients have registered yet.
                </td>
              </tr>
            ) : (
              clients.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>{c.name}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{c.email}</div>
                  </td>
                  <td>
                    <span style={{ background: "rgba(0,0,0,0.05)", padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>
                      {c.clientId}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>৳ {c.balance.toFixed(2)}</span>
                  </td>
                  <td>
                    <select 
                      className="form-input" 
                      style={{ padding: "0.4rem 0.75rem", fontSize: "0.85rem", minWidth: "130px" }}
                      value={c.messageType} 
                      onChange={(e) => updateMessageType(c._id, e.target.value)}
                    >
                      <option>Non-Masking</option>
                      <option>Masking</option>
                    </select>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {c.nidFrontKey ? (
                        <a href={`/api/admin/clients/${c._id}/nid/front`} target="_blank" rel="noreferrer" title="View Front" style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--accent)", fontSize: "0.85rem", fontWeight: 600 }}>
                          <FiImage /> Front
                        </a>
                      ) : (
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>-</span>
                      )}
                      {c.nidBackKey && (
                        <>
                          <span style={{ color: "var(--border-color)" }}>|</span>
                          <a href={`/api/admin/clients/${c._id}/nid/back`} target="_blank" rel="noreferrer" title="View Back" style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--accent)", fontSize: "0.85rem", fontWeight: 600 }}>
                            <FiImage /> Back
                          </a>
                        </>
                      )}
                    </div>
                  </td>
                  <td>
                    <select 
                      className="form-input"
                      style={{ padding: "0.4rem 0.75rem", fontSize: "0.85rem", minWidth: "110px", fontWeight: 600, color: c.status === "Active" ? "#10b981" : c.status === "Suspended" ? "#f59e0b" : "var(--text-secondary)" }}
                      value={c.status} 
                      onChange={(e) => updateStatus(c._id, e.target.value)}
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Suspended</option>
                    </select>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button 
                      onClick={() => adjustBalance(c._id)}
                      style={{ background: "none", border: "1px solid var(--border-color)", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", transition: "all 0.2s" }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                    >
                      <FiEdit2 /> Adjust
                    </button>
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
