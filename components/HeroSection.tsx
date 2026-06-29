"use client";

import Link from "next/link";
import Image from "next/image";

const BG_IMAGE =
  "https://res.cloudinary.com/dko2nywrn/image/upload/v1782745693/ChatGPT_Image_Jun_29_2026_08_07_38_PM_jtp3c4.png";

export default function HeroSection() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Background food image ── */}
      <Image
        src={BG_IMAGE}
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />

      {/* ── Light white overlays ── */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.70)" }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.88) 100%)",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
        background: "linear-gradient(to top, rgba(228,0,43,0.07) 0%, transparent 100%)",
      }} />
      {/* Grid overlay — dark lines on white */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }} />

      {/* ── Content ── */}
      <div
        style={{
          position: "relative", zIndex: 10,
          textAlign: "center",
          padding: "9rem 1.5rem 5rem",
          maxWidth: 820,
          width: "100%",
        }}
      >
        {/* Small logo */}
        <div style={{
          width: 80, height: 80,
          borderRadius: 22, overflow: "hidden",
          background: "#fff",
          margin: "0 auto 28px",
          position: "relative",
          boxShadow: "0 8px 40px rgba(228,0,43,0.3), 0 0 0 2px rgba(228,0,43,0.25)",
        }}>
          <Image
            src="/shahelasani.png"
            alt="Shah-e-Lasani Cafe"
            fill
            sizes="80px"
            style={{ objectFit: "contain", padding: "10px" }}
          />
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "var(--font-oswald)", fontWeight: 900,
          lineHeight: 0.88, textTransform: "uppercase",
          margin: "0 0 20px",
        }}>
          <span style={{
            display: "block", color: "#E4002B",
            fontSize: "clamp(1.6rem, 4vw, 3rem)",
            letterSpacing: "0.1em", marginBottom: 8,
          }}>
            Shah-e-Lasani
          </span>
          <span style={{
            display: "block", color: "#111111",
            fontSize: "clamp(4.5rem, 12vw, 9.5rem)",
            letterSpacing: "0.02em",
          }}>
            Cafe
          </span>
        </h1>

        {/* Divider */}
        <div style={{
          width: 70, height: 3,
          background: "linear-gradient(90deg, #E4002B, #F5A623)",
          borderRadius: 2, margin: "0 auto 22px",
        }} />

        {/* Tagline */}
        <p style={{
          color: "#444444",
          fontSize: "clamp(0.92rem, 2vw, 1.05rem)",
          lineHeight: 1.75, margin: "0 auto 40px", maxWidth: 480,
        }}>
          Pizza · Burgers · Wings · Deals — crafted fresh every order.
          <br />
          <span style={{ color: "#c9001f", fontWeight: 600 }}>
            Sialkot's finest, delivered hot to your door.
          </span>
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/menu"
            style={{
              background: "#E4002B", color: "#fff",
              padding: "15px 42px", borderRadius: 999,
              fontFamily: "var(--font-oswald)", fontWeight: 700,
              fontSize: "1.05rem", textTransform: "uppercase", letterSpacing: "0.12em",
              textDecoration: "none",
              boxShadow: "0 8px 32px rgba(228,0,43,0.45)",
              animation: "pulseRing 2s ease-in-out infinite",
            }}
          >
            Order Now
          </Link>
          <Link
            href="/menu?cat=deals"
            style={{
              background: "transparent", color: "#111111",
              padding: "15px 36px", borderRadius: 999,
              fontFamily: "var(--font-oswald)", fontWeight: 700,
              fontSize: "1.05rem", textTransform: "uppercase", letterSpacing: "0.1em",
              textDecoration: "none",
              border: "2px solid rgba(0,0,0,0.25)",
            }}
          >
             View Deals
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="animate-bounce-y"
        style={{
          position: "absolute", bottom: 28, left: "50%",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          opacity: 0.35,
        }}
      >
        <span style={{ fontSize: "0.58rem", color: "#111", letterSpacing: "0.2em", textTransform: "uppercase" }}>
          scroll
        </span>
        <div style={{ width: 1, height: 34, background: "linear-gradient(to bottom, #111, transparent)" }} />
      </div>
    </section>
  );
}
