"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FiHome, FiSend, FiCreditCard, FiPieChart, FiUser, FiBook, FiLifeBuoy, FiLogOut, FiMessageSquare, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useClientUser } from "@/hooks/useClientUser";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: <FiHome /> },
  { href: "/dashboard/send", label: "Send SMS", icon: <FiSend /> },
  { href: "/dashboard/purchase", label: "Purchase", icon: <FiCreditCard /> },
  { href: "/dashboard/reports", label: "Reports", icon: <FiPieChart /> },
];

const otherLinks = [
  { href: "/dashboard/profile", label: "User Profile", icon: <FiUser /> },
  { href: "/dashboard/api-documentation", label: "API Docs", icon: <FiBook /> },
  { href: "/dashboard/support", label: "Support", icon: <FiLifeBuoy /> },
];

export default function ClientSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useClientUser();
  const [othersOpen, setOthersOpen] = useState(true);

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-logo">
        <FiMessageSquare style={{ color: "var(--accent)" }} />
        <span>Foxses</span> Cloud
      </div>
      
      <nav style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div className="dashboard-nav-group">
          <div className="dashboard-nav-title">Menu</div>
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`dashboard-nav-link ${pathname === link.href ? "active" : ""}`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        <div className="dashboard-nav-group">
          <button 
            onClick={() => setOthersOpen((v) => !v)}
            style={{ 
              width: "100%", 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0 0.5rem"
            }}
          >
            <div className="dashboard-nav-title" style={{ margin: 0, padding: 0 }}>Others</div>
            <span style={{ color: "var(--text-secondary)" }}>{othersOpen ? <FiChevronUp /> : <FiChevronDown />}</span>
          </button>
          
          {othersOpen && (
            <div style={{ marginTop: "0.75rem" }}>
              {otherLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`dashboard-nav-link ${pathname === link.href ? "active" : ""}`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {user && (
          <div className="dashboard-user-card">
            <div className="dashboard-user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="dashboard-user-info">
              <div className="dashboard-user-name">{user.name}</div>
              <div className="dashboard-user-role">Client • ID: {user.clientId}</div>
            </div>
          </div>
        )}
        
        <button 
          onClick={signOut}
          className="dashboard-nav-link"
          style={{ width: "100%", background: "none", border: "none", cursor: "pointer", justifyContent: "center", color: "#ef4444", backgroundColor: "#fef2f2" }}
        >
          <FiLogOut />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
