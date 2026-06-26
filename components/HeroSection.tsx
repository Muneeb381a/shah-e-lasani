"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";

const QUICK_STATS = [
  { value: "500+",  label: "Orders"   },
  { value: "4.9★",  label: "Rating"   },
  { value: "30min", label: "Delivery" },
  { value: "50+",   label: "Items"    },
];

export default function HeroSection() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <section style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      background: dark
        ? "radial-gradient(ellipse 100% 75% at 50% 110%, rgba(228,0,43,0.22) 0%, rgba(228,0,43,0.04) 55%, transparent 70%), #080808"
        : "radial-gradient(ellipse 100% 75% at 50% 110%, rgba(228,0,43,0.12) 0%, rgba(228,0,43,0.02) 55%, transparent 70%), #f2f2f2",
      transition: "background 0.4s ease",
    }}>

      {/* Subtle grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: dark
          ? "linear-gradient(rgba(228,0,43,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(228,0,43,0.055) 1px, transparent 1px)"
          : "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />

      {/* Red glow blobs */}
      <div style={{
        position: "absolute", top: -80, left: -80,
        width: 420, height: 420, borderRadius: "50%", pointerEvents: "none",
        background: dark
          ? "radial-gradient(circle, rgba(228,0,43,0.13) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(228,0,43,0.08) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />
      <div style={{
        position: "absolute", bottom: -60, right: -60,
        width: 320, height: 320, borderRadius: "50%", pointerEvents: "none",
        background: dark
          ? "radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)",
        filter: "blur(50px)",
      }} />

      {/* Background huge text */}
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        alignItems: "center", justifyContent: "center",
        pointerEvents: "none", overflow: "hidden",
      }}>
        <span style={{
          fontFamily: "var(--font-oswald)", fontWeight: 900,
          fontSize: "clamp(180px, 28vw, 340px)",
          color: dark ? "rgba(228,0,43,0.035)" : "rgba(228,0,43,0.055)",
          lineHeight: 1, textTransform: "uppercase",
          letterSpacing: "-0.02em", userSelect: "none", whiteSpace: "nowrap",
        }}>
          CAFE
        </span>
      </div>

      {/* Floating food emojis */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <span className="animate-float"  style={{ position: "absolute", top: "14%", left: "4%",   fontSize: 64, opacity: dark ? 0.13 : 0.18, filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.4))" }}>🍕</span>
        <span className="animate-float2" style={{ position: "absolute", top: "10%", right: "5%",  fontSize: 54, opacity: dark ? 0.13 : 0.18, filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.4))" }}>🍔</span>
        <span className="animate-float3" style={{ position: "absolute", bottom:"22%", left: "6%", fontSize: 46, opacity: dark ? 0.13 : 0.18, filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.4))" }}>🥤</span>
        <span className="animate-float4" style={{ position: "absolute", bottom:"16%", right:"7%", fontSize: 52, opacity: dark ? 0.13 : 0.18, filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.4))" }}>🍟</span>
        <span className="animate-float"  style={{ position: "absolute", top: "50%", left: "1%",   fontSize: 30, opacity: 0.07 }}>✨</span>
        <span className="animate-float2" style={{ position: "absolute", top: "40%", right: "2%",  fontSize: 28, opacity: 0.07 }}>⭐</span>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <div style={{
        position: "relative", zIndex: 10,
        textAlign: "center",
        padding: "7rem 1.5rem 4rem",
        maxWidth: "920px", margin: "0 auto", width: "100%",
      }}>
        {/* Status pill */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: dark ? "rgba(228,0,43,0.1)" : "rgba(228,0,43,0.07)",
          border: "1px solid rgba(228,0,43,0.3)",
          borderRadius: 999, padding: "9px 22px", marginBottom: 32,
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#E4002B", display: "inline-block",
            animation: "glowRed 2s ease-in-out infinite",
          }} />
          <span style={{
            color: dark ? "#ff7a8a" : "#c9001f",
            fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase",
          }}>
            Now Taking Orders — Fast Delivery
          </span>
          <span className="animate-wave" style={{ display: "inline-block" }}>👋</span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "var(--font-oswald)", fontWeight: 900,
          lineHeight: 0.9, textTransform: "uppercase", margin: "0 0 24px",
        }}>
          <span style={{
            display: "block", color: "var(--text-primary)",
            fontSize: "clamp(2.6rem, 7vw, 5.8rem)", letterSpacing: "0.06em",
            transition: "color 0.3s ease",
          }}>
            Shah-e-Lasani
          </span>
          <span style={{
            display: "block",
            fontSize: "clamp(4rem, 13vw, 9.5rem)", letterSpacing: "0.03em",
            background: "linear-gradient(125deg, #E4002B 0%, #ff3355 45%, #F5A623 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            Cafe
          </span>
        </h1>

        {/* Divider */}
        <div style={{
          width: 80, height: 3,
          background: "linear-gradient(90deg, #E4002B, #F5A623)",
          borderRadius: 2, margin: "0 auto 24px",
        }} />

        {/* Tagline */}
        <p style={{
          color: "var(--text-secondary)", fontSize: "1.05rem",
          maxWidth: 420, margin: "0 auto 40px", lineHeight: 1.75,
          transition: "color 0.3s ease",
        }}>
          Pizza • Burgers • Deals — crafted fresh.
          <br />
          <span style={{ color: "#F5A623", fontWeight: 600 }}>
            Confirm your order on WhatsApp in seconds!
          </span>
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: "flex", gap: 14, justifyContent: "center",
          flexWrap: "wrap", marginBottom: 52,
        }}>
          <Link href="/menu" style={{
            background: "#E4002B", color: "#fff",
            padding: "15px 38px", borderRadius: 999,
            fontFamily: "var(--font-oswald)", fontWeight: 700,
            fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.1em",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
            boxShadow: "0 8px 32px rgba(228,0,43,0.45)",
            animation: "pulseRing 2s ease-in-out infinite",
          }}>
            🍕 Order Now
          </Link>
          <Link href="/menu?cat=deals" style={{
            background: "transparent", color: "#F5A623",
            padding: "15px 38px", borderRadius: 999,
            fontFamily: "var(--font-oswald)", fontWeight: 700,
            fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.1em",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
            border: "2px solid #F5A623",
          }}>
            🔥 View Deals
          </Link>
          <a href="https://wa.me/923254695624" target="_blank" rel="noopener noreferrer" style={{
            background: "#25D366", color: "#fff",
            padding: "15px 28px", borderRadius: 999,
            fontFamily: "var(--font-oswald)", fontWeight: 700,
            fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.08em",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
          }}>
            📱 WhatsApp
          </a>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10, maxWidth: 600, margin: "0 auto",
        }}>
          {QUICK_STATS.map((s) => (
            <div key={s.label} style={{
              background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
              border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
              borderRadius: 14, padding: "14px 8px", textAlign: "center",
              transition: "background 0.3s ease, border-color 0.3s ease",
            }}>
              <div style={{
                fontFamily: "var(--font-oswald)", fontWeight: 700,
                fontSize: "1.45rem", color: "#F5A623", lineHeight: 1,
              }}>
                {s.value}
              </div>
              <div style={{
                fontSize: "0.62rem", color: "var(--text-muted)",
                textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 5,
                transition: "color 0.3s ease",
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="animate-bounce-y" style={{
        position: "absolute", bottom: 28, left: "50%",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        opacity: 0.3,
      }}>
        <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
          scroll
        </span>
        <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, #555, transparent)" }} />
      </div>
    </section>
  );
}
