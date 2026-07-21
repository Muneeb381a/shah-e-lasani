"use client";

import { useState } from "react";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import Link from "next/link";

const BOARDS = [
  {
    src: "/menu-images/menu-board-1.jpg",
    title: "Pizza Deals & Burgers",
    desc: "Pizza Deals (PD1–PD4), Lazano Deal, Burgers, Wraps & Fried Chicken",
  },
  {
    src: "/menu-images/menu-board-2.jpg",
    title: "Fries, Wings & Sweets",
    desc: "Fries, Crunchy Wings, Pasta, Kids Deal, Beverages, Cakes & Lasani Kheer",
  },
  {
    src: "/menu-images/menu-board-3.jpg",
    title: "Pizzas & Family Deals",
    desc: "Classic, Signature & Deep Pan Pizzas with full price chart + Burger & Family Deals",
  },
];

export default function MenuBoardPage() {
  const [zoom, setZoom] = useState<string | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>

      {/* Header */}
      <div style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "3rem 1.5rem 2.5rem",
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center", pointerEvents: "none",
        }}>
          <span style={{
            fontFamily: "var(--font-oswald)", fontWeight: 900,
            fontSize: "clamp(60px, 12vw, 160px)",
            color: "rgba(228,0,43,0.04)", userSelect: "none", textTransform: "uppercase",
          }}>MENU</span>
        </div>
        <FadeIn>
          <p style={{ color: "#E4002B", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>
            Full Menu
          </p>
          <h1 style={{
            fontFamily: "var(--font-oswald)", fontWeight: 900, color: "var(--text-primary)",
            fontSize: "clamp(2rem, 5vw, 3.2rem)", textTransform: "uppercase",
            letterSpacing: "0.04em", lineHeight: 1, marginBottom: 14,
          }}>
            Menu Boards
          </h1>
          <div style={{ width: 60, height: 3, background: "linear-gradient(90deg,#E4002B,#F5A623)", borderRadius: 2, margin: "0 auto 14px" }} />
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic", marginBottom: 8 }}>
            &ldquo;Eat good{" "}
            <span style={{ color: "#E4002B", fontWeight: 700, fontStyle: "normal" }}>Feel good</span>
            {" "}that&apos;s way{" "}
            <span style={{ color: "#E4002B", fontWeight: 700, fontStyle: "normal" }}>Shah-E-Lasani Cafe</span>
            {" "}Serves good and{" "}
            <span style={{ color: "#E4002B", fontWeight: 700, fontStyle: "normal" }}>hygienic food</span>
            &rdquo;
          </p>
        </FadeIn>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 24,
        }}>
          {BOARDS.map((board, i) => (
            <FadeIn key={board.src} delay={i * 80}>
              <div
                onClick={() => setZoom(board.src)}
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid var(--border-card)",
                  background: "var(--bg-card)",
                  cursor: "zoom-in",
                  transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                  boxShadow: "0 4px 24px var(--shadow-card)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px) scale(1.01)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(228,0,43,0.2)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(228,0,43,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0) scale(1)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px var(--shadow-card)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-card)";
                }}
              >
                {/* Image */}
                <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", background: "#111" }}>
                  <Image
                    src={board.src}
                    alt={board.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  {/* Zoom hint overlay */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "rgba(0,0,0,0)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.2s",
                  }}
                    className="sl-board-overlay"
                  >
                    <span style={{
                      background: "rgba(0,0,0,0.6)",
                      color: "#fff", fontSize: "0.8rem", fontWeight: 600,
                      padding: "8px 16px", borderRadius: 999,
                      opacity: 0, transition: "opacity 0.2s",
                      backdropFilter: "blur(8px)",
                    }} className="sl-zoom-hint">
                      🔍 Click to zoom
                    </span>
                  </div>
                </div>
                {/* Info */}
                <div style={{ padding: "16px 20px 20px" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8, marginBottom: 6,
                  }}>
                    <span style={{
                      background: "#E4002B", color: "#fff",
                      fontSize: "0.62rem", fontWeight: 800,
                      padding: "3px 8px", borderRadius: 999, letterSpacing: "0.05em",
                    }}>
                      BOARD {i + 1}
                    </span>
                    <h3 style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "0.95rem", margin: 0 }}>
                      {board.title}
                    </h3>
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", margin: 0, lineHeight: 1.5 }}>
                    {board.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Order CTA */}
        <FadeIn delay={200}>
          <div style={{ textAlign: "center", marginTop: 52 }}>
            <p style={{ color: "var(--text-muted)", marginBottom: 16, fontSize: "0.9rem" }}>
              Ready to order? Browse our interactive menu or order directly on WhatsApp.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/menu"
                style={{
                  background: "#E4002B", color: "#fff",
                  padding: "12px 28px", borderRadius: 999,
                  fontWeight: 700, fontSize: "0.9rem", textDecoration: "none",
                  boxShadow: "0 6px 24px rgba(228,0,43,0.4)",
                  display: "inline-block",
                }}
              >
                Order Online
              </Link>
              <a
                href="https://wa.me/923254695624?text=Assalam%20o%20Alaikum%2C%20I%20want%20to%20place%20an%20order"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "rgba(37,211,102,0.1)",
                  border: "1px solid rgba(37,211,102,0.3)",
                  color: "#25D366",
                  padding: "12px 28px", borderRadius: 999,
                  fontWeight: 700, fontSize: "0.9rem", textDecoration: "none",
                  display: "inline-block",
                }}
              >
                WhatsApp Order 📱
              </a>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Lightbox */}
      {zoom && (
        <div
          onClick={() => setZoom(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16, cursor: "zoom-out",
            backdropFilter: "blur(12px)",
            animation: "fadeInUp 0.2s ease",
          }}
        >
          <button
            onClick={() => setZoom(null)}
            style={{
              position: "absolute", top: 20, right: 20,
              background: "rgba(255,255,255,0.1)", border: "none",
              color: "#fff", width: 44, height: 44, borderRadius: "50%",
              fontSize: "1.2rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
          <div style={{
            position: "relative",
            maxWidth: "min(92vw, 960px)",
            maxHeight: "90vh",
            borderRadius: 12,
            overflow: "hidden",
          }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={zoom}
              alt="Menu board"
              width={960}
              height={720}
              style={{ width: "100%", height: "auto", maxHeight: "88vh", objectFit: "contain" }}
              priority
            />
          </div>
        </div>
      )}

      <style>{`
        .sl-board-overlay:hover { background: rgba(0,0,0,0.15) !important; }
        .sl-board-overlay:hover .sl-zoom-hint { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
