"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Size = { label: string; price: number };

export type ProductFormData = {
  name:           string;
  description:    string;
  base_price:     number;
  original_price: number | null;
  is_available:   boolean;
  is_deal:        boolean;
  category_id:    string;
  image:          string | null;
  sizes:          Size[];
};

const CATEGORIES = [
  { id: "cat-deals",  name: "Deals"   },
  { id: "cat-pizza",  name: "Pizza"   },
  { id: "cat-burger", name: "Burger"  },
  { id: "cat-wings",  name: "Wings"   },
  { id: "cat-sides",  name: "Sides"   },
  { id: "cat-drinks", name: "Drinks"  },
];

const EMPTY: ProductFormData = {
  name: "", description: "", base_price: 0, original_price: null,
  is_available: true, is_deal: false, category_id: "cat-pizza",
  image: null, sizes: [],
};

type Props = {
  initial?:   Partial<ProductFormData>;
  productId?: string;
  mode:       "new" | "edit";
};

export default function ProductForm({ initial, productId, mode }: Props) {
  const router    = useRouter();
  const fileRef   = useRef<HTMLInputElement>(null);

  const [form,      setForm]      = useState<ProductFormData>({ ...EMPTY, ...initial });
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState("");
  const [urlMode,   setUrlMode]   = useState(false);

  function field(key: keyof ProductFormData, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // ── Image upload ────────────────────────────────────────────
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      field("image", data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  // ── Sizes ────────────────────────────────────────────────────
  function addSize() {
    setForm((f) => ({ ...f, sizes: [...f.sizes, { label: "", price: 0 }] }));
  }
  function updateSize(i: number, key: keyof Size, value: string | number) {
    setForm((f) => {
      const sizes = [...f.sizes];
      sizes[i] = { ...sizes[i], [key]: value };
      return { ...f, sizes };
    });
  }
  function removeSize(i: number) {
    setForm((f) => ({ ...f, sizes: f.sizes.filter((_, idx) => idx !== i) }));
  }

  // ── Submit ───────────────────────────────────────────────────
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url    = mode === "new" ? "/api/admin/products" : `/api/admin/products/${productId}`;
    const method = mode === "new" ? "POST" : "PUT";
    const res    = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const d = await res.json();
      setError(d.error ?? "Save failed");
      setSaving(false);
    }
  }

  // ── Styles ───────────────────────────────────────────────────
  const inp: React.CSSProperties = {
    background: "#0a0a0a",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: "11px 14px",
    color: "#fff",
    fontSize: 14,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
  };
  const lbl: React.CSSProperties = {
    fontSize: 12, color: "#888", fontWeight: 600,
    letterSpacing: "0.08em", textTransform: "uppercase",
    display: "block", marginBottom: 8,
  };
  const sectionCard: React.CSSProperties = {
    background: "#0d0d0d",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 12,
    padding: "20px 22px",
    display: "flex", flexDirection: "column", gap: 14,
  };

  const hasImage = !!form.image;

  return (
    <form onSubmit={submit} style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 18 }}>

      {/* ── IMAGE UPLOAD ─────────────────────────────── */}
      <div style={sectionCard}>
        <label style={lbl}>Product Image</label>

        {/* Preview / drop zone */}
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          style={{
            height: 200,
            borderRadius: 10,
            border: hasImage ? "none" : "2px dashed rgba(255,255,255,0.12)",
            background: hasImage ? "#000" : "#080808",
            cursor: uploading ? "wait" : "pointer",
            position: "relative",
            overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {hasImage ? (
            <Image
              src={form.image!}
              alt="Product preview"
              fill
              sizes="560px"
              style={{ objectFit: "cover", opacity: uploading ? 0.4 : 1 }}
              unoptimized={form.image!.includes("supabase.co")}
            />
          ) : (
            <div style={{ textAlign: "center", pointerEvents: "none" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
              <div style={{ color: "#555", fontSize: 13 }}>Click to upload photo</div>
              <div style={{ color: "#333", fontSize: 11, marginTop: 4 }}>JPG, PNG, WEBP — max 5 MB</div>
            </div>
          )}

          {/* Uploading overlay */}
          {uploading && (
            <div style={{
              position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: 10,
            }}>
              <div style={{ fontSize: 26 }}>⏳</div>
              <div style={{ color: "#fff", fontSize: 13 }}>Uploading…</div>
            </div>
          )}

          {/* Change button when image exists */}
          {hasImage && !uploading && (
            <div style={{
              position: "absolute", bottom: 10, right: 10,
              display: "flex", gap: 8,
            }}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                style={{
                  background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 7, padding: "6px 12px",
                  color: "#fff", fontSize: 12, cursor: "pointer",
                }}
              >
                ✏️ Change
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); field("image", null); }}
                style={{
                  background: "rgba(228,0,43,0.75)", backdropFilter: "blur(6px)",
                  border: "1px solid rgba(228,0,43,0.4)",
                  borderRadius: 7, padding: "6px 12px",
                  color: "#fff", fontSize: 12, cursor: "pointer",
                }}
              >
                🗑 Remove
              </button>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* URL paste toggle */}
        <div>
          <button
            type="button"
            onClick={() => setUrlMode((v) => !v)}
            style={{
              background: "transparent", border: "none",
              color: "#555", fontSize: 12, cursor: "pointer",
              padding: 0, textDecoration: "underline",
            }}
          >
            {urlMode ? "Hide URL field" : "Or paste an image URL instead"}
          </button>
          {urlMode && (
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <input
                style={{ ...inp, flex: 1, fontSize: 13 }}
                placeholder="https://…"
                value={form.image ?? ""}
                onChange={(e) => field("image", e.target.value || null)}
              />
              {hasImage && (
                <button
                  type="button"
                  onClick={() => field("image", null)}
                  style={{
                    background: "rgba(228,0,43,0.1)", border: "none",
                    borderRadius: 8, color: "#ff4d4d",
                    fontSize: 18, width: 40, cursor: "pointer", flexShrink: 0,
                  }}
                >×</button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── BASIC INFO ───────────────────────────────── */}
      <div style={sectionCard}>
        <label style={lbl}>Basic Info</label>

        <div>
          <label style={{ ...lbl, marginBottom: 6 }}>Product Name *</label>
          <input style={inp} value={form.name} onChange={(e) => field("name", e.target.value)} required />
        </div>

        <div>
          <label style={{ ...lbl, marginBottom: 6 }}>Description</label>
          <textarea
            style={{ ...inp, height: 80, resize: "vertical" }}
            value={form.description}
            onChange={(e) => field("description", e.target.value)}
          />
        </div>

        <div>
          <label style={{ ...lbl, marginBottom: 6 }}>Category *</label>
          <select
            style={{ ...inp, cursor: "pointer" }}
            value={form.category_id}
            onChange={(e) => field("category_id", e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id} style={{ background: "#111" }}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── PRICING ──────────────────────────────────── */}
      <div style={sectionCard}>
        <label style={lbl}>Pricing</label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={{ ...lbl, marginBottom: 6 }}>Base Price (Rs.) *</label>
            <input
              style={inp} type="number" min={0} value={form.base_price}
              onChange={(e) => field("base_price", Number(e.target.value))} required
            />
          </div>
          <div>
            <label style={{ ...lbl, marginBottom: 6 }}>Original Price — for strikethrough</label>
            <input
              style={inp} type="number" min={0}
              value={form.original_price ?? ""}
              onChange={(e) => field("original_price", e.target.value ? Number(e.target.value) : null)}
            />
          </div>
        </div>

        {/* Toggles */}
        <div style={{ display: "flex", gap: 24, paddingTop: 6 }}>
          {(["is_available", "is_deal"] as const).map((key) => {
            const on = form[key] as boolean;
            return (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                {/* Toggle switch */}
                <div
                  onClick={() => field(key, !on)}
                  style={{
                    width: 40, height: 22, borderRadius: 11,
                    background: on ? (key === "is_available" ? "#16a34a" : "#E4002B") : "#2a2a2a",
                    position: "relative", transition: "background 0.2s", flexShrink: 0,
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div style={{
                    position: "absolute", top: 2, left: on ? 19 : 2,
                    width: 16, height: 16, borderRadius: "50%",
                    background: "#fff", transition: "left 0.2s",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
                  }} />
                </div>
                <span style={{ fontSize: 13, color: on ? "#ccc" : "#666" }}>
                  {key === "is_available" ? "Available on menu" : "Mark as Deal"}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ── SIZES ────────────────────────────────────── */}
      <div style={sectionCard}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <label style={{ ...lbl, marginBottom: 0 }}>Sizes & Prices</label>
          <button
            type="button" onClick={addSize}
            style={{
              background: "rgba(228,0,43,0.12)",
              border: "1px solid rgba(228,0,43,0.25)",
              borderRadius: 7, color: "#ff6b6b",
              fontSize: 12, fontWeight: 600, padding: "5px 12px", cursor: "pointer",
            }}
          >
            + Add Size
          </button>
        </div>

        {form.sizes.length === 0 && (
          <div style={{ color: "#444", fontSize: 12, textAlign: "center", padding: "10px 0" }}>
            No sizes — single price above will be used
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {form.sizes.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                style={{ ...inp, flex: 1 }}
                placeholder="Size label (e.g. Small)"
                value={s.label}
                onChange={(e) => updateSize(i, "label", e.target.value)}
              />
              <input
                style={{ ...inp, width: 120 }}
                type="number" min={0} placeholder="Price (Rs.)"
                value={s.price}
                onChange={(e) => updateSize(i, "price", Number(e.target.value))}
              />
              <button
                type="button" onClick={() => removeSize(i)}
                style={{
                  background: "rgba(228,0,43,0.1)", border: "1px solid rgba(228,0,43,0.2)",
                  borderRadius: 7, color: "#ff4d4d", fontSize: 18,
                  width: 36, height: 36, cursor: "pointer", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >×</button>
            </div>
          ))}
        </div>
      </div>

      {/* ── ERROR ────────────────────────────────────── */}
      {error && (
        <div style={{
          background: "rgba(228,0,43,0.12)",
          border: "1px solid rgba(228,0,43,0.3)",
          borderRadius: 8, padding: "10px 14px", color: "#ff4d4d", fontSize: 13,
        }}>
          {error}
        </div>
      )}

      {/* ── ACTIONS ──────────────────────────────────── */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="submit" disabled={saving || uploading}
          style={{
            background: "#E4002B", color: "#fff", border: "none",
            borderRadius: 10, padding: "13px 28px",
            fontSize: 15, fontWeight: 700,
            cursor: (saving || uploading) ? "not-allowed" : "pointer",
            opacity: (saving || uploading) ? 0.6 : 1,
          }}
        >
          {saving ? "Saving…" : mode === "new" ? "Create Product" : "Save Changes"}
        </button>
        <button
          type="button" onClick={() => router.back()}
          style={{
            background: "transparent", color: "#777",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, padding: "13px 20px",
            fontSize: 14, cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
