"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";

const NAV = [
  { href: "/",               label: "Home",       icon: "🏠" },
  { href: "/menu",           label: "Menu",       icon: "🍕" },
  { href: "/menu-board",     label: "Menu Board", icon: "📋" },
  { href: "/about",          label: "About",      icon: "ℹ️"  },
  { href: "/kitchen",        label: "Kitchen",    icon: "👨‍🍳" },
  { href: "/menu?cat=deals", label: "Deals",      icon: "🔥", hot: true },
];

export default function Header() {
  const { totalItems, dispatch } = useCart();
  const { theme, toggle }        = useTheme();
  const pathname                  = usePathname();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);

  const dark = theme === "dark";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // close mobile nav on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]);
  };

  const headerBg = scrolled
    ? dark ? "rgba(6,6,6,0.94)" : "rgba(255,255,255,0.94)"
    : dark ? "#080808"           : "#ffffff";

  return (
    <>
      <header
        style={{
          position: "sticky", top: 0, zIndex: 50,
          backgroundColor: headerBg,
          backdropFilter: scrolled ? "blur(24px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: `1px solid ${
            scrolled
              ? dark ? "rgba(228,0,43,0.2)" : "rgba(228,0,43,0.15)"
              : dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)"
          }`,
          boxShadow: scrolled
            ? dark
              ? "0 4px 30px rgba(0,0,0,0.6), 0 1px 0 rgba(228,0,43,0.06)"
              : "0 4px 30px rgba(0,0,0,0.08)"
            : "none",
          transition: "background-color 0.3s, box-shadow 0.3s, border-color 0.3s",
        }}
      >
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

            {/* ── Logo ── */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                position: "relative", overflow: "hidden",
                boxShadow: "0 4px 20px rgba(228,0,43,0.35), 0 0 0 2px rgba(228,0,43,0.25)",
              }}>
                <Image
                  src="/shahelasani.png"
                  alt="Shah-e-Lasani Cafe"
                  fill
                  sizes="46px"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
              <div style={{ lineHeight: 1.1 }}>
                <div style={{
                  fontFamily: "var(--font-oswald)", fontWeight: 800,
                  color: dark ? "#fff" : "#0d0d0d",
                  textTransform: "uppercase", letterSpacing: "0.07em",
                  fontSize: "1rem",
                  transition: "color 0.3s",
                }}>
                  Shah-e-Lasani
                </div>
                <div style={{
                  color: "#F5A623", fontSize: "0.58rem",
                  letterSpacing: "0.32em", textTransform: "uppercase",
                  fontWeight: 700, marginTop: 1,
                }}>
                  Cafe · Est. 2025
                </div>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav style={{ display: "flex", alignItems: "center", gap: 2 }} className="sl-nav-desktop">
              {NAV.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      position: "relative",
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "7px 14px", borderRadius: 10,
                      fontSize: "0.83rem", fontWeight: active ? 600 : 500,
                      color: active
                        ? "#E4002B"
                        : dark ? "#888" : "#666",
                      textDecoration: "none", letterSpacing: "0.01em",
                      background: active
                        ? dark ? "rgba(228,0,43,0.09)" : "rgba(228,0,43,0.07)"
                        : "transparent",
                      transition: "color 0.2s, background 0.2s",
                      ...(link.hot && !active ? {
                        color: "#F5A623",
                      } : {}),
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLAnchorElement).style.color = dark ? "#fff" : "#111";
                        (e.currentTarget as HTMLAnchorElement).style.background = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLAnchorElement).style.color = link.hot
                          ? "#F5A623"
                          : dark ? "#888" : "#666";
                        (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                      }
                    }}
                  >
                    {link.hot && (
                      <span style={{ fontSize: "0.8rem" }}>🔥</span>
                    )}
                    {link.label}
                    {/* Active dot indicator */}
                    {active && (
                      <span style={{
                        position: "absolute", bottom: 2, left: "50%",
                        transform: "translateX(-50%)",
                        width: 4, height: 4, borderRadius: "50%",
                        background: "#E4002B",
                      }} />
                    )}
                    {/* Deals badge */}
                    {link.hot && (
                      <span style={{
                        position: "absolute", top: 3, right: 3,
                        width: 6, height: 6, borderRadius: "50%",
                        background: "#E4002B",
                        animation: "pulseDot 1.8s ease-in-out infinite",
                      }} />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ── Right controls ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

              {/* Theme toggle */}
              <button
                onClick={toggle}
                title={dark ? "Light mode" : "Dark mode"}
                style={{
                  width: 36, height: 36, borderRadius: 10, border: "none",
                  background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
                  color: dark ? "#bbb" : "#555",
                  fontSize: "0.95rem", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = dark ? "rgba(255,255,255,0.13)" : "rgba(0,0,0,0.11)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "rotate(15deg) scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "rotate(0deg) scale(1)";
                }}
              >
                {dark ? "☀️" : "🌙"}
              </button>

              {/* WhatsApp shortcut */}
              <a
                href="https://wa.me/923254695624"
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                className="sl-nav-desktop"
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: dark ? "rgba(37,211,102,0.1)" : "rgba(37,211,102,0.1)",
                  border: "1px solid rgba(37,211,102,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem", textDecoration: "none",
                  transition: "background 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(37,211,102,0.2)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(37,211,102,0.1)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
                }}
              >
                📱
              </a>

              {/* Cart */}
              <button
                onClick={() => dispatch({ type: "OPEN_CART" })}
                style={{
                  position: "relative", display: "flex", alignItems: "center", gap: 8,
                  background: "#E4002B", color: "#fff",
                  border: "none", cursor: "pointer",
                  padding: "9px 18px", borderRadius: 999,
                  fontFamily: "var(--font-open-sans)", fontWeight: 700, fontSize: "0.83rem",
                  boxShadow: "0 4px 18px rgba(228,0,43,0.38)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(228,0,43,0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 18px rgba(228,0,43,0.38)";
                }}
              >
                <span style={{ fontSize: "1rem" }}>🛒</span>
                <span className="sl-cart-label">Cart</span>
                {totalItems > 0 && (
                  <span style={{
                    position: "absolute", top: -6, right: -6,
                    background: "#F5A623", color: "#000",
                    fontSize: "0.62rem", fontWeight: 900,
                    borderRadius: "50%", width: 20, height: 20,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}>
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="sl-hamburger"
                style={{
                  padding: "8px 10px", borderRadius: 10, border: "none",
                  background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
                  color: dark ? "#fff" : "#0d0d0d",
                  cursor: "pointer", fontSize: "1.1rem",
                  display: "none",
                  transition: "background 0.2s",
                }}
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {/* ── Mobile Drawer ── */}
          {menuOpen && (
            <nav
              style={{
                padding: "8px 0 16px",
                borderTop: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
                animation: "slideDown 0.2s ease both",
              }}
            >
              {NAV.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "13px 14px", borderRadius: 12, margin: "2px 0",
                      fontSize: "0.9rem", fontWeight: active ? 600 : 500,
                      color: active ? "#E4002B" : dark ? "#bbb" : "#555",
                      background: active
                        ? dark ? "rgba(228,0,43,0.1)" : "rgba(228,0,43,0.07)"
                        : "transparent",
                      textDecoration: "none",
                      borderLeft: active ? "3px solid #E4002B" : "3px solid transparent",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLAnchorElement).style.background = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
                        (e.currentTarget as HTMLAnchorElement).style.color = dark ? "#fff" : "#111";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                        (e.currentTarget as HTMLAnchorElement).style.color = dark ? "#bbb" : "#555";
                      }
                    }}
                  >
                    <span style={{ fontSize: "1.1rem", width: 24, textAlign: "center" }}>{link.icon}</span>
                    <span>{link.label}</span>
                    {link.hot && (
                      <span style={{
                        marginLeft: "auto", fontSize: "0.65rem",
                        background: "#E4002B", color: "#fff",
                        padding: "2px 8px", borderRadius: 999, fontWeight: 700,
                      }}>
                        HOT
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Mobile WhatsApp */}
              <a
                href="https://wa.me/923254695624"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "13px 14px", borderRadius: 12, marginTop: 8,
                  fontSize: "0.9rem", fontWeight: 500,
                  color: "#25D366",
                  background: "rgba(37,211,102,0.08)",
                  border: "1px solid rgba(37,211,102,0.15)",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontSize: "1.1rem", width: 24, textAlign: "center" }}>📱</span>
                <span>Order on WhatsApp</span>
              </a>
            </nav>
          )}
        </div>
      </header>

      <style>{`
        .sl-nav-desktop { display: flex !important; }
        .sl-hamburger   { display: none !important; }
        .sl-cart-label  { display: inline; }
        @media (max-width: 900px) {
          .sl-nav-desktop { display: none !important; }
          .sl-hamburger   { display: flex !important; }
        }
        @media (max-width: 480px) {
          .sl-cart-label { display: none; }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.6); }
        }
      `}</style>
    </>
  );
}
