import ClientSidebar from "@/components/ClientSidebar";
import { FiMenu, FiMoon, FiUser } from "react-icons/fi";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-layout">
      <ClientSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ height: "70px", background: "white", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", position: "sticky", top: 0, zIndex: 10 }}>
          <button style={{ background: "none", border: "1px solid var(--border-color)", borderRadius: "8px", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-secondary)" }}>
            <FiMenu style={{ fontSize: "1.25rem" }} />
          </button>
          
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px" }}>
              <FiMoon />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#ef4444", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>
                S
              </div>
              <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text-primary)" }}>Shahriar Fardows</span>
            </div>
          </div>
        </header>
        <main className="dashboard-main" style={{ width: "100%" }}>{children}</main>
      </div>
    </div>
  );
}
