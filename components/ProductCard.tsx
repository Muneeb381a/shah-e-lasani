"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";
import { Product } from "@/data/menu";

const CAT: Record<string, { emoji: string; label: string; color: string }> = {
  "cat-pizza":  { emoji: "🍕", label: "Pizza",  color: "#E4002B" },
  "cat-burger": { emoji: "🍔", label: "Burger", color: "#16a34a" },
  "cat-wings":  { emoji: "🍗", label: "Wings",  color: "#ea580c" },
  "cat-sides":  { emoji: "🍟", label: "Sides",  color: "#d97706" },
  "cat-drinks": { emoji: "🥤", label: "Drink",  color: "#2563eb" },
  "cat-deals":  { emoji: "🎁", label: "Deal",   color: "#9333ea" },
};

function px(id: number) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=480&h=320&dpr=1`;
}

const CAT_DEFAULT_IMG: Record<string, string> = {
  "cat-pizza":  px(9993754),
  "cat-burger": px(36007382),
  "cat-wings":  px(2299981),
  "cat-sides":  px(5652266),
  "cat-drinks": px(5374420),
  "cat-deals":  px(9872916),
};

export default function ProductCard({ product }: { product: Product }) {
  const { dispatch } = useCart();
  const { theme }    = useTheme();
  const dark = theme === "dark";

  const cat = CAT[product.categoryId] ?? CAT["cat-pizza"];

  const defaultSize =
    product.sizes && product.sizes.length > 1
      ? product.sizes[1].label
      : product.sizes?.[0]?.label;

  const [sel, setSel]         = useState<string | undefined>(defaultSize);
  const [added, setAdded]     = useState(false);
  const [hovered, setHovered] = useState(false);
  const [imgErr, setImgErr]   = useState(false);

  const price = product.sizes
    ? (product.sizes.find((s) => s.label === sel)?.price ?? product.basePrice)
    : product.basePrice;

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

  const imgSrc = product.image || CAT_DEFAULT_IMG[product.categoryId];
  const showRealImg = !!imgSrc && !imgErr;
  const imgBg = `var(--img-${product.categoryId.replace("cat-", "")})`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${hovered ? `${cat.color}55` : "var(--border-card)"}`,
        borderRadius: 24,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 24px 56px ${cat.color}22, 0 6px 20px var(--shadow-card)`
          : `0 1px 8px var(--shadow-card)`,
        transition: "all 0.32s cubic-bezier(0.34,1.4,0.64,1)",
        cursor: "pointer",
      }}
    >
      {/* ── Image area ── */}
      <div style={{
        height: 200,
        position: "relative",
        overflow: "hidden",
        background: showRealImg ? "#111" : imgBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>

        {showRealImg ? (
          <>
            <Image
              src={imgSrc!}
              alt={product.name}
              fill
              sizes="(max-width: 600px) 100vw, 320px"
              style={{
                objectFit: "cover",
                transform: hovered ? "scale(1.08)" : "scale(1)",
                transition: "transform 0.5s ease",
              }}
              onError={() => setImgErr(true)}
            />
            {/* subtle dark overlay so badge is readable */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 60%)",
            }} />
          </>
        ) : (
          <>
            {/* Fallback: emoji */}
            <div style={{
              position: "absolute",
              width: 140, height: 140, borderRadius: "50%",
              background: `radial-gradient(circle, ${cat.color}20 0%, transparent 70%)`,
              filter: "blur(20px)",
              opacity: hovered ? 1 : 0.5,
            }} />
            <span style={{
              fontSize: 82, position: "relative", zIndex: 1,
              filter: dark ? "drop-shadow(0 10px 24px rgba(0,0,0,0.7))" : "drop-shadow(0 6px 16px rgba(0,0,0,0.18))",
              transform: hovered ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.32s ease",
              display: "inline-block",
            }}>
              {cat.emoji}
            </span>
          </>
        )}

        {/* Category badge */}
        <div style={{
          position: "absolute", top: 12, right: 12, zIndex: 2,
          background: showRealImg
            ? "rgba(0,0,0,0.6)"
            : dark ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.75)",
          backdropFilter: "blur(8px)",
          borderRadius: 999,
          padding: "4px 11px",
          display: "flex", alignItems: "center", gap: 5,
          border: `1px solid ${cat.color}40`,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: cat.color, flexShrink: 0, display: "inline-block" }} />
          <span style={{
            color: showRealImg ? "#fff" : dark ? "#ddd" : "#222",
            fontSize: "0.62rem", fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
          }}>
            {cat.label}
          </span>
        </div>

        {/* Name overlay on image (only when real image) */}
        {showRealImg && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            padding: "10px 16px", zIndex: 2,
          }}>
            <h3 style={{
              fontFamily: "var(--font-oswald)", fontWeight: 700,
              color: "#fff", fontSize: "1.1rem", lineHeight: 1.2,
              margin: 0, textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            }}>
              {product.name}
            </h3>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>

        {/* Name (only when no real image) */}
        {!showRealImg && (
          <h3 style={{
            fontFamily: "var(--font-oswald)", fontWeight: 700,
            color: "var(--text-primary)", fontSize: "1.1rem",
            lineHeight: 1.3, marginBottom: 8,
          }}>
            {product.name}
          </h3>
        )}

        {/* Description */}
        <p style={{
          color: "var(--text-muted)", fontSize: "0.78rem", lineHeight: 1.65,
          marginBottom: 0, flex: 1,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
          marginTop: showRealImg ? 0 : 0,
        }}>
          {product.description}
        </p>

        {/* Size pills */}
        {product.sizes && product.sizes.length > 1 && (
          <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
            {product.sizes.map((s) => {
              const active = sel === s.label;
              return (
                <button key={s.label} onClick={() => setSel(s.label)} style={{
                  padding: "5px 12px", borderRadius: 999,
                  border: `1.5px solid ${active ? cat.color : "var(--border-card)"}`,
                  background: active ? cat.color : "transparent",
                  color: active ? "#fff" : "var(--text-secondary)",
                  fontSize: "0.68rem", fontWeight: 700, cursor: "pointer",
                  letterSpacing: "0.05em", transition: "all 0.2s ease",
                  boxShadow: active ? `0 3px 12px ${cat.color}44` : "none",
                }}>
                  {s.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Price + CTA */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, marginTop: 16, paddingTop: 14,
          borderTop: "1px solid var(--border-subtle)",
        }}>
          <span style={{
            fontFamily: "var(--font-oswald)", fontWeight: 800,
            fontSize: "1.4rem", color: "#F5A623", lineHeight: 1,
          }}>
            Rs.&nbsp;{price.toLocaleString()}
          </span>
          <button onClick={addToCart} style={{
            background: added ? "#16a34a" : "#E4002B",
            color: "#fff", border: "none", cursor: "pointer",
            padding: "9px 20px", borderRadius: 999,
            fontFamily: "var(--font-oswald)", fontWeight: 700,
            fontSize: "0.85rem", letterSpacing: "0.04em",
            boxShadow: added ? "none" : "0 4px 16px rgba(228,0,43,0.38)",
            transform: added ? "scale(0.95)" : "scale(1)",
            transition: "all 0.2s ease", whiteSpace: "nowrap", flexShrink: 0,
          }}>
            {added ? "✓ Added" : "+ Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
