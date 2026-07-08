"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id:             string;
  name:           string;
  description:    string;
  base_price:     number;
  original_price: number | null;
  is_available:   boolean;
  is_deal:        boolean;
  category_id:    string;
  image:          string | null;
  categories?:    { name: string } | null;
  product_sizes?: { label: string; price: number }[];
};

export default function AdminProductsPage() {
  const [products,    setProducts]    = useState<Product[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [deleting,    setDeleting]    = useState<string | null>(null);
  const [search,      setSearch]      = useState("");
  const [activeCat,   setActiveCat]   = useState("all");
  const [toggling,    setToggling]    = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/products");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load");
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggleAvailable(p: Product) {
    setToggling(p.id);
    await fetch(`/api/admin/products/${p.id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ ...p, is_available: !p.is_available }),
    });
    setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, is_available: !p.is_available } : x));
    setToggling(null);
  }

  async function deleteProduct(id: string) {
    if (!confirm("Is product ko delete karna chahte hain?")) return;
    setDeleting(id);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((x) => x.id !== id));
    setDeleting(null);
  }

  // Stats
  const totalAvailable   = products.filter((p) => p.is_available).length;
  const totalUnavailable = products.filter((p) => !p.is_available).length;
  const totalDeals       = products.filter((p) => p.is_deal).length;

  // Categories for filter tabs
  const categories = [
    { key: "all", label: "All" },
    ...Array.from(
      new Map(products.map((p) => [p.category_id, p.categories?.name ?? p.category_id])).entries()
    ).map(([key, label]) => ({ key, label })),
  ];

  // Filter
  const visible = products.filter((p) => {
    const matchCat    = activeCat === "all" || p.category_id === activeCat;
    const q           = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  // Group visible by category
  const grouped = visible.reduce<Record<string, { label: string; items: Product[] }>>((acc, p) => {
    const key   = p.category_id;
    const label = p.categories?.name ?? key;
    if (!acc[key]) acc[key] = { label, items: [] };
    acc[key].items.push(p);
    return acc;
  }, {});

  return (
    <div>

      {/* ── Page header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Products</h1>
          <div style={{ fontSize: 12, color: "#444" }}>
            Manage your menu items — toggle availability, edit prices, add new items
          </div>
        </div>
        <Link
          href="/admin/products/new"
          style={{
            background: "linear-gradient(135deg,#E4002B,#c0001f)",
            color: "#fff", padding: "10px 20px", borderRadius: 10,
            fontWeight: 700, fontSize: 13, textDecoration: "none",
            display: "flex", alignItems: "center", gap: 7,
            boxShadow: "0 4px 16px rgba(228,0,43,0.3)",
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Product
        </Link>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Items",    value: products.length,   color: "#3b82f6" },
          { label: "Live / Active",  value: totalAvailable,    color: "#22c55e" },
          { label: "Deals",          value: totalDeals,         color: "#F5A623" },
          { label: "Unavailable",    value: totalUnavailable,   color: "#6b7280" },
        ].map((s) => (
          <div key={s.label} style={{
            background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "14px 16px",
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.35 }}
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Product dhundein…"
          style={{
            width: "100%", padding: "10px 14px 10px 36px",
            background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10, color: "#fff", fontSize: 13,
            outline: "none", boxSizing: "border-box",
          }}
        />
      </div>

      {/* ── Category tabs ── */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setActiveCat(c.key)}
            style={{
              padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
              cursor: "pointer", border: "1px solid",
              borderColor: activeCat === c.key ? "rgba(228,0,43,0.4)" : "rgba(255,255,255,0.08)",
              background:  activeCat === c.key ? "rgba(228,0,43,0.12)" : "transparent",
              color:       activeCat === c.key ? "#E4002B" : "#555",
              transition:  "all 0.15s",
            }}
          >
            {c.label}
            {c.key !== "all" && (
              <span style={{ marginLeft: 5, opacity: 0.6 }}>
                {products.filter((p) => p.category_id === c.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 10, padding: "14px 18px", color: "#f87171", marginBottom: 20,
        }}>
          {error}
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div style={{ textAlign: "center", padding: 60, color: "#444" }}>Loading products…</div>
      )}

      {/* ── Empty ── */}
      {!loading && !error && visible.length === 0 && (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 16,
          color: "#444",
        }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🍕</div>
          <div style={{ fontWeight: 600, color: "#555", marginBottom: 6 }}>
            {search ? `"${search}" nahi mila` : "Koi product nahi hai"}
          </div>
          {!search && (
            <Link href="/admin/products/new" style={{ color: "#E4002B", textDecoration: "none", fontSize: 12 }}>
              Pehla product add karein →
            </Link>
          )}
        </div>
      )}

      {/* ── Products grouped by category ── */}
      {!loading && Object.entries(grouped).map(([catKey, { label, items }]) => (
        <div key={catKey} style={{ marginBottom: 36 }}>

          {/* Category heading */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
          }}>
            <div style={{
              fontSize: 10, fontWeight: 800, color: "#E4002B",
              letterSpacing: "0.14em", textTransform: "uppercase",
            }}>
              {label}
            </div>
            <div style={{
              flex: 1, height: 1,
              background: "linear-gradient(90deg,rgba(228,0,43,0.3),transparent)",
            }} />
            <div style={{ fontSize: 11, color: "#333" }}>{items.length} items</div>
          </div>

          {/* Product rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {items.map((p) => (
              <div
                key={p.id}
                style={{
                  background: "#0d0d0d",
                  border: `1px solid ${
                    !p.is_available ? "rgba(239,68,68,0.12)"
                    : p.is_deal     ? "rgba(245,166,35,0.12)"
                    : "rgba(255,255,255,0.06)"
                  }`,
                  borderRadius: 12,
                  display: "grid",
                  gridTemplateColumns: "48px 1fr auto",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 14px",
                  transition: "border-color 0.15s, background 0.15s",
                  opacity: p.is_available ? 1 : 0.6,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "#111";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(228,0,43,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "#0d0d0d";
                  (e.currentTarget as HTMLDivElement).style.borderColor = !p.is_available
                    ? "rgba(239,68,68,0.12)"
                    : p.is_deal ? "rgba(245,166,35,0.12)"
                    : "rgba(255,255,255,0.06)";
                }}
              >
                {/* Thumbnail */}
                <div style={{
                  width: 48, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: 20 }}>🍕</span>
                  )}
                </div>

                {/* Info */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, color: "#fff", fontSize: 14, lineHeight: 1.3 }}>
                      {p.name}
                    </span>
                    {p.is_deal && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
                        background: "rgba(245,166,35,0.15)", color: "#F5A623",
                        border: "1px solid rgba(245,166,35,0.3)",
                        padding: "1px 5px", borderRadius: 4,
                      }}>DEAL</span>
                    )}
                    {!p.is_available && (
                      <span style={{
                        fontSize: 9, fontWeight: 700,
                        background: "rgba(239,68,68,0.12)", color: "#f87171",
                        border: "1px solid rgba(239,68,68,0.2)",
                        padding: "1px 5px", borderRadius: 4,
                      }}>OFF</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>
                    {p.product_sizes && p.product_sizes.length > 0 ? (
                      p.product_sizes.map((s) => (
                        <span key={s.label} style={{ marginRight: 8 }}>
                          <span style={{ color: "#444" }}>{s.label}:</span>{" "}
                          <span style={{ color: "#666", fontWeight: 600 }}>Rs.{s.price.toLocaleString()}</span>
                        </span>
                      ))
                    ) : (
                      <span>
                        <span style={{ color: "#666", fontWeight: 600 }}>Rs. {p.base_price.toLocaleString()}</span>
                        {p.original_price && (
                          <span style={{ color: "#333", textDecoration: "line-through", marginLeft: 6 }}>
                            Rs. {p.original_price.toLocaleString()}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>

                  {/* Toggle */}
                  <button
                    onClick={() => toggleAvailable(p)}
                    disabled={toggling === p.id}
                    title={p.is_available ? "Unavailable kar dein" : "Available kar dein"}
                    style={{
                      minWidth: 68,
                      background: p.is_available ? "rgba(34,197,94,0.1)"  : "rgba(107,114,128,0.1)",
                      border:  `1px solid ${p.is_available ? "rgba(34,197,94,0.25)" : "rgba(107,114,128,0.2)"}`,
                      color:  p.is_available ? "#22c55e" : "#6b7280",
                      borderRadius: 7, padding: "6px 10px",
                      fontSize: 11, fontWeight: 700, cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {toggling === p.id ? "…" : p.is_available ? "✓ Live" : "Off"}
                  </button>

                  {/* Edit */}
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#bbb", borderRadius: 7,
                      padding: "6px 12px", fontSize: 11,
                      fontWeight: 600, textDecoration: "none",
                      display: "flex", alignItems: "center", gap: 5,
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => deleteProduct(p.id)}
                    disabled={deleting === p.id}
                    style={{
                      background: "rgba(239,68,68,0.07)",
                      border: "1px solid rgba(239,68,68,0.18)",
                      color: "#f87171", borderRadius: 7,
                      padding: "6px 10px", fontSize: 11,
                      fontWeight: 600, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 4,
                      transition: "all 0.15s",
                    }}
                  >
                    {deleting === p.id ? "…" : (
                      <>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                        </svg>
                        Del
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
