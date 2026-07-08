"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ChoiceSection, PizzaGroup } from "@/lib/deal-config";

// ── Pizza flavor data ────────────────────────────────────────────────
const CLASSIC   = ["Tikka Pizza", "Fajita Pizza", "Hot & Spicy Pizza", "BBQ Pizza"];
const SIGNATURE = ["Malai Boti Pizza", "Doner Malai Pizza", "Crown Crust Pizza", "Kabab Crust Pizza", "Kababish Pizza"];
const DEEP_PAN  = ["Hot & Spicy Deep Pan", "Malai Deep Pan", "Behari Kabab Deep Pan", "Kababish Deep Pan"];
const DRINKS    = ["Pepsi", "7UP", "Mirinda", "Sting", "Next Cola"];
const FRIES_OPT = ["Plain Fries", "Honey Mustard Fries", "Lasani Fries", "Loaded Fries", "Kababish Fries"];
const WINGS_OPT = ["Chilli Garlic", "Tandoori", "Honey Garlic", "Garlic Mayo", "Hot Wings"];
const PASTA_OPT = ["Crispy Pasta", "Creamy Pasta", "Kababish Pasta"];

const PIZZA_DATA: Record<"Small" | "Medium" | "Large", { options: string[]; groups: PizzaGroup[] }> = {
  Small: {
    options: [...CLASSIC],
    groups:  [{ title: "Classic", items: CLASSIC }],
  },
  Medium: {
    options: [...CLASSIC, ...SIGNATURE],
    groups:  [{ title: "Classic", items: CLASSIC }, { title: "Signature", items: SIGNATURE }],
  },
  Large: {
    options: [...CLASSIC, ...SIGNATURE, ...DEEP_PAN],
    groups:  [
      { title: "Classic",   items: CLASSIC },
      { title: "Signature", items: SIGNATURE },
      { title: "Deep Pan",  items: DEEP_PAN },
    ],
  },
};

const KIND_COLOR: Record<string, string> = {
  pizza: "#E4002B", drink: "#0284c7", wings: "#7c3aed", fries: "#d97706", pasta: "#ea580c",
};
const KIND_LABEL: Record<string, string> = {
  pizza: "Pizza", drink: "Drink", wings: "Wings", fries: "Fries", pasta: "Pasta",
};
const KIND_OPTIONS: Record<string, string[]> = {
  drink: DRINKS, wings: WINGS_OPT, fries: FRIES_OPT, pasta: PASTA_OPT,
};

// ── Types ─────────────────────────────────────────────────────────────
type Size = { label: string; price: number };

type DealSectionDraft = {
  draftId:   string;
  kind:      "pizza" | "drink" | "wings" | "fries" | "pasta";
  key:       string;
  label:     string;
  pizzaSize: "Small" | "Medium" | "Large";
};

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
  deal_config:    ChoiceSection[] | null;
};

const CATEGORIES = [
  { id: "cat-deals",     name: "Deals"           },
  { id: "cat-pizza",     name: "Pizza"           },
  { id: "cat-burger",    name: "Burgers"         },
  { id: "cat-crunchy",   name: "Crunchy / Wings" },
  { id: "cat-fries",     name: "Fries"           },
  { id: "cat-wrap",      name: "Wraps & Rolls"   },
  { id: "cat-pasta",     name: "Pasta"           },
  { id: "cat-slice",     name: "Slice & Stick"   },
  { id: "cat-serving",   name: "Serving Items"   },
  { id: "cat-beverages", name: "Beverages"       },
  { id: "cat-cold",      name: "Cold Drinks"     },
];

const EMPTY: ProductFormData = {
  name: "", description: "", base_price: 0, original_price: null,
  is_available: true, is_deal: false, category_id: "cat-pizza",
  image: null, sizes: [], deal_config: null,
};

