"use client";

import { useClientUser } from "@/hooks/useClientUser";
import { FiList, FiUsers, FiBox } from "react-icons/fi";
import { useEffect, useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type SmsLog = {
  _id: string;
  recipient: string;
  message: string;
  status: string;
  cost: number;
  createdAt: string;
  updatedAt?: string;
};

export default function DashboardPage() {
  const { user, loading } = useClientUser();
  const [logs, setLogs] = useState<SmsLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/client/reports");
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLogsLoading(false);
      }
    })();
  }, []);

  const { totalSms, thisMonthSms, monthlyCounts } = useMemo(() => {
    let total = logs.length;
    let thisMonth = 0;
    const counts = new Array(12).fill(0);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    logs.forEach(log => {
      const d = new Date(log.createdAt);
      if (d.getFullYear() === currentYear) {
        counts[d.getMonth()]++;
        if (d.getMonth() === currentMonth) {
          thisMonth++;
        }
      }
    });

    return { totalSms: total, thisMonthSms: thisMonth, monthlyCounts: counts };
  }, [logs]);

  const chartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((m, i) => ({
      name: m,
      sms: monthlyCounts[i]
    }));
  }, [monthlyCounts]);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
      <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid #e2e8f0", borderTopColor: "var(--accent)", animation: "spin 1s linear infinite" }} />
    </div>
  );
  
  if (!user) return (
    <div style={{ padding: "3rem", textAlign: "center", background: "white", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
      <h2>Could not load account</h2>
      <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>Please try signing in again.</p>
    </div>
  );

  return (
    <div style={{ paddingBottom: "2rem" }}>
      {/* Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        
        {/* Card 1 */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
              <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>৳</span>
            </div>
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>Available Balance</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>{user.balance.toFixed(2)} BDT</div>
              <div style={{ background: "rgba(37, 99, 235, 0.1)", color: "var(--accent)", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600 }}>Active</div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
              <FiList style={{ fontSize: "1.1rem" }} />
            </div>
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>Sender IDs</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>1</div>
              <div style={{ background: "rgba(37, 99, 235, 0.1)", color: "var(--accent)", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600 }}>Active</div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
              <FiUsers style={{ fontSize: "1.1rem" }} />
            </div>
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>Total SMS Sent</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>{totalSms}</div>
              <div style={{ background: "rgba(37, 99, 235, 0.1)", color: "var(--accent)", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600 }}>↑ 100%</div>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
              <FiBox style={{ fontSize: "1.1rem" }} />
            </div>
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>This Month</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>{thisMonthSms}</div>
              <div style={{ background: "rgba(37, 99, 235, 0.1)", color: "var(--accent)", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600 }}>↑ Active</div>
            </div>
          </div>
        </div>

      </div>

      {/* Chart Section */}
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid var(--border-color)", padding: "1.5rem", marginBottom: "2rem", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "2rem", color: "var(--text-primary)" }}>Monthly SMS Usage</h3>
        
        <div style={{ height: "250px", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--text-secondary)" }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--text-secondary)" }} />
              <Tooltip 
                cursor={{ fill: 'rgba(37, 99, 235, 0.05)' }}
                contentStyle={{ borderRadius: "8px", border: "1px solid var(--border-color)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
              />
              <Bar dataKey="sms" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent SMS Table */}
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid var(--border-color)", padding: "1.5rem", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-primary)" }}>Recent SMS</h3>
        <div style={{ overflowX: "auto" }}>
          <table className="dashboard-table" style={{ width: "100%", minWidth: "800px" }}>
            <thead>
              <tr>
                <th>Message ID</th>
                <th>Sender ID</th>
                <th>Recipient</th>
                <th>Message</th>
                <th>SMS Count</th>
                <th>Charge</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {logsLoading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>Loading data...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>No recent SMS.</td>
                </tr>
              ) : (
                logs.slice(0, 10).map((log) => (
                  <tr key={log._id}>
                    <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{log._id.slice(-8)}</td>
                    <td>Default</td>
                    <td style={{ fontWeight: 600 }}>{log.recipient}</td>
                    <td style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={log.message}>{log.message}</td>
                    <td>1</td>
                    <td>৳ {log.cost.toFixed(2)}</td>
                    <td>
                      <span style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, background: "rgba(37, 99, 235, 0.1)", color: "var(--accent)" }}>
                        {log.status}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{new Date(log.createdAt).toLocaleString()}</td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{log.updatedAt ? new Date(log.updatedAt).toLocaleString() : "-"}</td>
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
