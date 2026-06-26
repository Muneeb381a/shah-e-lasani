"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  base_price: number;
  is_available: boolean;
  is_deal: boolean;
  category_id: string;
  categories?: { name: string };
};

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/products");
    if (res.ok) setProducts(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleAvailable(p: Product) {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, is_available: !p.is_available }),
    });
    load();
  }

  async function del(id: string) {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  }

  const cell: React.CSSProperties = {
    padding: "12px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    fontSize: 14,
    color: "#ddd",
    verticalAlign: "middle",
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Products</h1>
          <div style={{ color: "#666", fontSize: 13, marginTop: 4 }}>
            {products.length} items in menu
          </div>
        </div>
        <Link
          href="/admin/products/new"
          style={{
            background: "#E4002B",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          + Add Product
        </Link>
      </div>

      {loading ? (
        <div style={{ color: "#555", textAlign: "center", paddingTop: 60, fontSize: 15 }}>Loading…</div>
      ) : (
        <div style={{ background: "#111", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                {["Name", "Category", "Price (Rs.)", "Available", "Actions"].map((h) => (
                  <th key={h} style={{ ...cell, color: "#666", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ transition: "background .1s" }}>
                  <td style={cell}>
                    <span style={{ fontWeight: 600, color: "#fff" }}>{p.name}</span>
                    {p.is_deal && (
                      <span style={{ marginLeft: 8, fontSize: 10, background: "#E4002B", color: "#fff", borderRadius: 4, padding: "2px 6px" }}>
                        DEAL
                      </span>
                    )}
                  </td>
                  <td style={{ ...cell, color: "#888" }}>{p.categories?.name ?? p.category_id}</td>
                  <td style={cell}>Rs. {p.base_price}</td>
                  <td style={cell}>
                    <button
                      onClick={() => toggleAvailable(p)}
                      style={{
                        background: p.is_available ? "rgba(22,163,74,0.15)" : "rgba(255,255,255,0.05)",
                        color:      p.is_available ? "#4ade80" : "#666",
                        border:     `1px solid ${p.is_available ? "rgba(22,163,74,0.3)" : "rgba(255,255,255,0.08)"}`,
                        borderRadius: 6,
                        padding: "4px 10px",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {p.is_available ? "Available" : "Hidden"}
                    </button>
                  </td>
                  <td style={cell}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => router.push(`/admin/products/${p.id}/edit`)}
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          color: "#ddd",
                          border: "none",
                          borderRadius: 6,
                          padding: "6px 12px",
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => del(p.id)}
                        disabled={deleting === p.id}
                        style={{
                          background: "rgba(228,0,43,0.1)",
                          color: "#ff4d4d",
                          border: "none",
                          borderRadius: 6,
                          padding: "6px 12px",
                          fontSize: 13,
                          cursor: "pointer",
                          opacity: deleting === p.id ? 0.5 : 1,
                        }}
                      >
                        Delete
                      </button>
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
