import AdminSidebar from "@/components/AdminSidebar";
import { FiMenu, FiMoon, FiShield } from "react-icons/fi";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ height: "70px", background: "white", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", position: "sticky", top: 0, zIndex: 10 }}>
          <button style={{ background: "none", border: "1px solid var(--border-color)", borderRadius: "8px", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-secondary)" }}>
            <FiMenu style={{ fontSize: "1.25rem" }} />
          </button>
          
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px" }}>
              <FiMoon />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", background: "rgba(67, 56, 202, 0.05)", padding: "0.4rem 1rem", borderRadius: "20px", border: "1px solid rgba(67, 56, 202, 0.1)" }}>
              <FiShield style={{ color: "var(--accent)" }} />
              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--accent)" }}>Super Admin</span>
            </div>
          </div>
        </header>
        <main className="dashboard-main" style={{ width: "100%" }}>{children}</main>
      </div>
    </div>
  );
}
