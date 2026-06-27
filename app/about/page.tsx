"use client";

import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import Link from "next/link";

const STATS = [
  { value: "Mar 2025", label: "Established"       },
  { value: "50+",      label: "Menu Items"         },
  { value: "100%",     label: "Fresh Ingredients"  },
  { value: "Fast",     label: "Hot Delivery"       },
];

const VALUES = [
  { icon: "🔥", title: "Made Fresh Daily",    desc: "Every pizza, burger, and side is prepared fresh — no frozen shortcuts." },
  { icon: "🌿", title: "Quality Ingredients", desc: "We source the finest ingredients to ensure every bite is full of flavour." },
  { icon: "❤️",  title: "Made with Love",      desc: "Our chefs put heart into every dish — that's the Shah-e-Lasani difference." },
  { icon: "⚡", title: "Fast & Hot Delivery", desc: "Hot food, fast delivery. We respect your time and your taste buds." },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>

      {/* ── Hero ── */}
      <div style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "4rem 1.5rem 3rem",
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center", pointerEvents: "none",
        }}>
          <span style={{
            fontFamily: "var(--font-oswald)", fontWeight: 900,
            fontSize: "clamp(80px, 16vw, 200px)",
            color: "rgba(228,0,43,0.04)", userSelect: "none",
            textTransform: "uppercase",
          }}>ABOUT</span>
        </div>
        <FadeIn>
          <p style={{ color: "#E4002B", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>
            Our Story
          </p>
          <h1 style={{
            fontFamily: "var(--font-oswald)", fontWeight: 900,
            fontSize: "clamp(2.2rem, 6vw, 3.6rem)", textTransform: "uppercase",
            letterSpacing: "0.04em", lineHeight: 1, marginBottom: 16,
          }}>
            <span style={{ color: "#E4002B" }}>Shah-e-Lasani</span>{" "}
            <span style={{ color: "var(--text-primary)" }}>Cafe</span>
          </h1>
          <div style={{ width: 60, height: 3, background: "linear-gradient(90deg,#E4002B,#F5A623)", borderRadius: 2, margin: "0 auto 20px" }} />
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
            Eat good Feel good that's why Shah-e-Lasani Cafe Serves good and hygienic food. A family-run cafe built on passion, quality, and the love of great food.
          </p>
        </FadeIn>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 1.5rem" }}>

        {/* ── Stats ── */}
        <FadeIn>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 16, marginBottom: 64,
          }}>
            {STATS.map((s) => (
              <div key={s.label} style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-card)",
                borderRadius: 16, padding: "28px 20px", textAlign: "center",
                boxShadow: "0 4px 20px var(--shadow-card)",
              }}>
                <div style={{
                  fontFamily: "var(--font-oswald)", fontWeight: 800,
                  fontSize: "2rem", color: "#E4002B", lineHeight: 1,
                }}>
                  {s.value}
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 6, fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* ── Story + Founder ── */}
        <div
          className="about-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", marginBottom: 72 }}
        >
          {/* Left: story text */}
          <FadeIn>
            <div>
              <h2 style={{
                fontFamily: "var(--font-oswald)", fontWeight: 800, color: "var(--text-primary)",
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)", textTransform: "uppercase",
                letterSpacing: "0.04em", marginBottom: 20,
              }}>
                Born from a <span style={{ color: "#E4002B" }}>Passion</span> for Food
              </h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 16, fontSize: "0.95rem" }}>
                Shah-e-Lasani Cafe opened its doors in <strong style={{ color: "var(--text-primary)" }}>March 2025</strong> on Chakrala Kulluwal Road, Sialkot — born from a simple dream to bring restaurant-quality food to every household in the city.
              </p>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.95rem" }}>
                From our signature pizzas to juicy zinger burgers and crispy wings, every item on our menu is crafted with care using only the freshest ingredients. No shortcuts. No compromises. Just great food, every single time.
              </p>
              <div style={{
                marginTop: 24,
                display: "flex", alignItems: "center", gap: 12,
                padding: "14px 18px",
                background: "rgba(228,0,43,0.06)",
                border: "1px solid rgba(228,0,43,0.15)",
                borderRadius: 12,
              }}>
                <span style={{ fontSize: "1.4rem" }}>📍</span>
                <div>
                  <div style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.88rem" }}>Our Location</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 2 }}>
                    Chakrala Kulluwal Road, Jamia Masjid Hanafiya Road Wali, Sialkot
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right: Founder photo */}
          <FadeIn delay={120}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              {/* Photo card */}
              <div style={{
                position: "relative",
                width: "100%", maxWidth: 340,
                borderRadius: 24,
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(228,0,43,0.15)",
              }}>
                {/* Actual founder photo */}
                <div style={{ position: "relative", width: "100%", paddingTop: "110%" }}>
                  <Image
                    src="/shahelasanifounder.jpg"
                    alt="Founder — Shah-e-Lasani Cafe"
                    fill
                    sizes="(max-width: 700px) 90vw, 340px"
                    style={{ objectFit: "cover", objectPosition: "center top" }}
                  />
                  {/* Bottom gradient */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    height: "45%",
                    background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
                  }} />
                  {/* Name overlay */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    padding: "20px 22px",
                  }}>
                    <div style={{
                      fontFamily: "var(--font-oswald)", fontWeight: 700,
                      color: "#fff", fontSize: "1.15rem", lineHeight: 1.2,
                    }}>
                      Founder &amp; Owner
                    </div>
                    <div style={{ color: "#F5A623", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", marginTop: 4 }}>
                      SHAH-E-LASANI CAFE · EST. MARCH 2025
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote below photo */}
              <div style={{
                marginTop: 20, width: "100%", maxWidth: 340,
                background: "var(--bg-card)",
                border: "1px solid rgba(228,0,43,0.18)",
                borderRadius: 16, padding: "18px 20px",
              }}>
                <div style={{ color: "#E4002B", fontSize: "1.6rem", lineHeight: 1, marginBottom: 8 }}>&ldquo;</div>
                <p style={{
                  color: "var(--text-primary)", fontSize: "0.92rem", fontStyle: "italic",
                  lineHeight: 1.7, margin: 0, fontWeight: 500,
                }}>
                  Food is not just fuel. It&apos;s culture, memory, and love — served on a plate. I started this cafe to share that feeling with every person in Sialkot.
                </p>
                <div style={{ color: "#E4002B", fontWeight: 700, fontSize: "0.75rem", marginTop: 12, letterSpacing: "0.08em" }}>
                  — FOUNDER, SHAH-E-LASANI CAFE
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* ── Values ── */}
        <FadeIn>
          <h2 style={{
            fontFamily: "var(--font-oswald)", fontWeight: 800, color: "var(--text-primary)",
            fontSize: "clamp(1.6rem, 3vw, 2rem)", textTransform: "uppercase",
            letterSpacing: "0.04em", marginBottom: 28, textAlign: "center",
          }}>
            Our <span style={{ color: "#E4002B" }}>Values</span>
          </h2>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20, marginBottom: 64,
          }}>
            {VALUES.map((v, i) => (
              <FadeIn key={v.title} delay={i * 80}>
                <div
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-card)",
                    borderRadius: 16, padding: "24px",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(228,0,43,0.3)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(228,0,43,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-card)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  <span style={{ fontSize: "1.8rem" }}>{v.icon}</span>
                  <h3 style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "0.95rem", margin: "12px 0 8px" }}>
                    {v.title}
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.83rem", lineHeight: 1.6, margin: 0 }}>
                    {v.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>

        {/* ── CTA ── */}
        <FadeIn delay={200}>
          <div style={{
            textAlign: "center",
            background: "var(--bg-card)",
            border: "1px solid rgba(228,0,43,0.2)",
            borderRadius: 20, padding: "40px 24px",
          }}>
            {/* Logo in CTA */}
            <div style={{
              width: 64, height: 64, borderRadius: 18, overflow: "hidden",
              margin: "0 auto 16px", position: "relative",
              boxShadow: "0 8px 32px rgba(228,0,43,0.3)",
            }}>
              <Image src="/shahelasani.png" alt="Shah-e-Lasani Cafe" fill sizes="64px" style={{ objectFit: "cover" }} />
            </div>
            <h3 style={{ color: "var(--text-primary)", fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.6rem", margin: "0 0 10px" }}>
              Ready to taste the difference?
            </h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: 24, fontSize: "0.9rem" }}>
              Order online or WhatsApp us — we deliver hot and fast across Sialkot.
            </p>
            <Link
              href="/menu"
              style={{
                background: "#E4002B", color: "#fff",
                padding: "13px 32px", borderRadius: 999,
                fontWeight: 700, fontSize: "0.9rem", textDecoration: "none",
                boxShadow: "0 6px 24px rgba(228,0,43,0.4)",
                display: "inline-block",
              }}
            >
              Browse Our Menu →
            </Link>
          </div>
        </FadeIn>
      </div>

      <style>{`
        @media (max-width: 700px) { .about-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
