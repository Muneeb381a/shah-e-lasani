"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  base_price: number;
  is_available: boolean;
  is_deal: boolean;
  category_id: string;
  image?: string;
  categories?: { name: string };
};

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <div style={{
      background: "#111", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12, padding: "20px 22px",
      borderLeft: `3px solid ${color}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: "#555", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
        <span style={{ color, opacity: 0.7 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{value}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  async function load() {
    const res = await fetch("/api/admin/products");
    if (res.ok) setProducts(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function setAvailability(p: Product, val: boolean) {
    setTogglingId(p.id);
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, is_available: val }),
    });
    setTogglingId(null);
    load();
  }

  async function del(id: string) {
    setDeleting(id);
    setConfirmDelete(null);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  }

  const categories = useMemo(() => {
    const seen = new Set<string>();
    const result: { id: string; name: string }[] = [];
    for (const p of products) {
      if (!seen.has(p.category_id)) {
        seen.add(p.category_id);
        result.push({ id: p.category_id, name: p.categories?.name ?? p.category_id });
      }
    }
    return result;
  }, [products]);

  const filtered = useMemo(() => products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter === "all" || p.category_id === catFilter;
    const matchStatus = statusFilter === "all"
      || (statusFilter === "available" && p.is_available)
      || (statusFilter === "hidden"    && !p.is_available);
    return matchSearch && matchCat && matchStatus;
  }), [products, search, catFilter, statusFilter]);

  const stats = {
    total:     products.length,
    available: products.filter((p) => p.is_available).length,
    hidden:    products.filter((p) => !p.is_available).length,
    deals:     products.filter((p) => p.is_deal).length,
  };

  const cell: React.CSSProperties = {
    padding: "13px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    fontSize: 13,
    verticalAlign: "middle",
  };

  return (
    <div>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff" }}>Products</h1>
          <p style={{ color: "#444", fontSize: 13, marginTop: 4 }}>Manage your menu items</p>
        </div>
        <Link
          href="/admin/products/new"
          style={{
            background: "#E4002B", color: "#fff",
            padding: "10px 20px", borderRadius: 8,
            fontWeight: 600, fontSize: 13,
            textDecoration: "none", display: "inline-flex",
            alignItems: "center", gap: 7,
            boxShadow: "0 4px 16px rgba(228,0,43,0.3)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Product
        </Link>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard label="Total Items" value={stats.total} color="#6366f1" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        } />
        <StatCard label="Available" value={stats.available} color="#22c55e" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        } />
        <StatCard label="Hidden" value={stats.hidden} color="#f59e0b" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        } />
        <StatCard label="Deals" value={stats.deals} color="#E4002B" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7m0 0H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
        } />
      </div>

      {/* ── Filters ── */}
      <div style={{
        display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center",
      }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 220px" }}>
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#444", pointerEvents: "none" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "8px 12px 8px 34px",
              background: "#111", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8, color: "#ddd", fontSize: 13,
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Category filter */}
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          style={{
            padding: "8px 12px", background: "#111",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, color: "#ddd", fontSize: 13,
            cursor: "pointer", outline: "none",
          }}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "8px 12px", background: "#111",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, color: "#ddd", fontSize: 13,
            cursor: "pointer", outline: "none",
          }}
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="hidden">Hidden</option>
        </select>

        <span style={{ color: "#444", fontSize: 12, marginLeft: 4 }}>
          {filtered.length} of {products.length}
        </span>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div style={{ color: "#444", textAlign: "center", paddingTop: 80, fontSize: 14 }}>Loading products…</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: "#333", textAlign: "center", paddingTop: 80, fontSize: 14 }}>No products found.</div>
      ) : (
        <div style={{ background: "#111", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                {["Product", "Category", "Price", "Status", "Actions"].map((h) => (
                  <th key={h} style={{
                    ...cell, color: "#444", fontWeight: 600,
                    fontSize: 11, textTransform: "uppercase",
                    letterSpacing: "0.1em", textAlign: "left",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  style={{ transition: "background 0.12s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,255,255,0.02)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
                >
                  {/* Name */}
                  <td style={cell}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {/* Image thumbnail */}
                      {p.image && (
                        <div style={{
                          width: 36, height: 36, borderRadius: 6, overflow: "hidden",
                          background: "#1a1a1a", flexShrink: 0,
                        }}>
                          <img src={p.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: "#fff", fontSize: 13 }}>{p.name}</div>
                        <div style={{ display: "flex", gap: 5, marginTop: 3 }}>
                          {p.is_deal && (
                            <span style={{
                              fontSize: 10, background: "rgba(228,0,43,0.15)",
                              color: "#E4002B", borderRadius: 4,
                              padding: "1px 6px", fontWeight: 700, letterSpacing: "0.05em",
                            }}>DEAL</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ ...cell, color: "#555", fontSize: 12 }}>
                    {p.categories?.name ?? p.category_id}
                  </td>

                  {/* Price */}
                  <td style={{ ...cell, color: "#E4002B", fontWeight: 700 }}>
                    Rs. {p.base_price.toLocaleString()}
                  </td>

                  {/* Status dropdown */}
                  <td style={cell}>
                    <select
                      value={p.is_available ? "available" : "hidden"}
                      disabled={togglingId === p.id}
                      onChange={(e) => setAvailability(p, e.target.value === "available")}
                      style={{
                        padding: "5px 10px",
                        borderRadius: 6,
                        border: `1px solid ${p.is_available ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.3)"}`,
                        background: p.is_available ? "rgba(34,197,94,0.08)" : "rgba(245,158,11,0.08)",
                        color: p.is_available ? "#4ade80" : "#fbbf24",
                        fontSize: 12, fontWeight: 600,
                        cursor: togglingId === p.id ? "wait" : "pointer",
                        outline: "none",
                        opacity: togglingId === p.id ? 0.5 : 1,
                        transition: "all 0.2s ease",
                      }}
                    >
                      <option value="available" style={{ background: "#1a1a1a", color: "#4ade80" }}>● Available</option>
                      <option value="hidden"    style={{ background: "#1a1a1a", color: "#fbbf24" }}>● Hidden</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td style={cell}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button
                        onClick={() => router.push(`/admin/products/${p.id}/edit`)}
                        title="Edit"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          color: "#aaa", border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: 6, padding: "6px 14px",
                          fontSize: 12, fontWeight: 600, cursor: "pointer",
                          display: "inline-flex", alignItems: "center", gap: 6,
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
                          (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                          (e.currentTarget as HTMLButtonElement).style.color = "#aaa";
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Edit
                      </button>

                      {confirmDelete === p.id ? (
                        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                          <span style={{ fontSize: 11, color: "#666" }}>Sure?</span>
                          <button
                            onClick={() => del(p.id)}
                            disabled={deleting === p.id}
                            style={{
                              background: "#E4002B", color: "#fff",
                              border: "none", borderRadius: 6,
                              padding: "6px 12px", fontSize: 12, fontWeight: 600,
                              cursor: "pointer", opacity: deleting === p.id ? 0.5 : 1,
                            }}
                          >
                            {deleting === p.id ? "…" : "Yes"}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            style={{
                              background: "rgba(255,255,255,0.06)",
                              color: "#aaa", border: "none",
                              borderRadius: 6, padding: "6px 10px",
                              fontSize: 12, cursor: "pointer",
                            }}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(p.id)}
                          title="Delete"
                          style={{
                            background: "rgba(228,0,43,0.08)",
                            color: "#E4002B", border: "1px solid rgba(228,0,43,0.15)",
                            borderRadius: 6, padding: "6px 10px",
                            fontSize: 12, cursor: "pointer",
                            display: "inline-flex", alignItems: "center",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(228,0,43,0.16)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(228,0,43,0.08)"; }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6m4-6v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
