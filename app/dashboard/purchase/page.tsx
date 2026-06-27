"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type RechargeRequest = {
  _id: string;
  amount: number;
  method: string;
  trxId?: string;
  status: string;
  createdAt: string;
};

const MIN_RECHARGE_AMOUNT = 500;

export default function PurchasePage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [requests, setRequests] = useState<RechargeRequest[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/client/recharge");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests);
      }
    })();
  }, []);

  const handleMakePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!amount || Number(amount) <= 0) return;

    if (Number(amount) < MIN_RECHARGE_AMOUNT) {
      setError(`Minimum recharge amount is ${MIN_RECHARGE_AMOUNT}tk`);
      return;
    }

    router.push(`/dashboard/purchase/verify?amount=${amount}`);
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Recharge Balance</h1>
          <p className="dashboard-subtitle">Add funds to your account via bKash.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
        <div style={{ background: "var(--card-bg, white)", padding: "2.5rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", maxWidth: "500px" }}>
          <form onSubmit={handleMakePayment}>
            <div className="form-group">
              <label className="form-label">Amount (৳)</label>
              <input
                type="number"
                min="1"
                step="0.01"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 500"
                required
              />
              <p style={{ marginTop: "0.4rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                Minimum recharge amount is {MIN_RECHARGE_AMOUNT}tk
              </p>
            </div>

            {error && (
              <div style={{ color: "#ef4444", fontSize: "0.9rem", marginBottom: "1rem", textAlign: "center", backgroundColor: "#fef2f2", padding: "0.5rem", borderRadius: "6px" }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              Make Payment
            </button>
          </form>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Your Requests</h2>
          </div>
          <div className="dashboard-table-container" style={{ marginTop: 0 }}>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 600 }}>৳ {r.amount.toFixed(2)}</td>
                    <td>{r.method}</td>
                    <td>
                      <span className={`badge ${r.status === 'APPROVED' ? 'badge-success' : r.status === 'PENDING' ? 'badge-warning' : 'badge-neutral'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{new Date(r.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>No recharge requests yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
