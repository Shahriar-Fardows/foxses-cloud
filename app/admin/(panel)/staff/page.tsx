"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FiUserPlus, FiUsers, FiShield } from "react-icons/fi";

type StaffRow = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/staff");
    const data = await res.json();
    setStaff(data.staff || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch("/api/admin/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    
    const data = await res.json();
    
    if (res.ok) {
      Swal.fire('Created!', 'The new account has been successfully created.', 'success');
      setName("");
      setEmail("");
      setPassword("");
      load();
    } else {
      Swal.fire('Error', data.message || 'Failed to create account.', 'error');
    }
    
    setSubmitting(false);
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Staff & Admins</h1>
          <p className="dashboard-subtitle">Manage internal platform access and create new accounts.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
        
        {/* Create Staff Form */}
        <div style={{ background: "var(--card-bg, white)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiUserPlus className="text-accent" /> Create New Account
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", alignItems: "end" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="e.g. John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="e.g. john@foxses.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Account Role</label>
              <select className="form-input" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="staff">Staff Member</option>
                <option value="admin">Super Admin</option>
              </select>
            </div>
            
            <div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "0.875rem" }} disabled={submitting}>
                {submitting ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>

        {/* Staff List Table */}
        <div className="dashboard-table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                    Loading staff records...
                  </td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                    No staff accounts found.
                  </td>
                </tr>
              ) : (
                staff.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>{s.name}</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{s.email}</div>
                    </td>
                    <td>
                      <span className={s.role === "admin" ? "badge badge-success" : "badge badge-neutral"} style={{ textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                        {s.role === "admin" ? <FiShield /> : <FiUsers />} {s.role}
                      </span>
                    </td>
                    <td>
                      <div style={{ color: "var(--text-primary)", fontWeight: 500, fontSize: "0.9rem" }}>
                        {new Date(s.createdAt).toLocaleDateString("en-GB")}
                      </div>
                      <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                        {new Date(s.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
