"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Product } from "@/data/menu";
import { useCart } from "@/lib/cart-context";
import { DEAL_CONFIG, ChoiceSection, PizzaGroup } from "@/lib/deal-config";

// ── Constants ───────────────────────────────────────────────────────────────
const KIND_COLOR: Record<ChoiceSection["kind"], string> = {
  pizza: "#E4002B",
  drink: "#0284c7",
  fries: "#d97706",
  wings: "#7c3aed",
  pasta: "#ea580c",
};
const KIND_TAG: Record<ChoiceSection["kind"], string> = {
  pizza: "PIZZA",
  drink: "DRINK",
  fries: "FRIES",
  wings: "WINGS",
  pasta: "PASTA",
};
const SUBTITLE: Record<ChoiceSection["kind"], string> = {
  pizza: "Select a pizza flavor",
  drink: "Select your cold drink",
  fries: "Select your fries type",
  wings: "Select wings flavor",
  pasta: "Select pasta type",
};
const DRINK_DOT: Record<string, string> = {
  Pepsi:       "#1d4ed8",
  "7UP":       "#16a34a",
  Mirinda:     "#ea580c",
  Sting:       "#dc2626",
  "Next Cola": "#0f172a",
};

// ── Option renderers ────────────────────────────────────────────────────────
function PizzaOptions({ sec, picked, onPick }: {
  sec: ChoiceSection & { kind: "pizza"; groups: PizzaGroup[] };
  picked: string | undefined;
  onPick: (v: string) => void;
}) {
  const color = KIND_COLOR.pizza;
  return (
    <div>
      {sec.groups.map((grp) => (
        <div key={grp.title} style={{ marginBottom: 18 }}>
          <div style={{
            fontSize: "0.63rem", fontWeight: 800, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "var(--text-muted)",
            marginBottom: 8, display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ flex: 1, height: 1, background: "var(--border-subtle)", display: "inline-block" }} />
            {grp.title}
            <span style={{ flex: 1, height: 1, background: "var(--border-subtle)", display: "inline-block" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))", gap: 8 }}>
            {grp.items.map((opt) => {
              const sel = picked === opt;
              return (
                <button
                  key={opt}
                  onClick={() => onPick(opt)}
                  style={{
                    padding: "10px 12px", borderRadius: 10, textAlign: "left",
                    border: `1.5px solid ${sel ? color : "var(--border-card)"}`,
                    background: sel ? `${color}12` : "var(--bg-surface)",
                    color: sel ? color : "var(--text-secondary)",
                    fontFamily: "var(--font-open-sans)",
                    fontWeight: sel ? 700 : 500, fontSize: "0.82rem",
                    cursor: "pointer", transition: "all 0.14s",
                    lineHeight: 1.3, position: "relative",
                  }}
                >
                  {sel && <CheckMark color={color} />}
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function DrinkOptions({ sec, picked, onPick }: {
  sec: ChoiceSection & { kind: "drink" };
  picked: string | undefined;
  onPick: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {sec.options.map((opt) => {
        const sel = picked === opt;
        const dc = DRINK_DOT[opt] ?? "#334155";
        return (
          <button
            key={opt}
            onClick={() => onPick(opt)}
            style={{
              padding: "12px 18px", borderRadius: 12, minWidth: 105,
              border: `1.5px solid ${sel ? dc : "var(--border-card)"}`,
              background: sel ? `${dc}14` : "var(--bg-surface)",
              color: sel ? dc : "var(--text-secondary)",
              fontFamily: "var(--font-open-sans)",
              fontWeight: sel ? 700 : 500, fontSize: "0.9rem",
              cursor: "pointer", transition: "all 0.14s",
              display: "flex", alignItems: "center", gap: 9,
              position: "relative",
            }}
          >
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: dc, flexShrink: 0, opacity: sel ? 1 : 0.5 }} />
            {opt}
            {sel && <CheckMark color={dc} />}
          </button>
        );
      })}
    </div>
  );
}

function GridOptions({ sec, picked, onPick }: {
  sec: ChoiceSection;
  picked: string | undefined;
  onPick: (v: string) => void;
}) {
  const color = KIND_COLOR[sec.kind];
  const cols = sec.options.length <= 3
    ? `repeat(${sec.options.length}, 1fr)`
    : "repeat(auto-fill, minmax(130px, 1fr))";
  return (
    <div style={{ display: "grid", gridTemplateColumns: cols, gap: 10 }}>
      {sec.options.map((opt) => {
        const sel = picked === opt;
        return (
          <button
            key={opt}
            onClick={() => onPick(opt)}
            style={{
              padding: "12px 14px", borderRadius: 10, textAlign: "center",
              border: `1.5px solid ${sel ? color : "var(--border-card)"}`,
              background: sel ? `${color}12` : "var(--bg-surface)",
              color: sel ? color : "var(--text-secondary)",
              fontFamily: "var(--font-open-sans)",
              fontWeight: sel ? 700 : 500, fontSize: "0.84rem",
              cursor: "pointer", transition: "all 0.14s",
              lineHeight: 1.35, position: "relative",
            }}
          >
            {sel && <CheckMark color={color} />}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function CheckMark({ color }: { color: string }) {
  return (
    <span style={{
      position: "absolute", top: 6, right: 6,
      width: 15, height: 15, borderRadius: "50%",
      background: color, display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 8, height: 8 }}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}

// ── Main modal ──────────────────────────────────────────────────────────────
export default function DealOrderModal({
  deal,
  onClose,
}: {
  deal: Product;
  onClose: () => void;
}) {
  const { dispatch } = useCart();
  const sections = DEAL_CONFIG[deal.id] ?? [];
  const totalChoiceSteps = sections.length;

  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const isReview   = step === totalChoiceSteps;
  const curSec     = !isReview ? sections[step] : null;
  const curPick    = curSec ? picks[curSec.key] : undefined;
  const canAdvance = isReview || !!curPick;

  function pick(key: string, value: string) {
    setPicks((p) => ({ ...p, [key]: value }));
  }

  function goNext() { setStep((s) => s + 1); }
  function goBack() { setStep((s) => s - 1); }

  function buildNote() {
    const parts = sections
      .filter((s) => picks[s.key])
      .map((s) => `${s.label}: ${picks[s.key]}`);
    if (notes.trim()) parts.push(`Note: ${notes.trim()}`);
    return parts.join(" · ");
  }

  function handleAdd() {
    dispatch({
      type: "ADD_ITEM",
      item: {
        id: `${deal.id}-${Date.now()}`,
        productId: deal.id,
        name: deal.name,
        price: deal.basePrice,
        quantity: 1,
        notes: buildNote() || undefined,
      },
    });
    dispatch({ type: "OPEN_CART" });
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 850);
  }

  const savePct = deal.originalPrice
    ? Math.round(((deal.originalPrice - deal.basePrice) / deal.originalPrice) * 100)
    : null;

  if (!mounted) return null;

  // Render current section content
  function renderSectionContent(sec: ChoiceSection) {
    const p = picks[sec.key];
    const set = (v: string) => pick(sec.key, v);
    if (sec.kind === "pizza") {
      return <PizzaOptions sec={sec} picked={p} onPick={set} />;
    }
    if (sec.kind === "drink") {
      return <DrinkOptions sec={sec} picked={p} onPick={set} />;
    }
    return <GridOptions sec={sec} picked={p} onPick={set} />;
  }

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
          animation: "dmFade 0.2s ease",
        }}
      />

      {/* Sheet */}
      <div
        className="dm-sheet"
        style={{
          position: "fixed", zIndex: 9999,
          bottom: 0, left: 0, right: 0,
          background: "var(--bg-card)",
          borderRadius: "22px 22px 0 0",
          maxHeight: "92dvh",
          display: "flex", flexDirection: "column",
          boxShadow: "0 -20px 70px rgba(0,0,0,0.5)",
          animation: "dmUp 0.3s cubic-bezier(0.34,1.2,0.64,1)",
        }}
      >
        {/* Drag handle */}
        <div style={{ width: 44, height: 4, borderRadius: 2, background: "var(--border-card)", margin: "12px auto 0", flexShrink: 0 }} />

        {/* ── Fixed top: deal header + progress ── */}
        <div style={{ padding: "14px 20px 0", flexShrink: 0 }}>
          {/* Deal name + price */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                <span style={{ background: "#E4002B", color: "#fff", fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.16em", padding: "3px 10px", borderRadius: 999, textTransform: "uppercase" }}>Hot Deal</span>
                {savePct && <span style={{ background: "#F5A623", color: "#000", fontSize: "0.55rem", fontWeight: 800, padding: "3px 10px", borderRadius: 999 }}>-{savePct}% OFF</span>}
              </div>
              <h2 style={{ fontFamily: "var(--font-oswald)", fontWeight: 800, color: "var(--text-primary)", fontSize: "1.15rem", lineHeight: 1.2, margin: "0 0 4px" }}>
                {deal.name}
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.76rem", lineHeight: 1.45, margin: 0 }}>
                {deal.description}
              </p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "var(--font-oswald)", fontWeight: 900, fontSize: "1.65rem", color: "#E4002B", lineHeight: 1 }}>
                Rs.{deal.basePrice.toLocaleString()}
              </div>
              {deal.originalPrice && (
                <div style={{ fontFamily: "var(--font-oswald)", fontSize: "0.78rem", color: "var(--text-muted)", textDecoration: "line-through", marginTop: 2 }}>
                  Rs.{deal.originalPrice.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Progress (only when steps > 0) */}
          {totalChoiceSteps > 0 && (
            <div style={{ marginTop: 14 }}>
              {/* Step segments */}
              <div style={{ display: "flex", gap: 5 }}>
                {sections.map((sec, i) => {
                  const done = i < step || isReview;
                  const active = i === step;
                  const color = KIND_COLOR[sec.kind];
                  return (
                    <div
                      key={sec.key}
                      style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}
                    >
                      <div style={{
                        height: 3, borderRadius: 2,
                        background: done ? color : active ? `${color}55` : "var(--border-card)",
                        transition: "background 0.3s",
                      }} />
                      <span style={{
                        fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: done || active ? color : "var(--text-muted)",
                        opacity: done || active ? 1 : 0.5,
                        transition: "color 0.3s",
                        lineHeight: 1,
                      }}>
                        {KIND_TAG[sec.kind]}
                      </span>
                    </div>
                  );
                })}
                {/* Review step indicator */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                  <div style={{
                    height: 3, borderRadius: 2,
                    background: isReview ? "#16a34a" : "var(--border-card)",
                    transition: "background 0.3s",
                  }} />
                  <span style={{
                    fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: isReview ? "#16a34a" : "var(--text-muted)",
                    opacity: isReview ? 1 : 0.5,
                    transition: "color 0.3s", lineHeight: 1,
                  }}>CONFIRM</span>
                </div>
              </div>
            </div>
          )}

          <div style={{ height: 1, background: "var(--border-subtle)", marginTop: 14 }} />
        </div>

        {/* ── Scrollable step content ── */}
        <div
          key={step}
          style={{
            flex: 1, overflowY: "auto",
            padding: "18px 20px 0",
            animation: "dmStepIn 0.2s ease",
          }}
        >
          {totalChoiceSteps === 0 ? (
            /* No customization — show notes only */
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: 16 }}>
                This deal is ready to order. Add any special instructions below.
              </p>
              <NotesField notes={notes} onChange={setNotes} />
            </div>
          ) : !isReview && curSec ? (
            /* Choice step */
            <div>
              {/* Section heading */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{
                  background: KIND_COLOR[curSec.kind], color: "#fff",
                  fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.14em",
                  padding: "4px 10px", borderRadius: 5, textTransform: "uppercase",
                }}>
                  {KIND_TAG[curSec.kind]}
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                  Step {step + 1} of {totalChoiceSteps}
                </span>
              </div>
              <h3 style={{
                fontFamily: "var(--font-oswald)", fontWeight: 800,
                color: "var(--text-primary)", fontSize: "1.2rem",
                lineHeight: 1.2, margin: "0 0 4px",
              }}>
                {curSec.label}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.77rem", marginBottom: 16 }}>
                {SUBTITLE[curSec.kind]}
              </p>
              {renderSectionContent(curSec)}
            </div>
          ) : (
            /* Review + Notes step */
            <div>
              <h3 style={{
                fontFamily: "var(--font-oswald)", fontWeight: 800,
                color: "var(--text-primary)", fontSize: "1.15rem", marginBottom: 14,
              }}>
                Review Your Order
              </h3>

              {/* Selections summary */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {sections.map((sec, i) => (
                  <div
                    key={sec.key}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "11px 14px", borderRadius: 12,
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-card)",
                    }}
                  >
                    <span style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: KIND_COLOR[sec.kind], flexShrink: 0,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
                        {sec.label}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-primary)", marginTop: 1 }}>
                        {picks[sec.key] ?? "—"}
                      </div>
                    </div>
                    <button
                      onClick={() => setStep(i)}
                      style={{
                        background: "none", border: "1px solid var(--border-card)",
                        borderRadius: 6, padding: "4px 10px",
                        color: "#E4002B", fontSize: "0.7rem", fontWeight: 700,
                        cursor: "pointer", flexShrink: 0,
                      }}
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>

              <NotesField notes={notes} onChange={setNotes} />
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: "14px 20px 30px", flexShrink: 0,
          borderTop: "1px solid var(--border-subtle)",
          background: "var(--bg-card)",
          display: "flex", gap: 10,
        }}>
          {/* Back / Cancel */}
          <button
            onClick={step === 0 ? onClose : goBack}
            style={{
              padding: "13px 18px", borderRadius: 12, flexShrink: 0,
              border: "1.5px solid var(--border-card)", background: "transparent",
              color: "var(--text-muted)", fontSize: "0.88rem", fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
            }}
          >
            {step > 0 && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            )}
            {step === 0 ? "Cancel" : "Back"}
          </button>

          {/* Next / Add to Cart */}
          {totalChoiceSteps === 0 || isReview ? (
            <button
              onClick={handleAdd}
              style={{
                flex: 1, padding: "13px 20px", borderRadius: 12, border: "none",
                background: added ? "#16a34a" : "#E4002B",
                color: "#fff",
                fontFamily: "var(--font-oswald)", fontWeight: 800,
                fontSize: "0.95rem", letterSpacing: "0.04em",
                cursor: "pointer", transition: "background 0.2s",
                boxShadow: added ? "0 4px 18px rgba(22,163,74,0.4)" : "0 4px 20px rgba(228,0,43,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {added ? "Added to Cart!" : `Add to Cart — Rs.${deal.basePrice.toLocaleString()}`}
            </button>
          ) : (
            <button
              onClick={canAdvance ? goNext : undefined}
              disabled={!canAdvance}
              style={{
                flex: 1, padding: "13px 20px", borderRadius: 12, border: "none",
                background: canAdvance ? "#E4002B" : "rgba(0,0,0,0.07)",
                color: canAdvance ? "#fff" : "var(--text-muted)",
                fontFamily: "var(--font-oswald)", fontWeight: 800,
                fontSize: "0.95rem", letterSpacing: "0.04em",
                cursor: canAdvance ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                boxShadow: canAdvance ? "0 4px 20px rgba(228,0,43,0.4)" : "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {canAdvance ? (
                <>
                  {step === totalChoiceSteps - 1 ? "Review Order" : "Next"}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </>
              ) : (
                "Select an option to continue"
              )}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes dmFade  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes dmUp    { from { transform: translateY(80px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes dmStepIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @media (min-width: 640px) {
          .dm-sheet {
            top: 50% !important; bottom: auto !important;
            left: 50% !important; right: auto !important;
            transform: translate(-50%, -50%) !important;
            width: min(580px, 94vw) !important;
            border-radius: 20px !important;
            max-height: 90vh !important;
            animation: none !important;
          }
        }
      `}</style>
    </>,
    document.body
  );
}

// ── Shared Notes field ───────────────────────────────────────────────────────
function NotesField({ notes, onChange }: { notes: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <p style={{
        fontFamily: "var(--font-oswald)", fontWeight: 700,
        color: "var(--text-primary)", fontSize: "0.88rem", marginBottom: 8,
      }}>
        Special Instructions{" "}
        <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: "0.74rem" }}>
          (optional)
        </span>
      </p>
      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Extra spicy, no onions, extra sauce…"
        rows={2}
        style={{
          width: "100%", borderRadius: 10,
          border: "1.5px solid var(--border-card)",
          background: "var(--bg-surface)", color: "var(--text-primary)",
          padding: "10px 14px", fontSize: "0.82rem", lineHeight: 1.5,
          resize: "none", outline: "none",
          fontFamily: "var(--font-open-sans)",
          boxSizing: "border-box", transition: "border-color 0.15s",
        }}
        onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "#E4002B"; }}
        onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--border-card)"; }}
      />
    </div>
  );
}
