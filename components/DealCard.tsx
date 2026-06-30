"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/data/menu";
import { DEAL_CONFIG } from "@/lib/deal-config";
import DealOrderModal from "./DealOrderModal";

function px(id: number) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=480&h=320&dpr=1`;
}
const DEAL_DEFAULT_IMG = px(9872916);

export default function DealCard({ deal }: { deal: Product; index?: number }) {
  const [imgErr, setImgErr] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const original = deal.originalPrice;
  const savePct  = original ? Math.round(((original - deal.basePrice) / original) * 100) : null;
  const savings  = original ? original - deal.basePrice : null;
  const imgSrc   = deal.image || DEAL_DEFAULT_IMG;
  const hasConfig = (DEAL_CONFIG[deal.id] ?? []).length > 0;

  return (
    <>
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-card)",
          borderRadius: 16, overflow: "hidden",
          display: "flex", flexDirection: "column",
          transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 48px rgba(228,0,43,0.15)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(228,0,43,0.35)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-card)";
        }}
      >
        {/* ── Image ── */}
        <div style={{ position: "relative", height: 190, overflow: "hidden", background: "var(--bg-surface)", flexShrink: 0 }}>
          {!imgErr ? (
            <Image
              src={imgSrc}
              alt={deal.name}
              fill
              sizes="(max-width: 600px) 100vw, 320px"
              style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
              onError={() => setImgErr(true)}
              onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ width: 52, height: 52, opacity: 0.25, color: "var(--text-muted)" }}>
                <circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><circle cx="12" cy="8" r="1" fill="currentColor"/><circle cx="12" cy="16" r="1" fill="currentColor"/>
              </svg>
            </div>
          )}

          {/* Badges */}
          <div style={{ position: "absolute", top: 12, left: 12 }}>
            <span style={{
              background: "#E4002B", color: "#fff",
              fontSize: "0.6rem", fontWeight: 800,
              letterSpacing: "0.18em", textTransform: "uppercase",
              padding: "4px 10px", borderRadius: 999,
            }}>Hot Deal</span>
          </div>
          {savePct && (
            <div style={{ position: "absolute", top: 12, right: 12 }}>
              <span style={{
                background: "#F5A623", color: "#000",
                fontSize: "0.65rem", fontWeight: 900,
                padding: "4px 10px", borderRadius: 999,
              }}>-{savePct}% OFF</span>
            </div>
          )}

          {/* Customize hint */}
          {hasConfig && (
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
              padding: "20px 12px 8px",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
                <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
              </svg>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.06em" }}>
                CHOOSE YOUR FLAVORS
              </span>
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
          <h3 style={{
            fontFamily: "var(--font-oswald)", fontWeight: 700,
            color: "var(--text-primary)", fontSize: "1.08rem",
            lineHeight: 1.25, marginBottom: 6,
          }}>
            {deal.name}
          </h3>
          <p style={{
            color: "var(--text-muted)", fontSize: "0.78rem", lineHeight: 1.6,
            flex: 1, marginBottom: 14,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {deal.description}
          </p>

          {/* Price row */}
          <div style={{
            paddingTop: 12, borderTop: "1px solid var(--border-subtle)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
          }}>
            <div>
              {original && (
                <div style={{
                  fontFamily: "var(--font-oswald)", fontSize: "0.82rem",
                  color: "var(--text-muted)", textDecoration: "line-through", marginBottom: 2,
                }}>
                  Rs. {original.toLocaleString()}
                </div>
              )}
              <div style={{ fontFamily: "var(--font-oswald)", fontWeight: 900, fontSize: "1.4rem", color: "#E4002B", lineHeight: 1 }}>
                Rs. {deal.basePrice.toLocaleString()}
              </div>
              {savings && (
                <div style={{ color: "#16a34a", fontSize: "0.68rem", fontWeight: 700, marginTop: 3 }}>
                  Save Rs. {savings.toLocaleString()}
                </div>
              )}
            </div>
            <button
              onClick={() => setModalOpen(true)}
              style={{
                background: "#E4002B", color: "#fff", border: "none", cursor: "pointer",
                padding: "10px 22px", borderRadius: 10,
                fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "0.85rem",
                boxShadow: "0 4px 16px rgba(228,0,43,0.35)",
                transition: "all 0.18s ease", whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: 6,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#c8001f"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#E4002B"; }}
            >
              {hasConfig ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                  Customize
                </>
              ) : "Order Now"}
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <DealOrderModal deal={deal} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
