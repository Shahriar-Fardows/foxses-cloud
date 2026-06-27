"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiHome, FiUsers, FiDollarSign, FiMessageSquare, FiSettings, FiLogOut } from "react-icons/fi";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: FiHome },
  { href: "/admin/clients", label: "Clients", icon: FiUsers },
  { href: "/admin/recharge-requests", label: "Recharge Requests", icon: FiDollarSign },
  { href: "/admin/sms-logs", label: "SMS Logs", icon: FiMessageSquare },
  { href: "/admin/staff", label: "Staff", icon: FiSettings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-logo">
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.2rem" }}>
          A
        </div>
        <span>Admin Panel</span>
      </div>
      
      <div className="dashboard-nav-group" style={{ flex: 1 }}>
        <div className="dashboard-nav-title">Menu</div>
        <nav>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link key={link.href} href={link.href} className={`dashboard-nav-link ${isActive ? "active" : ""}`}>
                <Icon />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="dashboard-user-card" style={{ padding: "0" }}>
        <button onClick={signOut} className="dashboard-nav-link" style={{ width: "100%", background: "none", border: "none", cursor: "pointer", color: "#ef4444", marginBottom: 0 }}>
          <FiLogOut />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
