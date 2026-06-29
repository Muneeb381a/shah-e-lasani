"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/data/menu";

function px(id: number) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=480&h=320&dpr=1`;
}
const DEAL_DEFAULT_IMG = px(9872916);

export default function DealCard({ deal }: { deal: Product; index?: number }) {
  const { dispatch } = useCart();

  const [added, setAdded]   = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const original = (deal as Product & { originalPrice?: number }).originalPrice;
  const savePct  = original ? Math.round(((original - deal.basePrice) / original) * 100) : null;
  const savings  = original ? original - deal.basePrice : null;

  const imgSrc = deal.image || DEAL_DEFAULT_IMG;

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
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-card)",
        borderRadius: 16, overflow: "hidden",
        display: "flex", flexDirection: "column",
        transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 48px rgba(228,0,43,0.15)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(228,0,43,0.35)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-card)";
      }}
    >
      {/* ── Image ── */}
      <div style={{ position: "relative", height: 190, overflow: "hidden", background: "var(--bg-surface)", flexShrink: 0 }}>
        {!imgErr ? (
          <Image
            src={imgSrc}
            alt={deal.name}
            fill
            sizes="(max-width: 600px) 100vw, 320px"
            style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
            onError={() => setImgErr(true)}
            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 60, opacity: 0.35 }}>🔥</span>
          </div>
        )}

        {/* DEAL badge */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: "#E4002B", color: "#fff",
          fontSize: "0.6rem", fontWeight: 800,
          letterSpacing: "0.18em", textTransform: "uppercase",
          padding: "4px 10px", borderRadius: 999,
        }}>
          Hot Deal
        </div>

        {/* Savings badge */}
        {savePct && (
          <div style={{
            position: "absolute", top: 12, right: 12,
            background: "#F5A623", color: "#000",
            fontSize: "0.65rem", fontWeight: 900,
            padding: "4px 10px", borderRadius: 999,
            letterSpacing: "0.05em",
          }}>
            -{savePct}% OFF
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{
          fontFamily: "var(--font-oswald)", fontWeight: 700,
          color: "var(--text-primary)", fontSize: "1.08rem",
          lineHeight: 1.25, marginBottom: 6,
        }}>
          {deal.name}
        </h3>
        <p style={{
          color: "var(--text-muted)", fontSize: "0.78rem", lineHeight: 1.6,
          flex: 1, marginBottom: 14,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {deal.description}
        </p>

        {/* Price row */}
        <div style={{
          paddingTop: 12, borderTop: "1px solid var(--border-subtle)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
        }}>
          <div>
            {original && (
              <div style={{
                fontFamily: "var(--font-oswald)", fontSize: "0.82rem",
                color: "var(--text-muted)", textDecoration: "line-through", marginBottom: 2,
              }}>
                Rs. {original.toLocaleString()}
              </div>
            )}
            <div style={{ fontFamily: "var(--font-oswald)", fontWeight: 900, fontSize: "1.4rem", color: "#E4002B", lineHeight: 1 }}>
              Rs. {deal.basePrice.toLocaleString()}
            </div>
            {savings && (
              <div style={{ color: "#16a34a", fontSize: "0.68rem", fontWeight: 700, marginTop: 3 }}>
                Save Rs. {savings.toLocaleString()}
              </div>
            )}
          </div>
          <button
            onClick={addToCart}
            style={{
              background: added ? "#16a34a" : "#E4002B",
              color: "#fff", border: "none", cursor: "pointer",
              padding: "10px 22px", borderRadius: 999,
              fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.85rem",
              boxShadow: added ? "none" : "0 4px 16px rgba(228,0,43,0.35)",
              transition: "all 0.18s ease", whiteSpace: "nowrap",
            }}
          >
            {added ? "✓ Added!" : "Order Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
