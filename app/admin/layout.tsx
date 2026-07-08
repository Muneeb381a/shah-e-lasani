"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>
      </svg>
    ),
  },
  {
    href: "/admin/products/new",
    label: "Add Product",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [logging, setLogging] = useState(false);

  if (pathname === "/admin/login") return <>{children}</>;

  async function logout() {
    setLogging(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div suppressHydrationWarning style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 236,
        background: "#0d0d0d",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>
        {/* Branding */}
        <div style={{
          padding: "20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: "#fff",
            position: "relative", flexShrink: 0, overflow: "hidden",
            boxShadow: "0 0 0 1px rgba(228,0,43,0.3)",
          }}>
            <Image src="/shahelasani.png" alt="logo" fill sizes="40px" priority style={{ objectFit: "contain", padding: "4px" }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#E4002B", letterSpacing: "0.04em" }}>
              Shah-e-Lasani
            </div>
            <div style={{ fontSize: 10, color: "#444", marginTop: 1, letterSpacing: "0.08em" }}>
              ADMIN PANEL
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          <div style={{ fontSize: 10, color: "#333", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", padding: "6px 8px 10px" }}>
            Navigation
          </div>
          {NAV.map((item) => {
            const exact = item.href === "/admin";
            const active = exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px", borderRadius: 8,
                  fontWeight: 500, fontSize: 13,
                  textDecoration: "none",
                  background: active ? "rgba(228,0,43,0.14)" : "transparent",
                  color: active ? "#E4002B" : "#666",
                  border: active ? "1px solid rgba(228,0,43,0.2)" : "1px solid transparent",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "#bbb";
                  if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "#666";
                  if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                }}
              >
                <span style={{ opacity: active ? 1 : 0.5 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button
            onClick={logout}
            disabled={logging}
            style={{
              width: "100%", padding: "9px 12px",
              borderRadius: 8,
              border: "1px solid rgba(228,0,43,0.25)",
              background: "rgba(228,0,43,0.06)",
              color: "#E4002B", fontWeight: 600,
              fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(228,0,43,0.12)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(228,0,43,0.06)"; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {logging ? "Logging out…" : "Logout"}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto", minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
