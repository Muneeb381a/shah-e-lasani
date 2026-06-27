"use client";

import FadeIn from "@/components/FadeIn";
import VideoBackground from "@/components/VideoBackground";
import Link from "next/link";

const STEPS = [
  { step: "01", icon: "🌾", title: "Fresh Ingredients",    desc: "Every morning we source fresh vegetables, premium meats, and imported cheese. Nothing sits in a freezer overnight." },
  { step: "02", icon: "🫙", title: "House-Made Sauces",    desc: "Our signature pizza sauce, garlic mayo, and spice blends are made in-house daily from secret family recipes." },
  { step: "03", icon: "🔥", title: "High-Heat Cooking",    desc: "Pizzas go into a 450°C oven for a perfectly crisp crust. Burgers are smashed on a screaming-hot flat top for maximum caramelisation." },
  { step: "04", icon: "🍕", title: "Assembled to Order",   desc: "Every order is assembled fresh at the time you place it — never pre-made, never sitting under a heat lamp." },
  { step: "05", icon: "📦", title: "Packed Hot",            desc: "Insulated packaging keeps your food at the right temperature from our kitchen to your door." },
  { step: "06", icon: "🚀", title: "Fast Delivery",        desc: "Our riders leave within minutes of your order. Hot food, fast — that's our promise." },
];

const HYGIENE = [
  { icon: "🧤", text: "Gloves worn at all times during food prep" },
  { icon: "🧼", text: "Hands washed every 30 minutes" },
  { icon: "🌡️", text: "Fridge & freezer temps logged twice daily" },
  { icon: "🧹", text: "Full kitchen deep-clean every night" },
  { icon: "✅", text: "All staff hold valid food safety certificates" },
  { icon: "🚫", text: "Zero tolerance for cross-contamination" },
];

