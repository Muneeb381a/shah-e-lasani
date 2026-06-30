"use client";

import Link from "next/link";
import Image from "next/image";
import { deals, products } from "@/data/menu";
import HeroSection from "@/components/HeroSection";
import DealCard from "@/components/DealCard";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";

function px(id: number) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=480&h=320&dpr=1`;
}

const CATEGORIES = [
  { id: "cat-pizza",     name: "Pizza",             slug: "pizza",     img: px(9993754)  },
  { id: "cat-burger",    name: "Burger",            slug: "burger",    img: px(36007382) },
  { id: "cat-crunchy",   name: "Crunchy and Crispy",slug: "crunchy",   img: px(2299981)  },
  { id: "cat-fries",     name: "Fries",             slug: "fries",     img: px(36879180) },
  { id: "cat-wrap",      name: "Wrap and Roll",     slug: "wrap",      img: px(18177341) },
  { id: "cat-deals",     name: "Deals",             slug: "deals",     img: px(9872916)  },
];

export default function Home() {
  const popularItems = [
    ...products.filter((p) => p.categoryId === "cat-pizza"  && p.isAvailable).slice(0, 3),
    ...products.filter((p) => p.categoryId === "cat-burger" && p.isAvailable).slice(0, 3),
  ];

  return (
    <div style={{ overflowX: "hidden" }}>

      {/* 1 ── HERO ── */}
      <HeroSection />

      {/* 2 ── TICKER ── */}
      <div style={{
        background: "#E4002B",
        overflow: "hidden",
        whiteSpace: "nowrap",
        padding: "10px 0",
        borderBottom: "1px solid rgba(0,0,0,0.12)",
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", animation: "ticker 48s linear infinite" }}>
          {[0, 1].map((n) => (
            <span key={n} style={{ display: "inline-flex", alignItems: "center" }}>

              {/* highlighted phrase */}
              <span style={{ display: "inline-flex", alignItems: "center", gap: 0, padding: "0 36px" }}>
                {["Pizza", "Burgers", "Wings", "Deals"].map((item, i, arr) => (
                  <span key={item} style={{ display: "inline-flex", alignItems: "center" }}>
                    <span style={{
                      fontFamily: "var(--font-oswald)", fontWeight: 700,
                      color: "#fff", fontSize: "0.88rem",
                      letterSpacing: "0.14em", textTransform: "uppercase",
                    }}>{item}</span>
                    {i < arr.length - 1 && (
                      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", padding: "0 10px" }}>·</span>
                    )}
                  </span>
                ))}
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", fontStyle: "italic", fontFamily: "var(--font-open-sans)", letterSpacing: "0.04em", paddingLeft: 14 }}>
                  — crafted fresh every order
                </span>
              </span>

              {/* regular items */}
              {[
                "Free Delivery Above Rs. 1,000",
                "Fresh Made Every Order",
                "30 Minute Delivery",
                "Amazing Deals Every Day",
                "Order on WhatsApp · 0325-4695624",
                "100% Fresh Ingredients",
              ].map((text, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.45rem", padding: "0 32px", lineHeight: 1 }}>★</span>
                  <span style={{
                    fontFamily: "var(--font-oswald)", color: "#fff",
                    fontSize: "0.85rem", fontWeight: 500,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                  }}>{text}</span>
                </span>
              ))}

            </span>
          ))}
        </div>
      </div>

      {/* 3 ── MENU CATEGORIES ── */}
      <section style={{ background: "var(--bg-page)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <p style={{ color: "#E4002B", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 10 }}>
                What are you craving?
              </p>
              <h2 style={{
                fontFamily: "var(--font-oswald)", fontWeight: 900,
                color: "var(--text-primary)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1,
              }}>
                Explore Our Menu
              </h2>
              <div style={{ width: 50, height: 3, background: "linear-gradient(90deg,#E4002B,#F5A623)", borderRadius: 2, margin: "12px auto 0" }} />
            </div>
          </FadeIn>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 16,
          }}>
            {CATEGORIES.map((cat, i) => (
              <FadeIn key={cat.id} delay={i * 60}>
                <Link href={`/menu?cat=${cat.slug}`} style={{ textDecoration: "none", display: "block" }}>
                  <div
                    style={{
                      borderRadius: 14, overflow: "hidden",
                      position: "relative", aspectRatio: "4/3",
                      cursor: "pointer",
                      transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.22)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    }}
                  >
                    <Image src={cat.img} alt={cat.name} fill sizes="220px" style={{ objectFit: "cover" }} />
                    {/* Dark overlay */}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%)",
                    }} />
                    {/* Name */}
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      padding: "14px 14px",
                    }}>
                      <p style={{
                        fontFamily: "var(--font-oswald)", fontWeight: 700,
                        color: "#fff", fontSize: "1.05rem",
                        textTransform: "uppercase", letterSpacing: "0.06em",
                        margin: 0,
                      }}>
                        {cat.name}
                      </p>
                    </div>
                    {/* Red bottom accent on hover */}
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      height: 3, background: "#E4002B",
                    }} />
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 4 ── TODAY'S DEALS ── */}
      <section style={{ background: "var(--bg-surface)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
              <div>
                <p style={{ color: "#E4002B", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>
                  Limited Time
                </p>
                <h2 style={{
                  fontFamily: "var(--font-oswald)", fontWeight: 900,
                  color: "var(--text-primary)", fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                  textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1,
                }}>
                  Today&apos;s Deals
                </h2>
              </div>
              <Link href="/menu?cat=deals" style={{
                color: "#E4002B", fontSize: "0.82rem", fontWeight: 700,
                textDecoration: "none", border: "1px solid rgba(228,0,43,0.35)",
                padding: "8px 20px", borderRadius: 999, whiteSpace: "nowrap",
              }}>
                All Deals →
              </Link>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
            {deals.map((deal, i) => (
              <FadeIn key={deal.id} delay={i * 80}>
                <DealCard deal={deal} index={i} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 5 ── POPULAR ITEMS ── */}
      <section style={{ background: "var(--bg-page)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
              <div>
                <p style={{ color: "#E4002B", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>
                  Best Sellers
                </p>
                <h2 style={{
                  fontFamily: "var(--font-oswald)", fontWeight: 900,
                  color: "var(--text-primary)", fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                  textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1,
                }}>
                  Popular Items
                </h2>
              </div>
              <Link href="/menu" style={{
                color: "#E4002B", fontSize: "0.82rem", fontWeight: 700,
                textDecoration: "none", whiteSpace: "nowrap",
              }}>
                Full Menu →
              </Link>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 20 }}>
            {popularItems.map((p, i) => (
              <FadeIn key={p.id} delay={i * 70}>
                <ProductCard product={p} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 6 ── WHATSAPP CTA ── */}
      <section style={{
        padding: "5rem 1.5rem",
        background: "linear-gradient(135deg, #0d2d00, #1a4d00, #0d2d00)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -60, right: -60, width: 300, height: 300,
          borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(circle, rgba(37,211,102,0.2) 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <FadeIn>
            <div style={{
              width: 72, height: 72, margin: "0 auto 24px", borderRadius: 20,
              background: "rgba(37,211,102,0.18)", border: "1px solid rgba(37,211,102,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg viewBox="0 0 32 32" fill="#25D366" style={{ width: 36, height: 36 }}>
                <path d="M16.003 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.332.627 4.605 1.82 6.604L2.667 29.333l6.912-1.783A13.266 13.266 0 0016.003 29.333C23.369 29.333 29.333 23.363 29.333 16S23.369 2.667 16.003 2.667zm6.033 16.035c-.329-.165-1.95-.961-2.252-1.073-.303-.11-.523-.165-.744.165-.22.33-.855 1.073-1.048 1.292-.193.22-.385.248-.715.083-.329-.165-1.393-.514-2.654-1.636-.982-.875-1.644-1.955-1.836-2.284-.193-.33-.02-.508.145-.672.15-.148.33-.385.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.744-1.793-1.019-2.455-.268-.644-.54-.556-.744-.567l-.633-.011a1.213 1.213 0 00-.88.413c-.302.33-1.155 1.128-1.155 2.752s1.183 3.19 1.347 3.411c.165.22 2.327 3.557 5.641 4.988.789.341 1.404.545 1.884.697.791.252 1.511.217 2.08.132.634-.095 1.951-.797 2.226-1.567.275-.77.275-1.43.193-1.567-.083-.137-.302-.22-.633-.385z"/>
              </svg>
            </div>
            <h2 style={{
              fontFamily: "var(--font-oswald)", fontWeight: 900, color: "#fff",
              fontSize: "clamp(2rem, 5vw, 3rem)", textTransform: "uppercase",
              letterSpacing: "0.04em", lineHeight: 1, marginBottom: 14,
            }}>
              Order on WhatsApp
            </h2>
            <p style={{ color: "#6ee7b7", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: 32 }}>
              Browse our menu, add to cart, and confirm your order in one tap on WhatsApp.{" "}
              <span style={{ color: "#4ade80", fontWeight: 600 }}>We reply within minutes!</span>
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="https://wa.me/923254695624"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  background: "#25D366", color: "#fff",
                  padding: "14px 32px", borderRadius: 999,
                  fontFamily: "var(--font-oswald)", fontWeight: 700,
                  fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.08em",
                  textDecoration: "none", boxShadow: "0 8px 28px rgba(37,211,102,0.4)",
                }}
              >
                <svg viewBox="0 0 32 32" fill="white" style={{ width: 18, height: 18 }}>
                  <path d="M16.003 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.332.627 4.605 1.82 6.604L2.667 29.333l6.912-1.783A13.266 13.266 0 0016.003 29.333C23.369 29.333 29.333 23.363 29.333 16S23.369 2.667 16.003 2.667zm6.033 16.035c-.329-.165-1.95-.961-2.252-1.073-.303-.11-.523-.165-.744.165-.22.33-.855 1.073-1.048 1.292-.193.22-.385.248-.715.083-.329-.165-1.393-.514-2.654-1.636-.982-.875-1.644-1.955-1.836-2.284-.193-.33-.02-.508.145-.672.15-.148.33-.385.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.744-1.793-1.019-2.455-.268-.644-.54-.556-.744-.567l-.633-.011a1.213 1.213 0 00-.88.413c-.302.33-1.155 1.128-1.155 2.752s1.183 3.19 1.347 3.411c.165.22 2.327 3.557 5.641 4.988.789.341 1.404.545 1.884.697.791.252 1.511.217 2.08.132.634-.095 1.951-.797 2.226-1.567.275-.77.275-1.43.193-1.567-.083-.137-.302-.22-.633-.385z"/>
                </svg>
                Chat: 0325-4695624
              </a>
              <Link href="/menu" style={{
                display: "inline-flex", alignItems: "center",
                color: "#fff", padding: "14px 28px", borderRadius: 999,
                fontFamily: "var(--font-oswald)", fontWeight: 700,
                fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.08em",
                textDecoration: "none", border: "2px solid rgba(255,255,255,0.28)",
              }}>
                Browse Menu →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
