"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id:           string;
  name:         string;
  description:  string;
  base_price:   number;
  is_available: boolean;
  is_deal:      boolean;
  category_id:  string;
  image:        string | null;
  categories?:  { name: string } | null;
  product_sizes?: { label: string; price: number }[];
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

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
    await fetch(`/api/admin/products/${p.id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ ...p, is_available: !p.is_available }),
    });
    setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, is_available: !x.is_available } : x));
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((x) => x.id !== id));
    setDeleting(null);
  }

  // Group by category
  const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
    const cat = p.categories?.name ?? p.category_id;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Products</h1>
          <div style={{ fontSize: 12, color: "#444" }}>{products.length} total products</div>
        </div>
        <Link
          href="/admin/products/new"
          style={{
            background: "#E4002B", color: "#fff",
            padding: "9px 18px", borderRadius: 8,
            fontWeight: 700, fontSize: 13,
            textDecoration: "none",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          + Add Product
        </Link>
      </div>

      {loading && (
        <div style={{ color: "#555", textAlign: "center", padding: 60 }}>Loading products…</div>
      )}

      {error && (
        <div style={{
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 10, padding: "14px 18px", color: "#f87171", marginBottom: 20,
        }}>
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div style={{ textAlign: "center", padding: 80, color: "#444" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🍕</div>
          <div style={{ fontWeight: 600, color: "#666", marginBottom: 8 }}>No products yet</div>
          <Link href="/admin/products/new" style={{ color: "#E4002B", textDecoration: "none", fontSize: 13 }}>
            Add your first product →
          </Link>
        </div>
      )}

      {/* Grouped product list */}
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 32 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: "#555",
            letterSpacing: "0.12em", textTransform: "uppercase",
            marginBottom: 10, paddingBottom: 6,
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}>
            {cat} ({items.length})
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {items.map((p) => (
              <div
                key={p.id}
                style={{
                  background: "#0d0d0d",
                  border: `1px solid ${p.is_available ? "rgba(255,255,255,0.07)" : "rgba(239,68,68,0.15)"}`,
                  borderRadius: 10,
                  padding: "12px 16px",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                  gap: 12,
                  opacity: p.is_available ? 1 : 0.65,
                }}
              >
                {/* Left: info */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{p.name}</span>
                    {p.is_deal && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, background: "rgba(245,166,35,0.15)",
                        color: "#F5A623", border: "1px solid rgba(245,166,35,0.3)",
                        padding: "1px 6px", borderRadius: 4, letterSpacing: "0.08em",
                      }}>DEAL</span>
                    )}
                    {!p.is_available && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, background: "rgba(239,68,68,0.12)",
                        color: "#f87171", border: "1px solid rgba(239,68,68,0.2)",
                        padding: "1px 6px", borderRadius: 4,
                      }}>UNAVAILABLE</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>
                    Rs. {p.base_price.toLocaleString()}
                    {p.product_sizes && p.product_sizes.length > 0 && (
                      <span style={{ color: "#444" }}>
                        {" "}· {p.product_sizes.map((s) => `${s.label}: Rs.${s.price.toLocaleString()}`).join(", ")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  {/* Toggle available */}
                  <button
                    onClick={() => toggleAvailable(p)}
                    title={p.is_available ? "Mark unavailable" : "Mark available"}
                    style={{
                      background: p.is_available ? "rgba(34,197,94,0.1)" : "rgba(107,114,128,0.1)",
                      border: `1px solid ${p.is_available ? "rgba(34,197,94,0.25)" : "rgba(107,114,128,0.2)"}`,
                      color: p.is_available ? "#22c55e" : "#6b7280",
                      borderRadius: 6, padding: "5px 10px",
                      fontSize: 11, fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    {p.is_available ? "✓ Live" : "Off"}
                  </button>

                  {/* Edit */}
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#ccc", borderRadius: 6,
                      padding: "5px 10px", fontSize: 11,
                      fontWeight: 600, textDecoration: "none",
                    }}
                  >
                    Edit
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => deleteProduct(p.id)}
                    disabled={deleting === p.id}
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      color: "#f87171", borderRadius: 6,
                      padding: "5px 10px", fontSize: 11,
                      fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    {deleting === p.id ? "…" : "Delete"}
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
