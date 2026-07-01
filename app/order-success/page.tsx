"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const JAZZCASH   = "0325-4695624";
const EASYPAISA  = "0325-4695624";
const ACCOUNT_NAME = "SHAH-E-LASANI CAFE";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={copy}
      style={{
        background: copied ? "rgba(22,163,74,0.2)" : "rgba(255,255,255,0.08)",
        border: `1px solid ${copied ? "rgba(22,163,74,0.4)" : "rgba(255,255,255,0.15)"}`,
        borderRadius: 8, padding: "5px 12px",
        color: copied ? "#4ade80" : "#aaa",
        fontSize: 12, fontWeight: 600,
        cursor: "pointer", transition: "all 0.2s",
        whiteSpace: "nowrap", flexShrink: 0,
      }}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function AccountRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 12, padding: "10px 14px",
      background: "rgba(255,255,255,0.04)",
      borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)",
    }}>
      <div>
        <div style={{ fontSize: 10, color: "#555", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>
          {label}
        </div>
        <div style={{ fontSize: 15, color: "#fff", fontWeight: 700, letterSpacing: "0.04em" }}>
          {value}
        </div>
      </div>
      <CopyButton text={value} />
    </div>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const waRaw  = searchParams.get("wa");
  const pm     = searchParams.get("pm");       // "bank" | "cod"
  const total  = searchParams.get("total");

  const waUrl     = waRaw ? decodeURIComponent(waRaw) : null;
  const isBank    = pm === "bank";
  const totalRs   = total ? Number(total).toLocaleString() : null;

  return (
    <div style={{
      minHeight: "100vh", background: "#111",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem 1rem",
    }}>
      <div style={{ width: "100%", maxWidth: 480 }}>

        {/* ── Top card ── */}
        <div style={{
          background: "#1c1c1c", border: "1px solid #2a2a2a",
          borderRadius: 24, padding: "32px 28px",
          textAlign: "center", marginBottom: 16,
        }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>
            {isBank ? "🏦" : "✅"}
          </div>
          <h1 style={{
            fontFamily: "var(--font-oswald)", fontWeight: 900,
            fontSize: "1.8rem", color: "#fff",
            textTransform: "uppercase", letterSpacing: "0.06em",
            marginBottom: 10,
          }}>
            {isBank ? "Almost Done!" : "Order Placed!"}
          </h1>
          <p style={{ color: "#777", fontSize: "0.88rem", lineHeight: 1.7, maxWidth: 340, margin: "0 auto" }}>
            {isBank
              ? "Your order is recorded. Complete the payment below, then confirm on WhatsApp with your screenshot."
              : "Your order has been received. Open WhatsApp to confirm so we can start preparing it right away!"}
          </p>
        </div>

        {/* ── Bank Transfer panel ── */}
        {isBank && (
          <div style={{
            background: "#1c1c1c", border: "1px solid rgba(245,166,35,0.2)",
            borderRadius: 24, padding: "24px 24px 20px",
            marginBottom: 16,
          }}>
            {/* Amount due */}
            {totalRs && (
              <div style={{
                background: "rgba(245,166,35,0.08)",
                border: "1px solid rgba(245,166,35,0.18)",
                borderRadius: 14, padding: "16px 18px",
                marginBottom: 18, textAlign: "center",
              }}>
                <div style={{ fontSize: 11, color: "#888", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>
                  Amount to Pay
                </div>
                <div style={{
                  fontFamily: "var(--font-oswald)", fontWeight: 900,
                  fontSize: "2.2rem", color: "#F5A623",
                }}>
                  Rs. {totalRs}
                </div>
              </div>
            )}

            {/* Account details */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#555", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
                Transfer To
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <AccountRow label="JazzCash / Easypaisa"   value={JAZZCASH}      />
                <AccountRow label="Account Name"            value={ACCOUNT_NAME}  />
              </div>
            </div>

            {/* Steps */}
            <div style={{
              background: "rgba(37,211,102,0.05)",
              border: "1px solid rgba(37,211,102,0.12)",
              borderRadius: 12, padding: "14px 16px",
            }}>
              <div style={{ fontSize: 11, color: "#25D366", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
                How to Complete Your Order
              </div>
              {[
                { n: "1", text: `Open JazzCash or Easypaisa app` },
                { n: "2", text: `Send Rs. ${totalRs ?? "..."} to ${JAZZCASH}` },
                { n: "3", text: "Take a screenshot of the payment confirmation" },
                { n: "4", text: "Open WhatsApp below and send your order + screenshot" },
              ].map((s) => (
                <div key={s.n} style={{
                  display: "flex", gap: 10, alignItems: "flex-start",
                  marginBottom: s.n === "4" ? 0 : 8,
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: "#25D366", color: "#000",
                    fontSize: 11, fontWeight: 800, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{s.n}</div>
                  <span style={{ fontSize: "0.82rem", color: "#aaa", lineHeight: 1.55, paddingTop: 2 }}>
                    {s.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── WhatsApp button ── */}
        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              width: "100%", padding: "16px",
              background: "#16a34a", color: "#fff",
              border: "none", borderRadius: 999,
              fontFamily: "var(--font-oswald)", fontWeight: 700,
              fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.08em",
              textDecoration: "none", marginBottom: 12,
              boxShadow: "0 8px 28px rgba(22,163,74,0.4)",
              boxSizing: "border-box",
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.073 22l4.978-1.305A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 01-4.056-1.107l-.29-.173-3.002.786.8-2.924-.19-.3A7.97 7.97 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z"/>
            </svg>
            {isBank ? "Open WhatsApp & Send Screenshot" : "Confirm on WhatsApp"}
          </a>
        )}

        <Link href="/" style={{
          display: "block", width: "100%", padding: "13px",
          border: "1px solid #2a2a2a", borderRadius: 999,
          color: "#555", textAlign: "center", textDecoration: "none",
          fontSize: "0.85rem", transition: "color 0.2s, border-color 0.2s",
          boxSizing: "border-box",
        }}>
          Back to Home
        </Link>

        <p style={{ color: "#333", fontSize: "0.7rem", textAlign: "center", marginTop: 20 }}>
          SHAH-E-LASANI CAFE — WhatsApp: 0325-4695624
        </p>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#111" }}>
        <p style={{ color: "#555" }}>Loading…</p>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
