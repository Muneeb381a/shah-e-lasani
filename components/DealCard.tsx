"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";

function px(id: number) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=480&h=320&dpr=1`;
}
const DEAL_DEFAULT_IMG = px(9872916);
import { useTheme } from "@/lib/theme-context";
import { Product } from "@/data/menu";

const THEMES = [
  { headerBg: "#E4002B", emoji: "🔥", glow: "rgba(228,0,43,0.28)",   accent: "#E4002B" },
  { headerBg: "#7c3aed", emoji: "⚡", glow: "rgba(124,58,237,0.28)",  accent: "#7c3aed" },
  { headerBg: "#059669", emoji: "🎉", glow: "rgba(5,150,105,0.28)",   accent: "#059669" },
  { headerBg: "#d97706", emoji: "🎁", glow: "rgba(217,119,6,0.28)",   accent: "#d97706" },
];

export default function DealCard({ deal, index = 0 }: { deal: Product; index?: number }) {
  const { dispatch } = useCart();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [added, setAdded]     = useState(false);
  const [hovered, setHovered] = useState(false);
  const [imgErr, setImgErr]   = useState(false);

  const t         = THEMES[index % THEMES.length];
  const original  = (deal as Product & { originalPrice?: number }).originalPrice;
  const savings   = original ? original - deal.basePrice : null;
  const savePct   = original ? Math.round(((original - deal.basePrice) / original) * 100) : null;

  function addToCart() {
    dispatch({
      type: "ADD_ITEM",
      item: { id: `${deal.id}-${Date.now()}`, productId: deal.id, name: deal.name, price: deal.basePrice, quantity: 1 },
    });
    dispatch({ type: "OPEN_CART" });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${hovered ? `${t.accent}70` : "var(--border-card)"}`,
        borderRadius: 22, overflow: "hidden",
        display: "flex", flexDirection: "column",
        transform: hovered ? "translateY(-10px) scale(1.015)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? `0 28px 60px ${t.glow}, 0 8px 24px var(--shadow-card)`
          : `0 2px 12px var(--shadow-card)`,
        transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease, border-color 0.25s ease",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* ── Top accent bar ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${t.headerBg}, ${t.headerBg}88)`,
        opacity: hovered ? 1 : 0.4,
        transition: "opacity 0.3s ease",
        zIndex: 2,
      }} />

      {/* ── Savings badge ── */}
      {savePct && (
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: "#F5A623", color: "#000",
          fontSize: "0.65rem", fontWeight: 900,
          padding: "5px 11px", borderRadius: 999,
          letterSpacing: "0.06em", zIndex: 3,
          boxShadow: "0 2px 10px rgba(245,166,35,0.5)",
        }}>
          -{savePct}% OFF
        </div>
      )}

      {/* ── Coloured header strip ── */}
      <div style={{
        background: `linear-gradient(135deg, ${t.headerBg}, ${t.headerBg}cc)`,
        padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontSize: "1.1rem" }}>{t.emoji}</span>
        <span style={{
          fontFamily: "var(--font-oswald)", fontWeight: 700,
          color: "#fff", fontSize: "0.68rem",
          letterSpacing: "0.2em", textTransform: "uppercase",
        }}>
          Special Deal
        </span>
      </div>

      {/* ── Image / Emoji showcase ── */}
      {(deal.image || DEAL_DEFAULT_IMG) && !imgErr ? (
        <div style={{
          height: 160, position: "relative", overflow: "hidden", background: "#111",
        }}>
          <Image
            src={deal.image || DEAL_DEFAULT_IMG}
            alt={deal.name}
            fill
            sizes="(max-width: 600px) 100vw, 320px"
            style={{
              objectFit: "cover",
              transform: hovered ? "scale(1.08)" : "scale(1)",
              transition: "transform 0.5s ease",
            }}
            onError={() => setImgErr(true)}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.05) 60%)",
          }} />
        </div>
      ) : (
        <div style={{
          height: 130,
          background: dark
            ? `radial-gradient(circle at 50% 60%, ${t.headerBg}22 0%, transparent 70%), #0e0e0e`
            : `radial-gradient(circle at 50% 60%, ${t.headerBg}14 0%, transparent 70%), #f8f8f8`,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
          transition: "background 0.3s ease",
        }}>
          <div style={{
            position: "absolute", width: 110, height: 110, borderRadius: "50%",
            border: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
          }} />
          <div style={{
            position: "absolute", width: 155, height: 155, borderRadius: "50%",
            border: `1px solid ${dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"}`,
          }} />
          <span className="animate-float3" style={{
            fontSize: 62,
            filter: dark
              ? "drop-shadow(0 8px 20px rgba(0,0,0,0.8))"
              : "drop-shadow(0 6px 16px rgba(0,0,0,0.2))",
            position: "relative", zIndex: 1,
            transform: hovered ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.3s ease",
            display: "inline-block",
          }}>
            {t.emoji}
          </span>
        </div>
      )}

      {/* ── Content ── */}
      <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{
          fontFamily: "var(--font-oswald)", fontWeight: 700,
          color: "var(--text-primary)",
          fontSize: "1.15rem", marginBottom: 6, lineHeight: 1.2,
          transition: "color 0.3s ease",
        }}>
          {deal.name}
        </h3>
        <p style={{
          color: "var(--text-muted)",
          fontSize: "0.78rem", lineHeight: 1.6, flex: 1, marginBottom: 18,
          transition: "color 0.3s ease",
        }}>
          {deal.description}
        </p>

        {/* Price + savings */}
        <div style={{
          paddingTop: 14,
          borderTop: "1px solid var(--border-subtle)",
          display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8,
        }}>
          <div>
            {original && (
              <div style={{
                color: "var(--text-faint)",
                fontFamily: "var(--font-oswald)",
                fontSize: "0.88rem", textDecoration: "line-through",
                marginBottom: 2,
                transition: "color 0.3s ease",
              }}>
                Rs. {original.toLocaleString()}
              </div>
            )}
            <div style={{
              fontFamily: "var(--font-oswald)", fontWeight: 900,
              fontSize: "1.55rem", color: "#F5A623", lineHeight: 1,
            }}>
              Rs. {deal.basePrice.toLocaleString()}
            </div>
            {savings && (
              <div style={{ color: "#4ade80", fontSize: "0.68rem", fontWeight: 700, marginTop: 3 }}>
                Save Rs. {savings.toLocaleString()}
              </div>
            )}
          </div>

          <button
            onClick={addToCart}
            style={{
              background: added ? "#16a34a" : "#E4002B",
              color: "#fff", border: "none", cursor: "pointer",
              padding: "10px 20px", borderRadius: 999,
              fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.85rem",
              boxShadow: added ? "none" : "0 4px 20px rgba(228,0,43,0.4)",
              transform: added ? "scale(0.95)" : "scale(1)",
              transition: "all 0.2s ease", whiteSpace: "nowrap",
            }}
          >
            {added ? "✓ Added!" : "Order Deal"}
          </button>
        </div>
      </div>
    </div>
  );
}
