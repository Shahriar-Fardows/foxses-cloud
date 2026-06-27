"use client";

import { useEffect, useState } from "react";

type SmsLog = {
  _id: string;
  recipient: string;
  message: string;
  status: string;
  endpoint: string;
  cost: number;
  createdAt: string;
};

export default function ReportsPage() {
  const [logs, setLogs] = useState<SmsLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/client/reports");
      const data = await res.json();
      setLogs(data.logs || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">SMS Reports</h1>
          <p className="dashboard-subtitle">View your message history and delivery status.</p>
        </div>
      </div>

      <div className="dashboard-table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Recipient</th>
              <th>Message</th>
              <th>Status</th>
              <th>Cost (৳)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "3rem" }}>
                  <div style={{ display: "inline-block", width: "30px", height: "30px", borderRadius: "50%", border: "3px solid #e2e8f0", borderTopColor: "var(--accent)", animation: "spin 1s linear infinite" }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                  No SMS history yet. Start sending messages to see reports here!
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id}>
                  <td style={{ fontWeight: 600 }}>{log.recipient}</td>
                  <td style={{ maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={log.message}>{log.message}</td>
                  <td>
                    <span className={`badge ${log.status === 'DELIVERED' || log.status === 'SUCCESS' ? 'badge-success' : log.status === 'FAILED' ? 'badge-warning' : 'badge-neutral'}`}>
                      {log.status}
                    </span>
                  </td>
                  <td>{log.cost.toFixed(2)}</td>
                  <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
