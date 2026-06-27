import { FiCloud } from "react-icons/fi";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="navbar">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 2rem" }}>
          <div className="logo">
            <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiCloud className="logo-icon" /> Foxses Cloude
            </a>
          </div>
          <div className="nav-links">
            <a href="/" className="nav-link">Home</a>
            <a href="/#features" className="nav-link">Features</a>
            <a href="/#pricing" className="nav-link">Pricing</a>
            <a href="/#api" className="nav-link">API</a>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <a href="/login" className="nav-link" style={{ fontWeight: 700 }}>Login</a>
            <a href="/register" className="btn btn-primary" style={{ padding: "0.6rem 1.25rem", fontSize: "0.9rem" }}>Sign Up</a>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}
