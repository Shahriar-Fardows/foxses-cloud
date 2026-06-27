"use client";

import { useEffect, useState } from "react";

type Row = {
  messageType: string;
  totalSms: number;
  totalSegments: number;
  revenue: number;
  cost: number;
  profit: number;
};

type Totals = {
  totalSms: number;
  totalSegments: number;
  revenue: number;
  cost: number;
  profit: number;
};

export default function ProfitReportPage() {
  const [breakdown, setBreakdown] = useState<Row[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/profit-report");
      const data = await res.json();
      setBreakdown(data.breakdown || []);
      setTotals(data.totals || null);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <h1>Profit Report</h1>
      <p>How much you bought SMS for vs. sold SMS for, broken down by Masking / Non-Masking.</p>

      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>SMS Sent</th>
            <th>Segments</th>
            <th>Revenue (Sold)</th>
            <th>Cost (Bought)</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody>
          {breakdown.map((row) => (
            <tr key={row.messageType}>
              <td>{row.messageType}</td>
              <td>{row.totalSms}</td>
              <td>{row.totalSegments}</td>
              <td>{row.revenue.toFixed(2)}</td>
              <td>{row.cost.toFixed(2)}</td>
              <td>{row.profit.toFixed(2)}</td>
            </tr>
          ))}
          {!loading && breakdown.length === 0 && (
            <tr>
              <td colSpan={6}>No SMS sent yet.</td>
            </tr>
          )}
          {totals && (
            <tr>
              <td>
                <strong>Total</strong>
              </td>
              <td>
                <strong>{totals.totalSms}</strong>
              </td>
              <td>
                <strong>{totals.totalSegments}</strong>
              </td>
              <td>
                <strong>{totals.revenue.toFixed(2)}</strong>
              </td>
              <td>
                <strong>{totals.cost.toFixed(2)}</strong>
              </td>
              <td>
                <strong>{totals.profit.toFixed(2)}</strong>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
