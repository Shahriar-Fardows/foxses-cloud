"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiCopy, FiCheckCircle } from "react-icons/fi";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount") || "0";
  
  const [trxId, setTrxId] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const paymentNumber = "01997722621";

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!trxId) return;
    
    setSubmitting(true);
    setStatus(null);

    const res = await fetch("/api/client/recharge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), method: "bKash", trxId }),
    });
    const data = await res.json();
    
    if (res.ok) {
      router.push("/dashboard/purchase");
    } else {
      setStatus({ ok: false, message: data.message });
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Verify Payment</h1>
          <p className="dashboard-subtitle">Complete your bKash transaction.</p>
        </div>
      </div>

      <div style={{ maxWidth: "700px", margin: "0 auto", width: "100%", background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", border: "1px solid #eaeaea" }}>
        {/* Header Tabs (Only bKash now) */}
        <div style={{ display: "flex", borderBottom: "1px solid #eee", background: "white" }}>
          <div style={{ flex: 1, padding: "1.25rem 1rem", textAlign: "center", fontWeight: 700, color: "#e2136e", borderBottom: "3px solid #e2136e" }}>
            bKash
          </div>
        </div>

        {/* Plan/Amount Info */}
        <div style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "white" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(226, 19, 110, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#e2136e" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "#333" }}>Recharge Balance</div>
              <div style={{ fontSize: "0.85rem", color: "#666" }}>Wallet Fund</div>
            </div>
          </div>
          <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "#e2136e" }}>
            ৳ {amount}
          </div>
        </div>

        {/* Instruction Body */}
        <div style={{ background: "#e2136e", color: "white", padding: "2rem 1.5rem" }}>
          <h3 style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "1.2rem", fontWeight: 700 }}>ট্রানজ্যাকশন আইডি দিন</h3>
          
          <form onSubmit={handleSubmit}>
            {status && !status.ok && (
              <div style={{ padding: "1rem", marginBottom: "1.5rem", borderRadius: "8px", backgroundColor: "white", color: "#e2136e", fontSize: "0.9rem", fontWeight: 700, textAlign: "center" }}>
                {status.message}
              </div>
            )}
            
            <input 
              type="text" 
              style={{ width: "100%", padding: "1rem", borderRadius: "6px", border: "1px solid #ccc", background: "white", marginBottom: "1.5rem", fontSize: "1rem", outline: "none", color: "#333", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }} 
              placeholder="ট্রানজ্যাকশন আইডি দিন" 
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              required
            />

            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "8px", overflow: "hidden" }}>
              <div style={{ padding: "1rem", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white", marginTop: "8px", flexShrink: 0 }}></div>
                <div style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>*247# ডায়াল করুন অথবা bKash অ্যাপে যান।</div>
              </div>
              <div style={{ padding: "1rem", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white", marginTop: "8px", flexShrink: 0 }}></div>
                <div style={{ fontSize: "0.95rem", lineHeight: "1.5" }}><strong style={{ color: "#ffd700" }}>"Send Money"</strong> -এ ক্লিক করুন।</div>
              </div>
              <div style={{ padding: "1rem", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white", marginTop: "8px", flexShrink: 0 }}></div>
                <div style={{ fontSize: "0.95rem", lineHeight: "1.5", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                  প্রাপক নম্বর হিসেবে এই নম্বরটি লিখুন: <strong>{paymentNumber}</strong>
                  <button type="button" onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "rgba(255,255,255,0.25)", border: "none", color: "white", padding: "0.3rem 0.6rem", borderRadius: "4px", fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s" }}>
                    {copied ? <FiCheckCircle /> : <FiCopy />} {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
              <div style={{ padding: "1rem", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white", marginTop: "8px", flexShrink: 0 }}></div>
                <div style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>টাকার পরিমাণ: <strong style={{ color: "#ffd700" }}>{amount}</strong></div>
              </div>
              <div style={{ padding: "1rem", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white", marginTop: "8px", flexShrink: 0 }}></div>
                <div style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>নিশ্চিত করতে এখন আপনার bKash মোবাইল মেন্যু পিন লিখুন।</div>
              </div>
              <div style={{ padding: "1rem", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white", marginTop: "8px", flexShrink: 0 }}></div>
                <div style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>সবকিছু ঠিক থাকলে, আপনি bKash থেকে একটি নিশ্চিতকরণ বার্তা পাবেন।</div>
              </div>
              <div style={{ padding: "1rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white", marginTop: "8px", flexShrink: 0 }}></div>
                <div style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>এখন উপরের বক্সে আপনার <strong>Transaction ID</strong> দিন এবং নিচের <strong style={{ color: "#ffd700" }}>VERIFY</strong> বাটনে ক্লিক করুন।</div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting} 
              style={{ width: "100%", background: "white", color: "#e2136e", fontWeight: 800, padding: "1rem", border: "none", borderRadius: "8px", marginTop: "1.5rem", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.8 : 1, letterSpacing: "1px", fontSize: "1rem" }}
            >
              {submitting ? "VERIFYING..." : "VERIFY"}
            </button>
          </form>
        </div>
        <div style={{ textAlign: "center", padding: "1.25rem", fontSize: "0.85rem", color: "#888", background: "#f9fafb", borderTop: "1px solid #eaeaea" }}>
          সাবমিট করার পর ADMIN যাচাই করবে • ১-৬ ঘণ্টার মধ্যে সক্রিয় হবে
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Loading verification...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
