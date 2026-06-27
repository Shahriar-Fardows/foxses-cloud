"use client";

import { useEffect, useState } from "react";
import { FiMessageSquare, FiHash, FiClock, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

type LogRow = {
  _id: string;
  recipient: string;
  message: string;
  status: string;
  endpoint: string;
  cost: number;
  createdAt: string;
  client: { name: string; clientId: string } | null;
};

export default function AdminSmsLogsPage() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/sms-logs");
      const data = await res.json();
      setLogs(data.logs || []);
      setLoading(false);
    })();
  }, []);

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("success") || s.includes("delivered")) return <FiCheckCircle />;
    if (s.includes("fail") || s.includes("error")) return <FiAlertCircle />;
    return <FiClock />;
  };

  const getStatusClass = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("success") || s.includes("delivered")) return "badge badge-success";
    if (s.includes("fail") || s.includes("error")) return "badge badge-warning";
    return "badge badge-neutral";
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">SMS Logs</h1>
          <p className="dashboard-subtitle">Monitor and track all SMS messages sent across the platform.</p>
        </div>
      </div>

      <div className="dashboard-table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Client</th>
              <th>Recipient</th>
              <th style={{ width: "35%" }}>Message</th>
              <th>Route / Cost</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                  Loading logs...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                  No SMS logs recorded.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id}>
                  <td>
                    <div style={{ color: "var(--text-primary)", fontWeight: 500, fontSize: "0.9rem" }}>
                      {new Date(log.createdAt).toLocaleDateString("en-GB")}
                    </div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                      {new Date(log.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </td>
                  <td>
                    {log.client ? (
                      <>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>{log.client.name}</div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{log.client.clientId}</div>
                      </>
                    ) : (
                      <span style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>System / Unknown</span>
                    )}
                  </td>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontWeight: 600, color: "var(--text-primary)", background: "rgba(0,0,0,0.04)", padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.85rem" }}>
                      <FiHash style={{ color: "var(--text-secondary)" }} /> {log.recipient}
                    </span>
                  </td>
                  <td>
                    <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid var(--border-color)", padding: "0.5rem 0.75rem", borderRadius: "6px", fontSize: "0.85rem", color: "var(--text-primary)", maxWidth: "100%", wordBreak: "break-word", lineHeight: "1.4" }}>
                      {log.message.length > 80 ? `${log.message.substring(0, 80)}...` : log.message}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "var(--bg-color)", border: "1px solid var(--border-color)", padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase", marginBottom: "0.25rem" }}>
                      {log.endpoint}
                    </div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      ৳ {log.cost.toFixed(2)}
                    </div>
                  </td>
                  <td>
                    <span className={getStatusClass(log.status)} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", textTransform: "capitalize" }}>
                      {getStatusIcon(log.status)}
                      {log.status}
                    </span>
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
