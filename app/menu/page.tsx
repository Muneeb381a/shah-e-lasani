"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { products as staticProducts, categories as staticCategories, Product } from "@/data/menu";
import type { ChoiceSection } from "@/lib/deal-config";
import ProductCard from "@/components/ProductCard";
import DealCard from "@/components/DealCard";
import FadeIn from "@/components/FadeIn";

type ApiItem = {
  id: string; name: string; description: string; price: number;
  originalPrice?: number; isDeal: boolean; categoryId: string;
  image?: string; dealConfig?: ChoiceSection[];
  sizes: { label: string; price: number }[];
};
type ApiCategory = { id: string; name: string; items: ApiItem[] };

function MenuContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");

  const staticIds = new Set(staticProducts.map((p) => p.id));
  const [extraDeals, setExtraDeals] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data: ApiCategory[]) => {
        const newDeals: Product[] = data
          .flatMap((c) => c.items)
          .filter((item) => item.isDeal && !staticIds.has(item.id))
          .map((item) => ({
            id:            item.id,
            name:          item.name,
            description:   item.description,
            basePrice:     item.price,
            originalPrice: item.originalPrice,
            isAvailable:   true,
            isDeal:        true,
            categoryId:    item.categoryId,
            sizes:         item.sizes,
            image:         item.image,
            dealConfig:    item.dealConfig,
          }));
        setExtraDeals(newDeals);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = staticCategories;
  const products   = [...staticProducts, ...extraDeals];

  const getInitial = () => {
    const map: Record<string, string> = {
      deals:     "cat-deals",
      fries:     "cat-fries",
      crunchy:   "cat-crunchy",
      pastas:    "cat-pasta",
      burger:    "cat-burger",
      wrap:      "cat-wrap",
      slice:     "cat-slice",
      pizza:     "cat-pizza",
      serving:   "cat-serving",
      beverages: "cat-beverages",
      cold:      "cat-cold",
      // legacy slugs
      pizzas:    "cat-pizza",
      burgers:   "cat-burger",
      wings:     "cat-crunchy",
      sides:     "cat-fries",
      drinks:    "cat-beverages",
    };
    return (catParam && map[catParam]) || categories[0].id;
  };

  const [active, setActive] = useState(getInitial);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActive(getInitial());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catParam]);

  // Auto-scroll active tab into center view
  useEffect(() => {
    const container = tabsRef.current;
    if (!container) return;
    const activeBtn = container.querySelector<HTMLButtonElement>("[data-active='true']");
    if (!activeBtn) return;
    const cRect = container.getBoundingClientRect();
    const bRect = activeBtn.getBoundingClientRect();
    container.scrollBy({ left: bRect.left - cRect.left - cRect.width / 2 + bRect.width / 2, behavior: "smooth" });
  }, [active]);

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
            fontSize: "0.7rem", fontWeight: 700,
            letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12,
          }}>
            <span style={{ color: "#E4002B" }}>Shah-e-Lasani</span>{" "}
            <span style={{ color: "var(--text-primary)" }}>Cafe</span>
          </p>
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
          borderBottom: "1px solid var(--border-subtle)",
          marginBottom: 32,
          transition: "background 0.3s ease",
        }}>
          {/* Scroll wrapper with fade edges */}
          <div style={{ position: "relative" }}>
            {/* Left fade */}
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0, width: 40, zIndex: 2,
              background: "linear-gradient(to right, var(--bg-page) 30%, transparent)",
              pointerEvents: "none",
            }} />
            {/* Right fade */}
            <div style={{
              position: "absolute", right: 0, top: 0, bottom: 0, width: 40, zIndex: 2,
              background: "linear-gradient(to left, var(--bg-page) 30%, transparent)",
              pointerEvents: "none",
            }} />

            {/* Scrollable row */}
            <div
              ref={tabsRef}
              className="sl-tabs-scroll"
              style={{
                display: "flex", gap: 6, overflowX: "auto",
                padding: "14px 40px",
                scrollbarWidth: "none",
              }}
            >
              {categories.map((cat) => {
                const isActive = cat.id === active;
                return (
                  <button
                    key={cat.id}
                    data-active={isActive ? "true" : "false"}
                    onClick={() => setActive(cat.id)}
                    style={{
                      flexShrink: 0,
                      padding: isActive ? "9px 22px" : "8px 18px",
                      borderRadius: 8,
                      border: "1px solid",
                      borderColor: isActive ? "#E4002B" : "var(--border-card)",
                      background: isActive
                        ? "linear-gradient(135deg, #E4002B, #c0001f)"
                        : "var(--bg-card)",
                      color: isActive ? "#fff" : "var(--text-muted)",
                      fontFamily: "var(--font-oswald)",
                      fontWeight: 700,
                      fontSize: "0.78rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 0.2s ease",
                      boxShadow: isActive
                        ? "0 4px 18px rgba(228,0,43,0.4)"
                        : "0 1px 3px rgba(0,0,0,0.08)",
                      outline: "none",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(228,0,43,0.4)";
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-card)";
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                      }
                    }}
                  >
                    {cat.name}
                    {isActive && (
                      <span style={{
                        position: "absolute", bottom: -1, left: "50%",
                        transform: "translateX(-50%)",
                        width: 24, height: 2,
                        background: "#fff",
                        borderRadius: 2,
                        opacity: 0.6,
                      }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Category label ── */}
        <FadeIn key={active}>
          <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 56, height: 56, opacity: 0.3, marginBottom: 16 }}>
              <circle cx="12" cy="12" r="10"/><path d="M8 15s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
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
