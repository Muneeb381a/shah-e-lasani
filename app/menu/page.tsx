"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { products as staticProducts, categories as staticCategories } from "@/data/menu";
import ProductCard from "@/components/ProductCard";
import DealCard from "@/components/DealCard";
import FadeIn from "@/components/FadeIn";
import type { Product, Category } from "@/data/menu";

const CAT_EMOJI: Record<string, string> = {
  "cat-deals":  "🔥",
  "cat-pizza":  "🍕",
  "cat-burger": "🍔",
  "cat-wings":  "🍗",
  "cat-sides":  "🍟",
  "cat-drinks": "🥤",
};

function MenuContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");

  const [categories, setCategories] = useState<Category[]>(staticCategories);
  const [products,   setProducts]   = useState<Product[]>(staticProducts);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data: { id: string; name: string; items: { id: string; name: string; description: string; price: number; originalPrice?: number; isDeal: boolean; categoryId: string; sizes?: { label: string; price: number }[] }[] }[]) => {
        // Reshape API response to match static Product/Category format
        const cats: Category[] = data.map((c, i) => ({
          id: c.id, name: c.name, slug: c.id.replace("cat-", ""), order: i,
        }));
        const prods: Product[] = data.flatMap((c) =>
          c.items.map((item) => ({
            id:            item.id,
            name:          item.name,
            description:   item.description,
            basePrice:     item.price,
            originalPrice: item.originalPrice,
            isAvailable:   true,
            isDeal:        item.isDeal,
            categoryId:    item.categoryId,
            sizes:         item.sizes,
            image:         (item as { image?: string }).image,
          }))
        );
        if (cats.length > 0) { setCategories(cats); setProducts(prods); }
      })
      .catch(() => { /* keep static data */ });
  }, []);

  const getInitial = () => {
    if (catParam === "deals")   return "cat-deals";
    if (catParam === "pizzas")  return "cat-pizza";
    if (catParam === "burgers") return "cat-burger";
    return categories[0].id;
  };

  const [active, setActive] = useState(getInitial);

  useEffect(() => {
    setActive(getInitial());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catParam]);

  const visible    = products.filter((p) => p.categoryId === active && p.isAvailable);
  const isDeals    = active === "cat-deals";
  const activeCat  = categories.find((c) => c.id === active);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", transition: "background 0.3s ease" }}>

      {/* ── Page header ── */}
      <div style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "3rem 1.5rem 2.5rem",
        textAlign: "center",
        position: "relative", overflow: "hidden",
        transition: "background 0.3s ease",
      }}>
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          pointerEvents: "none", overflow: "hidden",
        }}>
          <span style={{
            fontFamily: "var(--font-oswald)", fontWeight: 900,
            fontSize: "clamp(100px, 18vw, 220px)",
            color: "rgba(228,0,43,0.04)", lineHeight: 1,
            textTransform: "uppercase", userSelect: "none",
          }}>
            MENU
          </span>
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{
            color: "#E4002B", fontSize: "0.7rem", fontWeight: 700,
            letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12,
          }}>Shah-e-Lasani Cafe</p>
          <h1 style={{
            fontFamily: "var(--font-oswald)", fontWeight: 900, color: "var(--text-primary)",
            fontSize: "clamp(2.4rem, 6vw, 4rem)", textTransform: "uppercase",
            letterSpacing: "0.04em", lineHeight: 1, marginBottom: 12,
            transition: "color 0.3s ease",
          }}>
            Our Menu
          </h1>
          <div style={{
            width: 60, height: 3,
            background: "linear-gradient(90deg, #E4002B, #F5A623)",
            borderRadius: 2, margin: "0 auto 14px",
          }} />
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", transition: "color 0.3s ease" }}>
            Fresh made-to-order — pizza, burgers, sides &amp; drinks
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1rem 4rem" }}>

        {/* ── Category tabs (sticky) ── */}
        <div style={{
          position: "sticky", top: 64, zIndex: 10,
          background: "var(--bg-page)",
          padding: "16px 0",
          borderBottom: "1px solid var(--border-subtle)",
          marginBottom: 32,
          transition: "background 0.3s ease",
        }}>
          <div style={{
            display: "flex", gap: 8, overflowX: "auto",
            paddingBottom: 4, scrollbarWidth: "none",
          }}>
            {categories.map((cat) => {
              const isActive = cat.id === active;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActive(cat.id)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    padding: "10px 20px", borderRadius: 999, border: "1px solid",
                    borderColor: isActive ? "#E4002B" : "var(--border-card)",
                    background: isActive ? "#E4002B" : "var(--bg-card)",
                    color: isActive ? "#fff" : "var(--text-muted)",
                    fontFamily: "var(--font-open-sans)", fontWeight: 600,
                    fontSize: "0.82rem", cursor: "pointer", whiteSpace: "nowrap",
                    transition: "all 0.25s ease",
                    boxShadow: isActive ? "0 4px 16px rgba(228,0,43,0.35)" : "none",
                    transform: isActive ? "scale(1.04)" : "scale(1)",
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>{CAT_EMOJI[cat.id] ?? "🍽️"}</span>
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Category label ── */}
        <FadeIn key={active}>
          <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "2rem" }}>{CAT_EMOJI[active] ?? "🍽️"}</span>
            <div>
              <h2 style={{
                fontFamily: "var(--font-oswald)", fontWeight: 700, color: "var(--text-primary)",
                fontSize: "1.6rem", textTransform: "uppercase", letterSpacing: "0.04em",
                lineHeight: 1, transition: "color 0.3s ease",
              }}>
                {activeCat?.name ?? "Menu"}
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: 4, transition: "color 0.3s ease" }}>
                {visible.length} item{visible.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>
        </FadeIn>

        {/* ── Grid ── */}
        {visible.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>😔</div>
            <p>No items available in this category right now.</p>
          </div>
        ) : isDeals ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {visible.map((deal, i) => (
              <FadeIn key={deal.id} delay={i * 80}><DealCard deal={deal} index={i} /></FadeIn>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 24 }}>
            {visible.map((p, i) => (
              <FadeIn key={p.id} delay={i * 60}><ProductCard product={p} /></FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading menu…</p>
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}
