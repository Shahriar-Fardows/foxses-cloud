"use client";

import { useEffect, useState } from "react";

type Pricing = {
  nonMaskingBuyPrice: number;
  nonMaskingSellPrice: number;
  maskingBuyPrice: number;
  maskingSellPrice: number;
};

export default function AdminPricingPage() {
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/pricing");
      const data = await res.json();
      setPricing(data.pricing);
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pricing) return;
    setSubmitting(true);
    setStatus(null);

    const res = await fetch("/api/admin/pricing", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pricing),
    });
    const data = await res.json();
    setStatus({ ok: res.ok, message: res.ok ? "Pricing updated" : data.message || "Update failed" });
    if (res.ok) setPricing(data.pricing);
    setSubmitting(false);
  }

  function setField(field: keyof Pricing, value: string) {
    if (!pricing) return;
    setPricing({ ...pricing, [field]: Number(value) });
  }

  if (!pricing) return <p>Loading...</p>;

  return (
    <div>
      <h1>SMS Pricing</h1>
      <p>
        Buy price = what you pay the upstream provider per SMS segment. Sell price = what clients are
        charged per SMS segment. English messages count 1 segment per 160 characters; Bangla/Unicode
        messages count 1 segment per 65 characters.
      </p>

      <form onSubmit={handleSubmit}>
        <h2>Non-Masking</h2>
        <div>
          <label>Buy Price (per segment)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={pricing.nonMaskingBuyPrice}
            onChange={(e) => setField("nonMaskingBuyPrice", e.target.value)}
          />
        </div>
        <div>
          <label>Sell Price (per segment)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={pricing.nonMaskingSellPrice}
            onChange={(e) => setField("nonMaskingSellPrice", e.target.value)}
          />
        </div>

        <h2>Masking</h2>
        <div>
          <label>Buy Price (per segment)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={pricing.maskingBuyPrice}
            onChange={(e) => setField("maskingBuyPrice", e.target.value)}
          />
        </div>
        <div>
          <label>Sell Price (per segment)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={pricing.maskingSellPrice}
            onChange={(e) => setField("maskingSellPrice", e.target.value)}
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Pricing"}
        </button>
        {status && <p>{status.message}</p>}
      </form>
    </div>
  );
}
