import Link from "next/link";
import { deals, products } from "@/data/menu";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import DealCard from "@/components/DealCard";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";

function SectionHeading({
  label, title, subtitle, center = false,
}: { label: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div style={{ textAlign: center ? "center" : "left" }}>
      <p style={{
        color: "#E4002B", fontSize: "0.7rem", fontWeight: 700,
        letterSpacing: "0.28em", textTransform: "uppercase",
        fontFamily: "var(--font-oswald)", marginBottom: 12,
      }}>
        {label}
      </p>
      <h2 style={{
        fontFamily: "var(--font-oswald)", fontWeight: 900, color: "var(--text-primary)",
        fontSize: "clamp(1.9rem, 4vw, 3rem)", textTransform: "uppercase",
        letterSpacing: "0.04em", lineHeight: 1, marginBottom: 12,
        transition: "color 0.3s ease",
      }}>
        {title}
      </h2>
      <div style={{
        width: 60, height: 3,
        background: "linear-gradient(90deg, #E4002B, #F5A623)",
        borderRadius: 2, margin: center ? "0 auto 16px" : "0 0 16px",
      }} />
      {subtitle && (
        <p style={{
          color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.7,
          maxWidth: 520, margin: center ? "0 auto" : undefined,
          transition: "color 0.3s ease",
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const featuredPizzas  = products.filter((p) => p.categoryId === "cat-pizza"  && p.isAvailable).slice(0, 3);
  const featuredBurgers = products.filter((p) => p.categoryId === "cat-burger" && p.isAvailable).slice(0, 3);

  return (
    <div style={{ overflowX: "hidden" }}>

      {/* 1 ── HERO ── */}
      <HeroSection />

      {/* 2 ── TICKER ── */}
      <div style={{
        background: "#E4002B",
        overflow: "hidden",
        whiteSpace: "nowrap",
        padding: "13px 0",
        borderTop: "1px solid rgba(255,255,255,0.12)",
        borderBottom: "1px solid rgba(0,0,0,0.15)",
      }}>
        <div style={{ display: "inline-flex", animation: "ticker 28s linear infinite" }}>
          {[0, 1, 2].map((n) => (
            <span key={n} style={{
              display: "inline-flex", alignItems: "center", gap: 0,
              paddingRight: "3rem",
            }}>
              {[
                { icon: "🔥", text: "Free Delivery Above Rs. 1,000" },
                { icon: "🍕", text: "Fresh Made Every Order"        },
                { icon: "⚡", text: "30 Min Delivery"               },
                { icon: "🎁", text: "Amazing Deals Every Day"       },
                { icon: "📱", text: "Order on WhatsApp"             },
                { icon: "💯", text: "100% Fresh Ingredients"        },
                { icon: "🍔", text: "Juicy Zinger Burgers"          },
                { icon: "🍗", text: "Crispy Chicken Wings"          },
              ].map((item, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                  <span style={{
                    color: "#fff", fontSize: "0.72rem", fontWeight: 800,
                    letterSpacing: "0.16em", textTransform: "uppercase",
                    padding: "0 18px",
                  }}>
                    {item.icon}&nbsp;&nbsp;{item.text}
                  </span>
                  <span style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "0.6rem", padding: "0 4px",
                  }}>
                    ❙
                  </span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* 3 ── STATS ── */}
      <StatsSection />

      {/* 4 ── DEALS ── */}
      <section style={{ background: "var(--bg-page)", padding: "5rem 1.5rem", transition: "background 0.3s ease" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 40 }}>
              <SectionHeading label="🔥 Limited Time" title="Today's Best Deals"
                subtitle="Save big on our specially curated combo deals — perfect for one, two, or the whole family!" />
              <Link href="/menu?cat=deals" style={{
                display: "inline-flex", alignItems: "center", gap: 6, color: "#E4002B",
                fontSize: "0.82rem", fontWeight: 600, textDecoration: "none",
                border: "1px solid rgba(228,0,43,0.35)", padding: "8px 20px",
                borderRadius: 999, whiteSpace: "nowrap",
              }}>
                View All Deals →
              </Link>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
            {deals.map((deal, i) => (
              <FadeIn key={deal.id} delay={i * 100}><DealCard deal={deal} index={i} /></FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 5 ── HOW IT WORKS ── */}
      <section style={{ background: "var(--bg-surface)", padding: "5rem 1.5rem", transition: "background 0.3s ease" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <SectionHeading label="Simple Process" title="How to Order" center
                subtitle="Three easy steps and your food is on its way!" />
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              { step: "01", icon: "🍕", title: "Browse Menu",         desc: "Explore our pizzas, burgers, deals and more. Pick your favourites!" },
              { step: "02", icon: "🛒", title: "Add to Cart",          desc: "Choose your size, customise, and add items to your cart easily." },
              { step: "03", icon: "📱", title: "Confirm on WhatsApp",  desc: "Click 'Place Order' and confirm instantly on WhatsApp. Done!" },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 150}>
                <div style={{
                  background: "var(--bg-card)", border: "1px solid var(--border-card)",
                  borderRadius: 24, padding: "2rem", textAlign: "center",
                  position: "relative", transition: "background 0.3s ease, border-color 0.3s ease",
                }}>
                  <div style={{
                    position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                    background: "#E4002B", color: "#fff",
                    fontFamily: "var(--font-oswald)", fontWeight: 800,
                    fontSize: "0.65rem", letterSpacing: "0.14em",
                    padding: "5px 14px", borderRadius: 999,
                  }}>
                    STEP {item.step}
                  </div>
                  <div style={{
                    width: 80, height: 80, margin: "1rem auto 1.25rem",
                    borderRadius: 20, background: "rgba(228,0,43,0.1)",
                    border: "1px solid rgba(228,0,43,0.22)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.2rem",
                  }}>
                    {item.icon}
                  </div>
                  <h3 style={{
                    fontFamily: "var(--font-oswald)", fontWeight: 700, color: "var(--text-primary)",
                    fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.06em",
                    marginBottom: 12, transition: "color 0.3s ease",
                  }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.84rem", lineHeight: 1.65, transition: "color 0.3s ease" }}>
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 6 ── POPULAR PIZZAS ── */}
      <section style={{ background: "var(--bg-page)", padding: "5rem 1.5rem", transition: "background 0.3s ease" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 40 }}>
              <SectionHeading label="🍕 Must Try" title="Popular Pizzas" />
              <Link href="/menu?cat=pizzas" style={{ color: "#E4002B", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}>
                View All →
              </Link>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {featuredPizzas.map((p, i) => (
              <FadeIn key={p.id} delay={i * 120}><ProductCard product={p} /></FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 7 ── WHY CHOOSE US ── */}
      <section style={{ background: "var(--bg-surface)", padding: "5rem 1.5rem", transition: "background 0.3s ease" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <SectionHeading label="Our Promise" title="Why Shah-e-Lasani?" center />
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
            {[
              { icon: "🔥", title: "Freshly Made",    desc: "Every single order is prepared fresh — never reheated, never stale.",  color: "#E4002B" },
              { icon: "⚡", title: "Fast Delivery",   desc: "Average delivery in under 30 minutes. Hot food, right to your door.",   color: "#F5A623" },
              { icon: "💯", title: "Premium Quality", desc: "We use the finest ingredients. Taste the difference in every bite.",    color: "#4ade80" },
              { icon: "📱", title: "Easy Ordering",   desc: "Order via website and confirm on WhatsApp. Quick and hassle-free.",     color: "#25D366" },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 100}>
                <div style={{
                  background: "var(--bg-card)", border: "1px solid var(--border-card)",
                  borderRadius: 20, padding: "1.75rem",
                  transition: "background 0.3s ease, border-color 0.3s ease",
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16, marginBottom: 18,
                    background: `${item.color}18`, border: `1px solid ${item.color}35`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem",
                  }}>
                    {item.icon}
                  </div>
                  <h3 style={{
                    fontFamily: "var(--font-oswald)", fontWeight: 700, fontSize: "1.1rem",
                    textTransform: "uppercase", letterSpacing: "0.06em",
                    color: item.color, marginBottom: 10,
                  }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: 1.65, transition: "color 0.3s ease" }}>
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 8 ── POPULAR BURGERS ── */}
      <section style={{ background: "var(--bg-page)", padding: "5rem 1.5rem", transition: "background 0.3s ease" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 40 }}>
              <SectionHeading label="🍔 Fan Favourites" title="Juicy Burgers" />
              <Link href="/menu?cat=burgers" style={{ color: "#E4002B", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}>
                View All →
              </Link>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {featuredBurgers.map((p, i) => (
              <FadeIn key={p.id} delay={i * 120}><ProductCard product={p} /></FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 9 ── TESTIMONIALS ── */}
      <section style={{ background: "var(--bg-surface)", padding: "5rem 1.5rem", transition: "background 0.3s ease" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <SectionHeading label="Happy Customers" title="What People Say" center />
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 20 }}>
            {[
              { name: "Muhammad Ali", city: "Lahore",    initial: "M", color: "#E4002B",
                review: "Best pizza in the area! The Chicken Tikka pizza was absolutely delicious. Delivery was super fast and food came hot. Will definitely order again!", stars: 5 },
              { name: "Fatima Khan",  city: "Karachi",   initial: "F", color: "#F5A623",
                review: "Family Deal was amazing value for money. Two large pizzas, drinks, garlic bread — everyone loved it! Kids already asking to order again this weekend.", stars: 5 },
              { name: "Ahmed Raza",   city: "Islamabad", initial: "A", color: "#4ade80",
                review: "The Zinger Burger is my new favourite! Crispy, juicy, and perfectly spiced. WhatsApp ordering is so convenient. 10/10 would recommend!", stars: 5 },
            ].map((t, i) => (
              <FadeIn key={t.name} delay={i * 120}>
                <div style={{
                  background: "var(--bg-card)", border: "1px solid var(--border-card)",
                  borderRadius: 24, padding: "1.75rem",
                  display: "flex", flexDirection: "column",
                  transition: "background 0.3s ease, border-color 0.3s ease",
                }}>
                  <div style={{
                    fontFamily: "var(--font-oswald)", fontWeight: 900,
                    fontSize: "4rem", lineHeight: 1, color: "#E4002B",
                    opacity: 0.25, marginBottom: 12, userSelect: "none",
                  }}>&ldquo;</div>
                  <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <span key={si} style={{ color: "#F5A623", fontSize: "0.9rem" }}>★</span>
                    ))}
                  </div>
                  <p style={{
                    color: "var(--text-secondary)", fontSize: "0.84rem", lineHeight: 1.7,
                    fontStyle: "italic", flex: 1, marginBottom: 20,
                    transition: "color 0.3s ease",
                  }}>
                    &ldquo;{t.review}&rdquo;
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: "50%", background: t.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-oswald)", fontWeight: 700, color: "#fff", fontSize: "1rem",
                    }}>
                      {t.initial}
                    </div>
                    <div>
                      <p style={{ color: "var(--text-primary)", fontSize: "0.88rem", fontWeight: 600, transition: "color 0.3s ease" }}>
                        {t.name}
                      </p>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.72rem", transition: "color 0.3s ease" }}>
                        {t.city}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 10 ── WHATSAPP CTA ── */}
      <section style={{
        padding: "5rem 1.5rem", position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #0d2d00 0%, #1a4d00 50%, #0d2d00 100%)",
      }}>
        <div style={{
          position: "absolute", top: -40, right: -40, width: 260, height: 260,
          borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(circle, rgba(37,211,102,0.18) 0%, transparent 70%)", filter: "blur(30px)",
        }} />
        <div style={{
          position: "absolute", bottom: -40, left: -40, width: 200, height: 200,
          borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(circle, rgba(37,211,102,0.12) 0%, transparent 70%)", filter: "blur(25px)",
        }} />
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <FadeIn>
            <div style={{
              width: 80, height: 80, margin: "0 auto 1.5rem", borderRadius: 22,
              background: "rgba(37,211,102,0.2)", border: "1px solid rgba(37,211,102,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem",
            }}>📱</div>
            <h2 style={{
              fontFamily: "var(--font-oswald)", fontWeight: 900, color: "#fff",
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)", textTransform: "uppercase",
              letterSpacing: "0.04em", lineHeight: 1, marginBottom: 16,
            }}>
              Order on WhatsApp
            </h2>
            <p style={{ color: "#6ee7b7", fontSize: "1rem", lineHeight: 1.7, marginBottom: 36 }}>
              Place your order online, then confirm in one tap on WhatsApp.<br />
              <span style={{ color: "#4ade80", fontWeight: 600 }}>We reply within minutes!</span>
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://wa.me/923254695624" target="_blank" rel="noopener noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "#25D366", color: "#fff",
                padding: "15px 32px", borderRadius: 999,
                fontFamily: "var(--font-oswald)", fontWeight: 700,
                fontSize: "1.05rem", textTransform: "uppercase", letterSpacing: "0.08em",
                textDecoration: "none", boxShadow: "0 8px 30px rgba(37,211,102,0.45)",
              }}>
                <svg viewBox="0 0 32 32" fill="white" style={{ width: 20, height: 20 }}>
                  <path d="M16.003 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.332.627 4.605 1.82 6.604L2.667 29.333l6.912-1.783A13.266 13.266 0 0016.003 29.333C23.369 29.333 29.333 23.363 29.333 16S23.369 2.667 16.003 2.667zm6.033 16.035c-.329-.165-1.95-.961-2.252-1.073-.303-.11-.523-.165-.744.165-.22.33-.855 1.073-1.048 1.292-.193.22-.385.248-.715.083-.329-.165-1.393-.514-2.654-1.636-.982-.875-1.644-1.955-1.836-2.284-.193-.33-.02-.508.145-.672.15-.148.33-.385.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.744-1.793-1.019-2.455-.268-.644-.54-.556-.744-.567l-.633-.011a1.213 1.213 0 00-.88.413c-.302.33-1.155 1.128-1.155 2.752s1.183 3.19 1.347 3.411c.165.22 2.327 3.557 5.641 4.988.789.341 1.404.545 1.884.697.791.252 1.511.217 2.08.132.634-.095 1.951-.797 2.226-1.567.275-.77.275-1.43.193-1.567-.083-.137-.302-.22-.633-.385z"/>
                </svg>
                Chat Now: 0325-4695624
              </a>
              <Link href="/menu" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                color: "#fff", padding: "15px 32px", borderRadius: 999,
                fontFamily: "var(--font-oswald)", fontWeight: 700,
                fontSize: "1.05rem", textTransform: "uppercase", letterSpacing: "0.08em",
                textDecoration: "none", border: "2px solid rgba(255,255,255,0.3)",
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
