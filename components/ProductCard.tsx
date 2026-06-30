"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/data/menu";

function px(id: number) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=480&h=320&dpr=1`;
}

const CAT_IMG: Record<string, string> = {
  "cat-pizza":  px(9993754),
  "cat-burger": px(36007382),
  "cat-wings":  px(2299981),
  "cat-sides":  px(5652266),
  "cat-drinks": px(5374420),
  "cat-deals":  px(9872916),
};

const CAT_LABEL: Record<string, string> = {
  "cat-pizza":  "Pizza",
  "cat-burger": "Burger",
  "cat-wings":  "Wings",
  "cat-sides":  "Sides",
  "cat-drinks": "Drink",
  "cat-deals":  "Deal",
};

export default function ProductCard({ product }: { product: Product }) {
  const { dispatch } = useCart();

  const defaultSize = product.sizes && product.sizes.length > 1
    ? product.sizes[1].label
    : product.sizes?.[0]?.label;

  const [sel, setSel]     = useState<string | undefined>(defaultSize);
  const [added, setAdded] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const price = product.sizes
    ? (product.sizes.find((s) => s.label === sel)?.price ?? product.basePrice)
    : product.basePrice;

  const imgSrc = product.image || CAT_IMG[product.categoryId];

  function addToCart() {
    dispatch({
      type: "ADD_ITEM",
      item: {
        id: `${product.id}-${sel ?? "default"}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        size: sel,
        price,
        quantity: 1,
      },
    });
    dispatch({ type: "OPEN_CART" });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  if (!product.isAvailable) return null;

  return (
    <div
      className="product-card"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-card)",
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 48px rgba(0,0,0,0.18)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(228,0,43,0.3)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-card)";
      }}
    >
      {/* ── Image ── */}
      <div style={{ position: "relative", height: 210, overflow: "hidden", background: "var(--bg-surface)", flexShrink: 0 }}>
        {imgSrc && !imgErr ? (
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            sizes="(max-width: 600px) 100vw, 320px"
            style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
            onError={() => setImgErr(true)}
            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ width: 52, height: 52, opacity: 0.25, color: "var(--text-muted)" }}>
              <circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><circle cx="12" cy="8" r="1" fill="currentColor"/><circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>
          </div>
        )}
        {/* Category tag */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
          color: "#fff", fontSize: "0.6rem", fontWeight: 700,
          letterSpacing: "0.14em", textTransform: "uppercase",
          padding: "4px 10px", borderRadius: 999,
        }}>
          {CAT_LABEL[product.categoryId] ?? "Item"}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{
          fontFamily: "var(--font-oswald)", fontWeight: 700,
          color: "var(--text-primary)", fontSize: "1.05rem",
          lineHeight: 1.25, marginBottom: 6,
        }}>
          {product.name}
        </h3>
        <p style={{
          color: "var(--text-muted)", fontSize: "0.78rem", lineHeight: 1.6,
          flex: 1, marginBottom: 14,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {product.description}
        </p>

        {/* Size selector */}
        {product.sizes && product.sizes.length > 1 && (
          <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
            {product.sizes.map((s) => {
              const active = sel === s.label;
              return (
                <button
                  key={s.label}
                  onClick={() => setSel(s.label)}
                  style={{
                    padding: "4px 12px", borderRadius: 999,
                    border: `1.5px solid ${active ? "#E4002B" : "var(--border-card)"}`,
                    background: active ? "#E4002B" : "transparent",
                    color: active ? "#fff" : "var(--text-secondary)",
                    fontSize: "0.68rem", fontWeight: 700, cursor: "pointer",
                    transition: "all 0.18s ease",
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Price + Add */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 10,
          paddingTop: 12, borderTop: "1px solid var(--border-subtle)",
        }}>
          <span style={{
            fontFamily: "var(--font-oswald)", fontWeight: 800,
            fontSize: "1.35rem", color: "#E4002B", lineHeight: 1,
          }}>
            Rs.&nbsp;{price.toLocaleString()}
          </span>
          <button
            onClick={addToCart}
            style={{
              background: added ? "#16a34a" : "#E4002B",
              color: "#fff", border: "none", cursor: "pointer",
              padding: "9px 22px", borderRadius: 999,
              fontFamily: "var(--font-oswald)", fontWeight: 700,
              fontSize: "0.82rem", letterSpacing: "0.04em",
              transition: "all 0.18s ease", whiteSpace: "nowrap",
              boxShadow: added ? "none" : "0 4px 14px rgba(228,0,43,0.35)",
            }}
          >
            {added ? "✓ Added" : "Add +"}
          </button>
        </div>
      </div>
    </div>
  );
}