// ── Conversions ───────────────────────────────────────────────────────
function toDrafts(sections: ChoiceSection[]): DealSectionDraft[] {
  return sections.map((sec) => {
    let pizzaSize: "Small" | "Medium" | "Large" = "Large";
    if (sec.kind === "pizza") {
      const n = sec.options.length;
      if (n <= 4) pizzaSize = "Small";
      else if (n <= 9) pizzaSize = "Medium";
    }
    return {
      draftId: `${Date.now()}-${Math.random()}`,
      kind: sec.kind, key: sec.key, label: sec.label, pizzaSize,
    };
  });
}

function toChoiceSections(drafts: DealSectionDraft[]): ChoiceSection[] {
  return drafts.map((d) => {
    if (d.kind === "pizza") {
      const pd = PIZZA_DATA[d.pizzaSize];
      return { kind: "pizza" as const, key: d.key, label: d.label, options: pd.options, groups: pd.groups };
    }
    if (d.kind === "drink") return { kind: "drink" as const, key: "drink",  label: d.label, options: DRINKS    };
    if (d.kind === "fries") return { kind: "fries" as const, key: "fries",  label: d.label, options: FRIES_OPT };
    if (d.kind === "wings") return { kind: "wings" as const, key: d.key,    label: d.label, options: WINGS_OPT };
    return                         { kind: "pasta" as const, key: "pasta",  label: d.label, options: PASTA_OPT };
  });
}

// ── Component ─────────────────────────────────────────────────────────
type Props = {
  initial?:   Partial<ProductFormData>;
  productId?: string;
  mode:       "new" | "edit";
};

