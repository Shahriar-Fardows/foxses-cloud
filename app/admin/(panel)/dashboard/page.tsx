"use client";

import { useEffect, useState } from "react";
import { FiUsers, FiDollarSign, FiMessageSquare, FiTrendingUp } from "react-icons/fi";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{ clients: number; pending: number; sms: number } | null>(null);

  useEffect(() => {
    (async () => {
      const [clientsRes, requestsRes, logsRes] = await Promise.all([
        fetch("/api/admin/clients"),
        fetch("/api/admin/recharge-requests?status=pending"),
        fetch("/api/admin/sms-logs"),
      ]);
      const clients = await clientsRes.json();
      const requests = await requestsRes.json();
      const logs = await logsRes.json();
      setStats({
        clients: clients.clients?.length ?? 0,
        pending: requests.requests?.length ?? 0,
        sms: logs.logs?.length ?? 0,
      });
    })();
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <p className="dashboard-subtitle">Welcome to the Foxses Cloud Admin Panel. Here is what is happening today.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* Total Clients Card */}
        <div style={{ background: "var(--card-bg, white)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.5rem" }}>Total Clients</p>
            <h3 style={{ fontSize: "2rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
              {stats ? stats.clients : "..."}
            </h3>
          </div>
          <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: "rgba(67, 56, 202, 0.1)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FiUsers size={28} />
          </div>
        </div>

        {/* Pending Recharges Card */}
        <div style={{ background: "var(--card-bg, white)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.5rem" }}>Pending Recharges</p>
            <h3 style={{ fontSize: "2rem", fontWeight: 800, margin: 0, color: "#f59e0b" }}>
              {stats ? stats.pending : "..."}
            </h3>
          </div>
          <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FiDollarSign size={28} />
          </div>
        </div>

        {/* SMS Volume Card */}
        <div style={{ background: "var(--card-bg, white)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.5rem" }}>SMS Volume</p>
            <h3 style={{ fontSize: "2rem", fontWeight: 800, margin: 0, color: "#10b981" }}>
              {stats ? stats.sms : "..."}
            </h3>
          </div>
          <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FiMessageSquare size={28} />
          </div>
        </div>
      </div>
      
      {/* Overview Chart / Placeholder */}
      <div style={{ background: "var(--card-bg, white)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", minHeight: "300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
        <FiTrendingUp size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
        <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.5rem" }}>Analytics Overview</h3>
        <p>More detailed analytics and charts will appear here as data comes in.</p>
      </div>
    </div>
  );
}