export default function KitchenPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>

      {/* ── VIDEO HERO ─────────────────────────────────────────── */}
      <VideoBackground
        src={process.env.NEXT_PUBLIC_KITCHEN_VIDEO_URL ?? "/videos/pizza-prep.mp4"}
        overlay={0.52}
        height="92vh"
        style={{ minHeight: 520 }}
      >
        <div style={{
          height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "0 1.5rem",
        }}>
          {/* Label */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(228,0,43,0.85)", backdropFilter: "blur(8px)",
            padding: "6px 18px", borderRadius: 999, marginBottom: 24,
          }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#fff", letterSpacing: "0.3em", textTransform: "uppercase" }}>
              Behind the Scenes
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "var(--font-oswald)", fontWeight: 900, color: "#ffffff",
            fontSize: "clamp(3rem, 9vw, 7rem)",
            textTransform: "uppercase", letterSpacing: "0.04em",
            lineHeight: 0.95, marginBottom: 20,
            textShadow: "0 4px 40px rgba(0,0,0,0.6)",
          }}>
            Our<br />
            <span style={{ color: "#E4002B" }}>Kitchen</span>
          </h1>

          {/* Divider */}
          <div style={{
            width: 70, height: 3,
            background: "linear-gradient(90deg,#E4002B,#F5A623)",
            borderRadius: 2, marginBottom: 24,
          }} />

          <p style={{
            color: "rgba(255,255,255,0.82)", fontSize: "clamp(0.9rem, 2.5vw, 1.15rem)",
            maxWidth: 520, lineHeight: 1.7, marginBottom: 36,
            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
          }}>
            Transparency is part of our recipe. Watch how we craft every pizza — from raw ingredients to your door.
          </p>

          {/* Stats row */}
          <div style={{
            display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center",
          }}>
            {[
              { val: "450°C", lbl: "Oven Temp" },
              { val: "15 min", lbl: "Avg. Prep Time" },
              { val: "100%", lbl: "Fresh Daily" },
            ].map((s) => (
              <div key={s.val} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "var(--font-oswald)", fontWeight: 900,
                  fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "#F5A623",
                  lineHeight: 1,
                }}>{s.val}</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <div style={{
            position: "absolute", bottom: 32,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            animation: "bounceY 2s ease-in-out infinite",
          }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", letterSpacing: "0.2em" }}>SCROLL</span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
              <rect x="5.5" y="1.5" width="5" height="10" rx="2.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
              <circle cx="8" cy="5" r="1.5" fill="rgba(255,255,255,0.6)"/>
              <path d="M4 17l4 4 4-4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </VideoBackground>

      {/* ── PROCESS STEPS ─────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 1.5rem" }}>

        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: "#E4002B", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>
              Our Process
            </p>
            <h2 style={{
              fontFamily: "var(--font-oswald)", fontWeight: 800, color: "var(--text-primary)",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)", textTransform: "uppercase",
              letterSpacing: "0.04em", marginBottom: 8,
            }}>
              From Ingredient to <span style={{ color: "#E4002B" }}>Your Door</span>
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>6 steps. Zero shortcuts.</p>
          </div>
        </FadeIn>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 20, marginBottom: 72,
        }}>
          {STEPS.map((s, i) => (
            <FadeIn key={s.step} delay={i * 70}>
              <div style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-card)",
                borderRadius: 16, padding: "24px",
                display: "flex", gap: 16, alignItems: "flex-start",
                transition: "border-color 0.2s, transform 0.2s",
                cursor: "default",
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(228,0,43,0.25)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-card)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: "rgba(228,0,43,0.08)",
                  border: "1px solid rgba(228,0,43,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-oswald)", fontWeight: 800,
                  color: "#E4002B", fontSize: "0.85rem",
                }}>{s.step}</div>
                <div>
                  <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>{s.icon}</div>
                  <h3 style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "0.95rem", margin: "0 0 8px" }}>{s.title}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.83rem", lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* ── HYGIENE ──────────────────────────────────────────── */}
        <FadeIn>
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            borderRadius: 20, padding: "36px 32px", marginBottom: 48,
          }}>
            <h2 style={{
              fontFamily: "var(--font-oswald)", fontWeight: 800, color: "var(--text-primary)",
              fontSize: "1.6rem", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8,
            }}>
              🧹 Hygiene <span style={{ color: "#E4002B" }}>Standards</span>
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 24 }}>
              We maintain the highest food safety standards — because your health is not negotiable.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
              {HYGIENE.map((h) => (
                <div key={h.text} style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "12px 16px",
                  background: "rgba(37,211,102,0.06)",
                  border: "1px solid rgba(37,211,102,0.15)",
                  borderRadius: 10,
                }}>
                  <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{h.icon}</span>
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.83rem", lineHeight: 1.5 }}>{h.text}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── CHEF QUOTE ───────────────────────────────────────── */}
        <FadeIn delay={100}>
          <div style={{
            display: "grid", gridTemplateColumns: "auto 1fr", gap: 24,
            background: "var(--bg-card)",
            border: "1px solid rgba(228,0,43,0.18)",
            borderRadius: 20, padding: "32px", marginBottom: 52, alignItems: "center",
          }}
            className="chef-grid"
          >
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "linear-gradient(135deg,#E4002B,#b80022)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2.2rem", flexShrink: 0,
              boxShadow: "0 8px 32px rgba(228,0,43,0.35)",
            }}>👨‍🍳</div>
            <div>
              <blockquote style={{
                color: "var(--text-primary)", fontSize: "1rem", fontStyle: "italic",
                lineHeight: 1.75, margin: "0 0 12px", fontWeight: 500,
              }}>
                &ldquo;I&apos;ve been cooking for over 20 years and the rule is simple: if I wouldn&apos;t eat it myself, it doesn&apos;t leave my kitchen. Every plate gets my full attention.&rdquo;
              </blockquote>
              <div style={{ color: "#E4002B", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.1em" }}>
                HEAD CHEF — SHAH-E-LASANI CAFE · EST. MARCH 2025
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <FadeIn delay={150}>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)", marginBottom: 20, fontSize: "0.9rem" }}>
              Impressed by our process? Taste the difference yourself.
            </p>
            <Link href="/menu" style={{
              background: "#E4002B", color: "#fff",
              padding: "13px 32px", borderRadius: 999,
              fontWeight: 700, fontSize: "0.9rem", textDecoration: "none",
              boxShadow: "0 6px 24px rgba(228,0,43,0.4)",
              display: "inline-block",
            }}>
              Order Now 🍕
            </Link>
          </div>
        </FadeIn>
      </div>

      <style>{`
        @media (max-width: 600px) { .chef-grid { grid-template-columns: 1fr !important; text-align: center; } }
      `}</style>
    </div>
  );
}