export default function ProductForm({ initial, productId, mode }: Props) {
  const router  = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form,         setForm]         = useState<ProductFormData>({ ...EMPTY, ...initial });
  const [dealSections, setDealSections] = useState<DealSectionDraft[]>(
    initial?.deal_config ? toDrafts(initial.deal_config) : []
  );
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState("");
  const [urlMode,   setUrlMode]   = useState(false);

  function field(key: keyof ProductFormData, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // ── Image upload ──────────────────────────────────────────────
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res  = await fetch("/api/admin/upload", { method: "POST", body: fd });
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

  // ── Sizes ─────────────────────────────────────────────────────
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

  // ── Deal sections ─────────────────────────────────────────────
  function addSection(kind: DealSectionDraft["kind"]) {
    setDealSections((prev) => {
      const pizzaCount = prev.filter((s) => s.kind === "pizza").length;
      const wingsCount = prev.filter((s) => s.kind === "wings").length;
      const key =
        kind === "pizza" ? `pizza${pizzaCount + 1}` :
        kind === "wings" ? `wings${wingsCount + 1}` : kind;
      const defaultLabel =
        kind === "pizza" ? `Pizza ${pizzaCount + 1} — Large` :
        kind === "drink" ? "Choose Your Drink" :
        kind === "fries" ? "Choose Your Fries" :
        kind === "wings" ? `Wings Flavor${wingsCount > 0 ? ` (${wingsCount + 1})` : ""}` :
        "Choose Pasta Type";
      return [...prev, { draftId: `${Date.now()}-${Math.random()}`, kind, key, label: defaultLabel, pizzaSize: "Large" }];
    });
  }

  function updateSection(draftId: string, patch: Partial<DealSectionDraft>) {
    setDealSections((prev) =>
      prev.map((s) => {
        if (s.draftId !== draftId) return s;
        const updated = { ...s, ...patch };
        if (patch.pizzaSize && s.kind === "pizza") {
          const m = s.label.match(/^Pizza (\d+)/);
          if (m) updated.label = `Pizza ${m[1]} — ${patch.pizzaSize}`;
        }
        return updated;
      })
    );
  }

  function removeSection(draftId: string) {
    setDealSections((prev) => prev.filter((s) => s.draftId !== draftId));
  }

  // ── Submit ────────────────────────────────────────────────────
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const deal_config = form.is_deal && dealSections.length > 0
      ? toChoiceSections(dealSections)
      : null;
    const url    = mode === "new" ? "/api/admin/products" : `/api/admin/products/${productId}`;
    const method = mode === "new" ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, deal_config }),
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

  const inp: React.CSSProperties = {
    background: "#111", border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 9, padding: "11px 14px", color: "#fff", fontSize: 14,
    width: "100%", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s",
  };
  const lbl: React.CSSProperties = {
    fontSize: 11, color: "#555", fontWeight: 700, letterSpacing: "0.12em",
    textTransform: "uppercase", display: "block", marginBottom: 8,
  };
  const card: React.CSSProperties = {
    background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14, padding: "22px 24px",
  };
  const hasImage   = !!form.image;
  const totalPrice = form.sizes.length > 0
    ? `Rs. ${Math.min(...form.sizes.map(s => s.price)).toLocaleString()} – Rs. ${Math.max(...form.sizes.map(s => s.price)).toLocaleString()}`
    : `Rs. ${(form.base_price || 0).toLocaleString()}`;

  const KIND_ICON: Record<string, string> = { pizza: "🍕", drink: "🥤", wings: "🍗", fries: "🍟", pasta: "🍝" };

  function Toggle({ on, onChange, label, activeColor = "#16a34a" }: { on: boolean; onChange: () => void; label: string; activeColor?: string }) {
    return (
      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
        <div onClick={onChange} style={{
          width: 42, height: 24, borderRadius: 12,
          background: on ? activeColor : "#222",
          position: "relative", transition: "background 0.2s", flexShrink: 0,
          border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer",
        }}>
          <div style={{
            position: "absolute", top: 3, left: on ? 20 : 3,
            width: 16, height: 16, borderRadius: "50%", background: "#fff",
            transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.6)",
          }} />
        </div>
        <span style={{ fontSize: 13, color: on ? "#ccc" : "#555" }}>{label}</span>
      </label>
    );
  }

  function SectionHead({ icon, title }: { icon: string; title: string }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: "rgba(228,0,43,0.1)", border: "1px solid rgba(228,0,43,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
        }}>{icon}</div>
        <span style={{ fontWeight: 700, color: "#ddd", fontSize: 14 }}>{title}</span>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>

      {/* ══════════════ LEFT COLUMN — FORM ══════════════ */}
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ── 1. BASIC INFO ── */}
        <div style={card}>
          <SectionHead icon="📝" title="Basic Information" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            <div>
              <label style={lbl}>Product Name *</label>
              <input style={inp} value={form.name} placeholder="e.g. Lasani Deal, Tikka Pizza"
                onChange={(e) => field("name", e.target.value)}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(228,0,43,0.5)"; }}
                onBlur={(e)  => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.09)"; }}
                required />
            </div>

            <div>
              <label style={lbl}>Short Description</label>
              <textarea
                style={{ ...inp, height: 72, resize: "none" }}
                value={form.description}
                placeholder="Customer ko kya dikhana hai (optional)"
                onChange={(e) => field("description", e.target.value)}
                onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "rgba(228,0,43,0.5)"; }}
                onBlur={(e)  => { (e.target as HTMLTextAreaElement).style.borderColor = "rgba(255,255,255,0.09)"; }}
              />
            </div>

            {/* Category grid */}
            <div>
              <label style={lbl}>Category *</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 7 }}>
                {CATEGORIES.map((c) => {
                  const active = form.category_id === c.id;
                  return (
                    <button
                      key={c.id} type="button"
                      onClick={() => field("category_id", c.id)}
                      style={{
                        padding: "8px 10px", borderRadius: 9, fontSize: 12, fontWeight: 600,
                        cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                        border: `1px solid ${active ? "rgba(228,0,43,0.5)" : "rgba(255,255,255,0.07)"}`,
                        background: active ? "rgba(228,0,43,0.12)" : "#111",
                        color: active ? "#ff6b6b" : "#555",
                      }}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. IMAGE ── */}
        <div style={card}>
          <SectionHead icon="🖼️" title="Product Image" />
          <div
            onClick={() => !uploading && !urlMode && fileRef.current?.click()}
            style={{
              height: 180, borderRadius: 10, overflow: "hidden",
              border: hasImage ? "1px solid rgba(255,255,255,0.08)" : "2px dashed rgba(255,255,255,0.1)",
              background: hasImage ? "#000" : "#0a0a0a",
              cursor: uploading ? "wait" : urlMode ? "default" : "pointer",
              position: "relative",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {hasImage ? (
              <Image src={form.image!} alt="preview" fill sizes="560px"
                style={{ objectFit: "cover", opacity: uploading ? 0.3 : 1 }}
                unoptimized={form.image!.startsWith("http")} />
            ) : (
              <div style={{ textAlign: "center", color: "#333", pointerEvents: "none" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                <div style={{ fontSize: 13, color: "#444" }}>Click karein ya URL paste karein</div>
                <div style={{ fontSize: 11, color: "#2a2a2a", marginTop: 4 }}>JPG · PNG · WEBP · max 5MB</div>
              </div>
            )}
            {uploading && (
              <div style={{
                position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                <div style={{ fontSize: 24 }}>⏳</div>
                <div style={{ color: "#fff", fontSize: 12 }}>Upload ho raha hai…</div>
              </div>
            )}
            {hasImage && !uploading && (
              <div style={{ position: "absolute", bottom: 10, right: 10, display: "flex", gap: 7 }}>
                <button type="button" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                  style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 7, padding: "5px 12px", color: "#fff", fontSize: 11, cursor: "pointer" }}>
                  ✏️ Badlein
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); field("image", null); }}
                  style={{ background: "rgba(228,0,43,0.85)", backdropFilter: "blur(8px)", border: "none", borderRadius: 7, padding: "5px 12px", color: "#fff", fontSize: 11, cursor: "pointer" }}>
                  🗑 Hatayein
                </button>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" style={{ display: "none" }} onChange={handleFileChange} />

          <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
            <button type="button" onClick={() => setUrlMode((v) => !v)}
              style={{ background: "none", border: "none", color: urlMode ? "#E4002B" : "#444", fontSize: 12, cursor: "pointer", padding: 0 }}>
              {urlMode ? "▲ URL chhupayein" : "▼ Ya URL se lagayein"}
            </button>
          </div>
          {urlMode && (
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <input style={{ ...inp, flex: 1, fontSize: 13 }} placeholder="https://example.com/image.jpg"
                value={form.image ?? ""} onChange={(e) => field("image", e.target.value || null)} />
              {hasImage && (
                <button type="button" onClick={() => field("image", null)}
                  style={{ background: "rgba(228,0,43,0.1)", border: "none", borderRadius: 8, color: "#ff4d4d", fontSize: 20, width: 40, cursor: "pointer", flexShrink: 0 }}>×</button>
              )}
            </div>
          )}
        </div>

        {/* ── 3. PRICING ── */}
        <div style={card}>
          <SectionHead icon="💰" title="Pricing" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={lbl}>Base Price (Rs.) *</label>
                <input style={inp} type="number" min={0} value={form.base_price}
                  onChange={(e) => field("base_price", Number(e.target.value))}
                  onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(228,0,43,0.5)"; }}
                  onBlur={(e)  => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.09)"; }}
                  required />
                <div style={{ fontSize: 10, color: "#333", marginTop: 4 }}>Single price ya sizes ka minimum</div>
              </div>
              <div>
                <label style={lbl}>Original Price (strike-through)</label>
                <input style={inp} type="number" min={0} placeholder="Optional — purani price"
                  value={form.original_price ?? ""}
                  onChange={(e) => field("original_price", e.target.value ? Number(e.target.value) : null)}
                  onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(228,0,43,0.5)"; }}
                  onBlur={(e)  => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.09)"; }}
                />
                <div style={{ fontSize: 10, color: "#333", marginTop: 4 }}>Menu pe <s>Rs. X</s> dikhe ga</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Toggle on={form.is_available} onChange={() => field("is_available", !form.is_available)}
                label="Menu pe available hai" activeColor="#16a34a" />
              <Toggle on={form.is_deal} onChange={() => field("is_deal", !form.is_deal)}
                label="Yeh ek Deal hai (customization steps honge)" activeColor="#E4002B" />
            </div>
          </div>
        </div>

        {/* ── 4. SIZES ── */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: "rgba(228,0,43,0.1)", border: "1px solid rgba(228,0,43,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
              }}>📏</div>
              <div>
                <span style={{ fontWeight: 700, color: "#ddd", fontSize: 14 }}>Sizes & Prices</span>
                <div style={{ fontSize: 10, color: "#444", marginTop: 1 }}>
                  {form.sizes.length === 0 ? "Sirf base price use hogi" : `${form.sizes.length} size${form.sizes.length > 1 ? "s" : ""}`}
                </div>
              </div>
            </div>
            <button type="button" onClick={addSize}
              style={{
                background: "rgba(228,0,43,0.1)", border: "1px solid rgba(228,0,43,0.2)",
                borderRadius: 8, color: "#ff6b6b", fontSize: 12, fontWeight: 700,
                padding: "6px 14px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 5,
              }}>
              + Size Add Karein
            </button>
          </div>

          {form.sizes.length === 0 ? (
            <div style={{
              border: "1px dashed rgba(255,255,255,0.07)", borderRadius: 10,
              padding: "20px", textAlign: "center", color: "#333", fontSize: 12,
            }}>
              Koi size nahi — upar wali base price use hogi
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 36px", gap: 8 }}>
                <div style={{ fontSize: 10, color: "#444", fontWeight: 700, letterSpacing: "0.1em", paddingLeft: 4 }}>SIZE NAME</div>
                <div style={{ fontSize: 10, color: "#444", fontWeight: 700, letterSpacing: "0.1em", paddingLeft: 4 }}>PRICE (RS.)</div>
                <div />
              </div>
              {form.sizes.map((s, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 140px 36px", gap: 8, alignItems: "center" }}>
                  <input style={inp} placeholder="e.g. Small, Medium, Large"
                    value={s.label} onChange={(e) => updateSize(i, "label", e.target.value)} />
                  <input style={{ ...inp, textAlign: "right" }} type="number" min={0} placeholder="0"
                    value={s.price} onChange={(e) => updateSize(i, "price", Number(e.target.value))} />
                  <button type="button" onClick={() => removeSize(i)}
                    style={{
                      background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
                      borderRadius: 8, color: "#f87171", width: 36, height: 42,
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                    }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 5. DEAL CUSTOMIZATION ── */}
        {form.is_deal && (
          <div style={{ ...card, borderColor: "rgba(228,0,43,0.2)" }}>
            <SectionHead icon="🎁" title="Deal Customization Steps" />
            <p style={{ fontSize: 12, color: "#555", margin: "0 0 16px", lineHeight: 1.6 }}>
              Customer order karte waqt in steps se guzrein ga. Har step mein ek choice select karega.
            </p>

            {/* Customer journey preview */}
            {dealSections.length > 0 && (
              <div style={{
                background: "#080808", borderRadius: 10, padding: "12px 14px", marginBottom: 16,
                border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div style={{ fontSize: 10, color: "#444", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>
                  CUSTOMER JOURNEY PREVIEW
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  {dealSections.map((sec, i) => (
                    <div key={sec.draftId} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{
                        background: `${KIND_COLOR[sec.kind]}18`,
                        border: `1px solid ${KIND_COLOR[sec.kind]}44`,
                        borderRadius: 6, padding: "4px 10px",
                        fontSize: 11, color: KIND_COLOR[sec.kind], fontWeight: 600,
                        display: "flex", alignItems: "center", gap: 5,
                      }}>
                        <span>{KIND_ICON[sec.kind]}</span>
                        <span>Step {i + 1}: {sec.kind === "pizza" ? `${sec.pizzaSize} Pizza` : KIND_LABEL[sec.kind]}</span>
                      </div>
                      {i < dealSections.length - 1 && (
                        <span style={{ color: "#333", fontSize: 14 }}>→</span>
                      )}
                    </div>
                  ))}
                  <span style={{ color: "#2a2a2a", fontSize: 11, marginLeft: 4 }}>→ Cart</span>
                </div>
              </div>
            )}

            {/* Steps */}
            {dealSections.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "24px 0", color: "#333", fontSize: 12,
                border: "1px dashed rgba(255,255,255,0.06)", borderRadius: 10, marginBottom: 14,
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🎁</div>
                Abhi koi step nahi — customers deal seedha cart mein dalenge
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                {dealSections.map((sec, idx) => {
                  const color = KIND_COLOR[sec.kind];
                  const opts  = sec.kind === "pizza"
                    ? PIZZA_DATA[sec.pizzaSize].options
                    : KIND_OPTIONS[sec.kind];
                  return (
                    <div key={sec.draftId} style={{
                      background: "#080808",
                      border: `1px solid ${color}30`,
                      borderLeft: `3px solid ${color}`,
                      borderRadius: 10, padding: "14px 16px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: "50%",
                          background: color, color: "#fff",
                          fontSize: 12, fontWeight: 800,
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>{idx + 1}</div>
                        <span style={{ fontSize: 16 }}>{KIND_ICON[sec.kind]}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                          color, background: `${color}18`, padding: "2px 8px", borderRadius: 5,
                        }}>{KIND_LABEL[sec.kind].toUpperCase()}</span>
                        <input
                          style={{ ...inp, flex: 1, padding: "7px 11px", fontSize: 12 }}
                          value={sec.label}
                          onChange={(e) => updateSection(sec.draftId, { label: e.target.value })}
                          placeholder="Customer ko label (e.g. Apni Pizza choose karein)"
                        />
                        <button type="button" onClick={() => removeSection(sec.draftId)}
                          style={{
                            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
                            borderRadius: 7, color: "#f87171", width: 30, height: 30,
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 17, flexShrink: 0,
                          }}>×</button>
                      </div>

                      {sec.kind === "pizza" && (
                        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                          {(["Small", "Medium", "Large"] as const).map((sz) => {
                            const active = sec.pizzaSize === sz;
                            const cnt    = sz === "Small" ? 4 : sz === "Medium" ? 9 : 13;
                            return (
                              <button key={sz} type="button"
                                onClick={() => updateSection(sec.draftId, { pizzaSize: sz })}
                                style={{
                                  flex: 1, padding: "8px 6px", borderRadius: 8, cursor: "pointer",
                                  border: `1px solid ${active ? color : "rgba(255,255,255,0.07)"}`,
                                  background: active ? `${color}18` : "transparent",
                                  color: active ? color : "#444",
                                  fontSize: 11, fontWeight: 600, transition: "all 0.15s", lineHeight: 1.6,
                                }}>
                                {sz}<br />
                                <span style={{ fontSize: 9, opacity: 0.7 }}>{cnt} flavors</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <div style={{
                        fontSize: 10, color: "#2e2e2e",
                        background: "rgba(255,255,255,0.02)", borderRadius: 6, padding: "6px 10px",
                      }}>
                        <span style={{ color: "#383838", fontWeight: 600 }}>{opts.length} options: </span>
                        {opts.join(" · ")}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add step buttons */}
            <div>
              <div style={{ fontSize: 10, color: "#444", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>
                STEP ADD KAREIN
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(["pizza", "drink", "wings", "fries", "pasta"] as const).map((kind) => (
                  <button key={kind} type="button" onClick={() => addSection(kind)}
                    style={{
                      background: `${KIND_COLOR[kind]}10`,
                      border: `1px solid ${KIND_COLOR[kind]}35`,
                      borderRadius: 8, color: KIND_COLOR[kind],
                      fontSize: 12, fontWeight: 700, padding: "8px 16px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
                    }}>
                    <span>{KIND_ICON[kind]}</span> {KIND_LABEL[kind]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ERROR ── */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 10, padding: "12px 16px", color: "#f87171", fontSize: 13,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* ── ACTIONS ── */}
        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" disabled={saving || uploading}
            style={{
              flex: 1, background: (saving || uploading) ? "#555" : "linear-gradient(135deg,#E4002B,#c0001f)",
              color: "#fff", border: "none", borderRadius: 10, padding: "13px",
              fontSize: 15, fontWeight: 700, cursor: (saving || uploading) ? "not-allowed" : "pointer",
              boxShadow: (saving || uploading) ? "none" : "0 4px 16px rgba(228,0,43,0.3)",
              transition: "all 0.2s",
            }}>
            {saving ? "Save ho raha hai…" : mode === "new" ? "✓ Product Banayein" : "✓ Changes Save Karein"}
          </button>
          <button type="button" onClick={() => router.back()}
            style={{
              background: "transparent", color: "#666", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10, padding: "13px 20px", fontSize: 14, cursor: "pointer",
            }}>
            Wapas
          </button>
        </div>
      </form>

      {/* ══════════════ RIGHT COLUMN — LIVE PREVIEW ══════════════ */}
      <div style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Preview card */}
        <div style={{
          background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14, overflow: "hidden",
        }}>
          <div style={{ fontSize: 10, color: "#444", fontWeight: 700, letterSpacing: "0.14em", padding: "12px 16px 0" }}>
            MENU PREVIEW
          </div>

          {/* Product image */}
          <div style={{ height: 160, background: "#080808", position: "relative", margin: "12px 16px 0", borderRadius: 10, overflow: "hidden" }}>
            {hasImage ? (
              <Image src={form.image!} alt="preview" fill sizes="320px"
                style={{ objectFit: "cover" }} unoptimized={form.image!.startsWith("http")} />
            ) : (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#222", fontSize: 40 }}>
                🍕
              </div>
            )}
            {form.is_deal && (
              <div style={{
                position: "absolute", top: 8, left: 8,
                background: "#E4002B", color: "#fff",
                fontSize: 9, fontWeight: 800, letterSpacing: "0.1em",
                padding: "3px 8px", borderRadius: 5,
              }}>DEAL</div>
            )}
            {!form.is_available && (
              <div style={{
                position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ color: "#f87171", fontWeight: 700, fontSize: 13 }}>UNAVAILABLE</span>
              </div>
            )}
          </div>

          <div style={{ padding: "14px 16px 18px" }}>
            <div style={{ fontWeight: 800, color: form.name ? "#fff" : "#333", fontSize: 16, marginBottom: 4 }}>
              {form.name || "Product Name…"}
            </div>
            {form.description && (
              <div style={{ fontSize: 12, color: "#555", marginBottom: 8, lineHeight: 1.5 }}>
                {form.description}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#F5A623" }}>{totalPrice}</span>
              {form.original_price && (
                <span style={{ fontSize: 12, color: "#444", textDecoration: "line-through" }}>
                  Rs. {form.original_price.toLocaleString()}
                </span>
              )}
            </div>
            {form.sizes.length > 0 && (
              <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 5 }}>
                {form.sizes.map((s) => (
                  <span key={s.label} style={{
                    fontSize: 10, background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 5, padding: "3px 8px", color: "#666",
                  }}>{s.label}: Rs.{s.price.toLocaleString()}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category badge */}
        {form.category_id && (
          <div style={{
            background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 10, padding: "12px 16px",
            fontSize: 12, color: "#555",
            display: "flex", justifyContent: "space-between",
          }}>
            <span>Category</span>
            <span style={{ color: "#888", fontWeight: 600 }}>
              {CATEGORIES.find((c) => c.id === form.category_id)?.name ?? "—"}
            </span>
          </div>
        )}

        {/* Deal steps summary */}
        {form.is_deal && dealSections.length > 0 && (
          <div style={{
            background: "#0d0d0d", border: "1px solid rgba(228,0,43,0.15)",
            borderRadius: 10, padding: "14px 16px",
          }}>
            <div style={{ fontSize: 10, color: "#E4002B", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>
              DEAL STEPS ({dealSections.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {dealSections.map((sec, i) => (
                <div key={sec.draftId} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, color: "#333", width: 16 }}>#{i + 1}</span>
                  <span style={{ fontSize: 14 }}>{KIND_ICON[sec.kind]}</span>
                  <span style={{ fontSize: 12, color: "#666" }}>{sec.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
