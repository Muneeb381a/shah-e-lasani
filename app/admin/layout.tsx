"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

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

  const navLink = (href: string, label: string) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        style={{
          display: "block",
          padding: "10px 16px",
          borderRadius: 8,
          fontWeight: 500,
          fontSize: 14,
          textDecoration: "none",
          background: active ? "#E4002B" : "transparent",
          color: active ? "#fff" : "#aaa",
          transition: "background .15s, color .15s",
        }}
      >
        {label}
      </Link>
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: "#111",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 12px",
        gap: 4,
        flexShrink: 0,
      }}>
        <div style={{ padding: "0 4px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 8 }}>
          <div style={{ fontSize: 13, color: "#E4002B", fontWeight: 700, letterSpacing: 1 }}>ADMIN</div>
          <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>Shah-e-Lasani Cafe</div>
        </div>
        {navLink("/admin", "Dashboard")}
        {navLink("/admin/products", "Products")}
        {navLink("/admin/products/new", "+ Add Product")}
        <div style={{ flex: 1 }} />
        <button
          onClick={logout}
          disabled={logging}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "1px solid rgba(228,0,43,0.4)",
            background: "transparent",
            color: "#E4002B",
            fontWeight: 500,
            fontSize: 14,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          {logging ? "Logging out…" : "Logout"}
        </button>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
