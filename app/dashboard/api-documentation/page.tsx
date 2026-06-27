"use client";

import { useState } from "react";
import { useClientUser } from "@/hooks/useClientUser";
import { FiCopy, FiCheck, FiServer, FiShield, FiAlertCircle, FiCode } from "react-icons/fi";

function CodeBlock({ children, language = "json" }: { children: string, language?: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div style={{ position: "relative", background: "#0f172a", color: "#f8fafc", padding: "1.5rem", borderRadius: "8px", marginTop: "1rem", marginBottom: "1rem", border: "1px solid #1e293b", overflowX: "auto" }}>
      <button 
        onClick={handleCopy} 
        style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "0.5rem", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
        title="Copy to clipboard"
      >
        {copied ? <FiCheck style={{ color: "#10b981" }} /> : <FiCopy />}
      </button>
      <div style={{ position: "absolute", top: "0", left: "0", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", padding: "0.2rem 0.5rem", borderBottomRightRadius: "6px", borderTopLeftRadius: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
        {language}
      </div>
      <pre style={{ margin: 0, fontSize: "0.9rem", fontFamily: "'Fira Code', 'Courier New', Courier, monospace", whiteSpace: "pre-wrap", paddingTop: "0.5rem" }}>
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function ApiDocumentationPage() {
  const { user, loading } = useClientUser();
  const baseUrl = typeof window !== "undefined" ? `${window.location.origin}/api` : "/api";

  const [copiedUrl, setCopiedUrl] = useState(false);
  
  if (loading || !user) return <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading documentation...</div>;

  const copyBaseUrl = () => {
    navigator.clipboard.writeText(baseUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">API Documentation</h1>
          <p className="dashboard-subtitle">Integrate Foxses Cloud SMS services into your application effortlessly.</p>
        </div>
      </div>

      <div style={{ maxWidth: "1000px" }}>
        {/* API Credentials Overview */}
        <section style={{ background: "var(--card-bg, white)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
            <FiShield style={{ color: "var(--accent)" }} /> Authentication
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: "1.6" }}>
            Authenticate your API requests by including your <strong style={{ color: "var(--text-primary)" }}>Client ID</strong> and <strong style={{ color: "var(--text-primary)" }}>API Key</strong> in the request body. 
            All API endpoints accept POST requests with a JSON body.
          </p>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Base URL</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <code style={{ background: "rgba(67, 56, 202, 0.1)", color: "var(--accent)", padding: "0.5rem 1rem", borderRadius: "6px", fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {baseUrl}
                </code>
                <button onClick={copyBaseUrl} style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "6px", padding: "0.5rem", cursor: "pointer", color: "var(--text-secondary)", display: "flex" }} title="Copy Base URL">
                  {copiedUrl ? <FiCheck style={{ color: "#10b981" }} /> : <FiCopy />}
                </button>
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Client ID</div>
              <code style={{ background: "rgba(0,0,0,0.05)", color: "var(--text-primary)", padding: "0.5rem 1rem", borderRadius: "6px", fontWeight: 600, display: "block", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.clientId}
              </code>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section style={{ background: "var(--card-bg, white)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
            <FiServer style={{ color: "var(--accent)" }} /> Endpoints
          </h2>
          
          <div style={{ marginBottom: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <span style={{ background: "#10b981", color: "white", padding: "0.25rem 0.75rem", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "1px" }}>POST</span>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>/send-message</h3>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "1rem" }}>
              Send a standard SMS message. The <code style={{ background: "rgba(0,0,0,0.05)", padding: "0.2rem 0.4rem", borderRadius: "4px" }}>recipient</code> field may contain multiple comma-separated numbers (e.g., 01XXXXXXXXX or 8801XXXXXXXXX).
            </p>
            <CodeBlock language="json">
{`{
  "client_id": "${user.clientId}",
  "key": "${user.apiKey}",
  "recipient": "01339889071,017XXXXXXXX",
  "message": "Hello, world!"
}`}
            </CodeBlock>
          </div>

          <div style={{ marginBottom: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <span style={{ background: "#10b981", color: "white", padding: "0.25rem 0.75rem", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "1px" }}>POST</span>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>/resend-message</h3>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "1rem" }}>
              Smart resend an SMS. This endpoint automatically routes the message through a fresh gateway, different from the recipient's last attempt. Single recipient only.
            </p>
            <CodeBlock language="json">
{`{
  "client_id": "${user.clientId}",
  "key": "${user.apiKey}",
  "recipient": "01339889071",
  "message": "Hello, World!"
}`}
            </CodeBlock>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <span style={{ background: "#10b981", color: "white", padding: "0.25rem 0.75rem", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "1px" }}>POST</span>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>/get-balance</h3>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "1rem" }}>
              Retrieve your current available balance.
            </p>
            <CodeBlock language="json">
{`{
  "client_id": "${user.clientId}"
}`}
            </CodeBlock>
          </div>
        </section>

        {/* Code Examples */}
        <section style={{ background: "var(--card-bg, white)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
            <FiCode style={{ color: "var(--accent)" }} /> Code Examples
          </h2>
          
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>cURL Example</h3>
            <CodeBlock language="bash">
{`curl -X POST ${baseUrl}/send-message \\
-H "Content-Type: application/json" \\
-d '{
  "client_id": "${user.clientId}",
  "key": "${user.apiKey}",
  "recipient": "01339889071",
  "message": "Hello, world!"
}'`}
            </CodeBlock>
          </div>

          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>PHP (cURL) Example</h3>
            <CodeBlock language="php">
{`<?php
$url = '${baseUrl}/send-message';
$data = array(
    'client_id' => '${user.clientId}',
    'key' => '${user.apiKey}',
    'recipient' => '01339889071',
    'message' => 'Hello, world!'
);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`}
            </CodeBlock>
          </div>
        </section>

        {/* Error Codes */}
        <section style={{ background: "var(--card-bg, white)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
            <FiAlertCircle style={{ color: "#ef4444" }} /> Error Codes
          </h2>
          
          <div className="dashboard-table-container" style={{ marginTop: 0, boxShadow: "none", border: "1px solid var(--border-color)" }}>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th style={{ width: "100px" }}>Code</th>
                  <th style={{ width: "200px" }}>Error</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["1001", "Invalid Recipient", "Invalid recipient number. Supported formats: 01XXXXXXXXX or 8801XXXXXXXXX."],
                  ["2001", "Client ID Not Found", "The provided Client ID was not found in the system."],
                  ["2002", "Account Inactive", "Your account is currently inactive. Please contact admin."],
                  ["2003", "Insufficient Balance", "Your account balance is too low to process this request."],
                  ["3002", "API Key Mismatch", "The provided API key is invalid or incorrect."],
                  ["4001", "No Active Gateway", "No active gateway is available to route the SMS at this moment."],
                ].map((row) => (
                  <tr key={row[0]}>
                    <td>
                      <span style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.85rem", fontWeight: 700, fontFamily: "monospace" }}>
                        {row[0]}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{row[1]}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
