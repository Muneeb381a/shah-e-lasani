"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";

const NAV = [
  { href: "/",               label: "Home"       },
  { href: "/menu",           label: "Menu"       },
  { href: "/menu-board",     label: "Menu Board" },
  { href: "/kitchen",        label: "Kitchen"    },
  { href: "/menu?cat=deals", label: "Deals", hot: true },
  { href: "/about",          label: "About"      },
];

const WA = "https://wa.me/923254695624";

function HeaderContent() {
  const { totalItems, dispatch } = useCart();
  const { theme, toggle }        = useTheme();
  const pathname                  = usePathname();
  const searchParams              = useSearchParams();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);

  const dark = theme === "dark";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    const [hrefPath, hrefQuery] = href.split("?");
    if (pathname !== hrefPath) return false;
    if (hrefQuery) {
      const params = new URLSearchParams(hrefQuery);
      for (const [key, val] of params.entries()) {
        if (searchParams.get(key) !== val) return false;
      }
      return true;
    }
    // No query in href — only active when no other NAV item with query matches current URL
    return !NAV.some((n) => {
      const [nPath, nQuery] = n.href.split("?");
      if (!nQuery || nPath !== pathname) return false;
      const nParams = new URLSearchParams(nQuery);
      for (const [k, v] of nParams.entries()) {
        if (searchParams.get(k) !== v) return false;
      }
      return true;
    });
  };

  /* ── colours ── */
  const bg     = scrolled
    ? dark ? "rgba(8,8,8,0.92)"  : "rgba(255,255,255,0.92)"
    : dark ? "#080808"            : "#ffffff";
  const border = scrolled
    ? dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"
    : dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)";

  return (
    <>
      {/* ── Announcement bar ── */}
      <div style={{
        background: "linear-gradient(90deg, #E4002B 0%, #c0001f 50%, #E4002B 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmerBg 4s linear infinite",
        textAlign: "center", padding: "8px 16px",
        fontSize: "0.72rem", fontWeight: 600,
        color: "#fff", letterSpacing: "0.06em",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 20,
      }}>
        <span>Fast delivery across Sialkot</span>
        <span style={{ opacity: 0.5 }}>|</span>
        <span>0325-4695624</span>
        <span style={{ opacity: 0.5 }}>|</span>
        <span>Open Daily 12pm – 12am</span>
      </div>

      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        backgroundColor: bg,
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: `1px solid ${border}`,
        boxShadow: scrolled
          ? dark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 4px 24px rgba(0,0,0,0.07)"
          : "none",
        transition: "background-color 0.3s ease, box-shadow 0.4s ease, border-color 0.3s ease",
      }}>

        {/* thin accent line on scroll */}
        {scrolled && (
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg, transparent, #E4002B 30%, #F5A623 70%, transparent)",
          }} />
        )}

        <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ display: "flex", alignItems: "center", height: 66, gap: 0 }}>

            {/* ── Logo ── */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", flexShrink: 0, marginRight: 40 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                position: "relative", overflow: "hidden",
                background: "#fff",
                boxShadow: dark
                  ? "0 0 0 1.5px rgba(228,0,43,0.5), 0 4px 16px rgba(228,0,43,0.25)"
                  : "0 0 0 1.5px rgba(228,0,43,0.35), 0 4px 16px rgba(228,0,43,0.15)",
              }}>
                <Image src="/shahelasani.png" alt="Shah-e-Lasani" fill sizes="44px" style={{ objectFit: "contain", padding: "3px" }} priority />
              </div>
              <div style={{ display: "inline-block" }}>
                <div style={{
                  fontFamily: "var(--font-oswald)", fontWeight: 800,
                  fontSize: "1.05rem", letterSpacing: "0.06em",
                  textTransform: "uppercase", lineHeight: 1,
                  color: "#E4002B",
                }}>
                  Shah-e-Lasani
                </div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 5, marginTop: 3 }}>
                  <span style={{
                    fontFamily: "var(--font-oswald)", fontWeight: 700,
                    fontSize: "0.6rem", letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: dark ? "#fff" : "#111",
                  }}>Cafe</span>
                  <span style={{ color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)", fontSize: "0.5rem" }}>·</span>
                  <span style={{
                    fontFamily: "var(--font-oswald)", fontWeight: 600,
                    fontSize: "0.57rem", letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: dark ? "#fff" : "#111",
                    opacity: 0.6,
                  }}>Est. 2025</span>
                </div>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="sl-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 0, flex: 1 }}>
              {NAV.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="sl-nav-link"
                    data-active={active ? "true" : "false"}
                    data-hot={link.hot ? "true" : "false"}
                    style={{
                      position: "relative",
                      padding: "8px 16px",
                      fontSize: "0.84rem",
                      fontWeight: active ? 600 : 500,
                      letterSpacing: "0.02em",
                      color: active
                        ? "#E4002B"
                        : link.hot
                          ? dark ? "#F5A623" : "#d97706"
                          : dark ? "#999" : "#5a5a5a",
                      textDecoration: "none",
                      display: "inline-flex", alignItems: "center", gap: 6,
                      transition: "color 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) (e.currentTarget as HTMLAnchorElement).style.color = dark ? "#fff" : "#0d0d0d";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) (e.currentTarget as HTMLAnchorElement).style.color =
                        link.hot ? (dark ? "#F5A623" : "#d97706") : (dark ? "#999" : "#5a5a5a");
                    }}
                  >
                    {link.hot && (
                      <span style={{
                        background: "#E4002B", color: "#fff",
                        fontSize: "0.55rem", fontWeight: 800,
                        padding: "2px 6px", borderRadius: 4,
                        letterSpacing: "0.1em",
                      }}>HOT</span>
                    )}
                    {link.label}

                    {/* Animated underline */}
                    <span style={{
                      position: "absolute", bottom: 0, left: "50%",
                      transform: "translateX(-50%)",
                      width: active ? "60%" : "0%",
                      height: 2, borderRadius: 2,
                      background: active ? "#E4002B" : "transparent",
                      transition: "width 0.25s ease",
                    }} />
                  </Link>
                );
              })}
            </nav>

            {/* ── Right controls ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto", flexShrink: 0 }}>

              {/* Divider */}
              <div className="sl-desktop-nav" style={{
                width: 1, height: 24, marginRight: 4,
                background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              }} />

              {/* Theme toggle */}
              <button
                onClick={toggle}
                title={dark ? "Light mode" : "Dark mode"}
                style={{
                  width: 36, height: 36, borderRadius: 10, border: "none",
                  background: "transparent",
                  color: dark ? "#888" : "#777",
                  fontSize: "1rem", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
                  (e.currentTarget as HTMLButtonElement).style.color = dark ? "#fff" : "#000";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = dark ? "#888" : "#777";
                }}
              >
                {dark ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>

              {/* WhatsApp — desktop only */}
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="sl-desktop-nav sl-wa-btn"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "8px 16px", borderRadius: 10,
                  background: "rgba(37,211,102,0.1)",
                  border: "1px solid rgba(37,211,102,0.25)",
                  color: "#18a850", fontSize: "0.82rem", fontWeight: 600,
                  textDecoration: "none", letterSpacing: "0.02em",
                  transition: "background 0.2s, border-color 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(37,211,102,0.18)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(37,211,102,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(37,211,102,0.1)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(37,211,102,0.25)";
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>

              {/* Cart */}
              <button
                onClick={() => dispatch({ type: "OPEN_CART" })}
                style={{
                  position: "relative",
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#E4002B", color: "#fff", border: "none",
                  padding: "9px 20px", borderRadius: 10, cursor: "pointer",
                  fontFamily: "var(--font-open-sans)", fontWeight: 700,
                  fontSize: "0.84rem", letterSpacing: "0.02em",
                  boxShadow: "0 4px 16px rgba(228,0,43,0.35)",
                  transition: "background 0.2s, box-shadow 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#c8001f";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 22px rgba(228,0,43,0.5)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#E4002B";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(228,0,43,0.35)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                }}
              >
                {/* cart icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <span className="sl-cart-label">Cart</span>
                {totalItems > 0 && (
                  <span style={{
                    position: "absolute", top: -7, right: -7,
                    background: "#F5A623", color: "#000",
                    fontSize: "0.6rem", fontWeight: 900,
                    borderRadius: "50%", width: 19, height: 19,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: dark ? "2px solid #080808" : "2px solid #fff",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                  }}>
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="sl-hamburger"
                aria-label="Toggle menu"
                style={{
                  width: 38, height: 38, borderRadius: 10, border: "none",
                  background: menuOpen
                    ? dark ? "rgba(228,0,43,0.15)" : "rgba(228,0,43,0.1)"
                    : dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
                  color: menuOpen ? "#E4002B" : dark ? "#bbb" : "#444",
                  cursor: "pointer", display: "none",
                  alignItems: "center", justifyContent: "center",
                  flexDirection: "column", gap: 5,
                  transition: "background 0.2s",
                  padding: 10,
                }}
              >
                <span style={{
                  display: "block", width: "100%", height: 2, borderRadius: 2,
                  background: "currentColor",
                  transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
                  transition: "transform 0.25s ease",
                }} />
                <span style={{
                  display: "block", width: "70%", height: 2, borderRadius: 2,
                  background: "currentColor",
                  opacity: menuOpen ? 0 : 1,
                  transition: "opacity 0.2s ease",
                }} />
                <span style={{
                  display: "block", width: "100%", height: 2, borderRadius: 2,
                  background: "currentColor",
                  transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
                  transition: "transform 0.25s ease",
                }} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Overlay ── */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 40,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            animation: "fadeIn 0.2s ease",
          }}
        />
      )}

      {/* ── Mobile Drawer ── */}
      <div
        className="sl-mobile-drawer"
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "min(320px, 88vw)",
          zIndex: 60,
          background: dark ? "#0d0d0d" : "#fff",
          borderLeft: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
          boxShadow: "-8px 0 40px rgba(0,0,0,0.2)",
          display: "flex", flexDirection: "column",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
        }}
      >
        {/* Drawer header */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, overflow: "hidden", position: "relative", flexShrink: 0, background: "#fff", boxShadow: "0 0 0 1.5px rgba(228,0,43,0.4)" }}>
              <Image src="/shahelasani.png" alt="Logo" fill sizes="36px" style={{ objectFit: "contain", padding: "2px" }} />
            </div>
            <div style={{ display: "inline-block" }}>
              <div style={{ fontFamily: "var(--font-oswald)", fontWeight: 800, fontSize: "0.95rem", color: "#E4002B", textTransform: "uppercase", letterSpacing: "0.06em", lineHeight: 1 }}>
                Shah-e-Lasani
              </div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginTop: 3 }}>
                <span style={{ fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.57rem", color: dark ? "#fff" : "#111", letterSpacing: "0.28em", textTransform: "uppercase" }}>Cafe</span>
                <span style={{ color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)", fontSize: "0.48rem" }}>·</span>
                <span style={{ fontFamily: "var(--font-oswald)", fontWeight: 600, fontSize: "0.55rem", color: dark ? "#fff" : "#111", opacity: 0.6, letterSpacing: "0.18em", textTransform: "uppercase" }}>Est. 2025</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              width: 32, height: 32, borderRadius: 8, border: "none",
              background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
              color: dark ? "#aaa" : "#666", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem",
            }}
          >✕</button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "12px 12px 0" }}>
          {NAV.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "13px 16px", borderRadius: 12, marginBottom: 4,
                  fontSize: "0.92rem", fontWeight: active ? 700 : 500,
                  color: active ? "#E4002B" : dark ? "#ccc" : "#333",
                  background: active
                    ? dark ? "rgba(228,0,43,0.1)" : "rgba(228,0,43,0.06)"
                    : "transparent",
                  textDecoration: "none",
                  border: `1px solid ${active ? "rgba(228,0,43,0.2)" : "transparent"}`,
                  transition: "all 0.2s",
                }}
              >
                <span>{link.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {link.hot && (
                    <span style={{
                      fontSize: "0.58rem", fontWeight: 800,
                      background: "#E4002B", color: "#fff",
                      padding: "2px 7px", borderRadius: 4, letterSpacing: "0.1em",
                    }}>HOT</span>
                  )}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? "#E4002B" : dark ? "#555" : "#bbb"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Drawer footer */}
        <div style={{ padding: "16px 12px 24px", borderTop: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` }}>
          {/* WhatsApp */}
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "13px 16px", borderRadius: 12,
              background: "rgba(37,211,102,0.1)",
              border: "1px solid rgba(37,211,102,0.2)",
              color: "#18a850", fontWeight: 600, fontSize: "0.88rem",
              textDecoration: "none", marginBottom: 10,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Order on WhatsApp
          </a>

          {/* Theme toggle */}
          <button
            onClick={() => { toggle(); setMenuOpen(false); }}
            style={{
              width: "100%", padding: "11px 16px", borderRadius: 12,
              background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
              border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
              color: dark ? "#bbb" : "#555", cursor: "pointer",
              fontSize: "0.85rem", fontWeight: 500,
              display: "flex", alignItems: "center", gap: 10,
            }}
          >
            <span style={{ display: "flex" }}>
              {dark ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </span>
            <span>Switch to {dark ? "Light" : "Dark"} Mode</span>
          </button>
        </div>
      </div>

      <style>{`
        .sl-desktop-nav { display: flex !important; }
        .sl-hamburger   { display: none !important; }
        .sl-cart-label  { display: inline; }
        .sl-mobile-drawer { display: flex; }

        .sl-nav-link:hover > span:last-child {
          width: 60% !important;
          background: #E4002B !important;
        }

        @media (max-width: 960px) {
          .sl-desktop-nav { display: none !important; }
          .sl-hamburger   { display: flex !important; }
          .sl-wa-btn      { display: none !important; }
        }
        @media (max-width: 480px) {
          .sl-cart-label { display: none; }
        }

        @keyframes shimmerBg {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.6); }
        }
      `}</style>
    </>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<div style={{ height: 32, background: "#E4002B" }} />}>
      <HeaderContent />
    </Suspense>
  );
}
