"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer style={{
      background: "var(--bg-surface)",
      borderTop: "1px solid var(--border-subtle)",
      transition: "background 0.3s ease",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "3.5rem 1.5rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 36,
        }}>

          {/* Brand */}
          <div style={{ gridColumn: "span 1" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: 16, gap: 0 }}>
              {/* Logo image */}
              <div style={{
                width: 54, height: 54, borderRadius: 16, overflow: "hidden",
                position: "relative", flexShrink: 0,
                boxShadow: "0 4px 20px rgba(228,0,43,0.3), 0 0 0 2px rgba(228,0,43,0.2)",
                marginBottom: 12,
              }}>
                <Image src="/shahelasani.png" alt="Shah-e-Lasani Cafe" fill sizes="54px" style={{ objectFit: "cover" }} />
              </div>
              {/* Name + Cafe wrapped so Cafe centers relative to name width */}
              <div style={{ display: "inline-block" }}>
                <div style={{
                  fontFamily: "var(--font-oswald)", fontWeight: 800,
                  color: "#E4002B",
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  fontSize: "1rem", lineHeight: 1,
                }}>
                  Shah-e-Lasani
                </div>
                <div style={{
                  fontFamily: "var(--font-oswald)", fontWeight: 700,
                  color: "var(--text-primary)",
                  textTransform: "uppercase", letterSpacing: "0.32em",
                  fontSize: "0.65rem", marginTop: 3,
                  textAlign: "center",
                }}>
                  Cafe
                </div>
              </div>
            </div>
            <p style={{
              color: "var(--text-muted)", fontSize: "0.82rem",
              lineHeight: 1.7, marginBottom: 20,
              transition: "color 0.3s ease",
            }}>
              Delicious food, fast delivery. Order now and taste the difference!
            </p>
            <a
              href="https://wa.me/923254695624" target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#25D366", color: "#fff",
                padding: "9px 18px", borderRadius: 999,
                fontSize: "0.82rem", fontWeight: 600, textDecoration: "none",
                boxShadow: "0 4px 14px rgba(37,211,102,0.35)",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"; }}
            >
              <svg viewBox="0 0 32 32" fill="white" style={{ width: 16, height: 16 }}>
                <path d="M16.003 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.332.627 4.605 1.82 6.604L2.667 29.333l6.912-1.783A13.266 13.266 0 0016.003 29.333C23.369 29.333 29.333 23.363 29.333 16S23.369 2.667 16.003 2.667zm6.033 16.035c-.329-.165-1.95-.961-2.252-1.073-.303-.11-.523-.165-.744.165-.22.33-.855 1.073-1.048 1.292-.193.22-.385.248-.715.083-.329-.165-1.393-.514-2.654-1.636-.982-.875-1.644-1.955-1.836-2.284-.193-.33-.02-.508.145-.672.15-.148.33-.385.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.744-1.793-1.019-2.455-.268-.644-.54-.556-.744-.567l-.633-.011a1.213 1.213 0 00-.88.413c-.302.33-1.155 1.128-1.155 2.752s1.183 3.19 1.347 3.411c.165.22 2.327 3.557 5.641 4.988.789.341 1.404.545 1.884.697.791.252 1.511.217 2.08.132.634-.095 1.951-.797 2.226-1.567.275-.77.275-1.43.193-1.567-.083-.137-.302-.22-.633-.385z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontFamily: "var(--font-oswald)", fontWeight: 700, color: "var(--text-primary)",
              textTransform: "uppercase", letterSpacing: "0.12em",
              fontSize: "0.82rem", marginBottom: 20,
              transition: "color 0.3s ease",
            }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { href: "/",                label: "Home"        },
                { href: "/menu",            label: "Full Menu"   },
                { href: "/menu?cat=deals",  label: "Deals 🔥"   },
                { href: "/menu?cat=pizzas", label: "Pizzas 🍕"   },
                { href: "/menu?cat=burgers",label: "Burgers 🍔"  },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{
                    color: "var(--text-muted)", fontSize: "0.84rem",
                    textDecoration: "none", transition: "color 0.2s",
                  }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#E4002B"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"; }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              fontFamily: "var(--font-oswald)", fontWeight: 700, color: "var(--text-primary)",
              textTransform: "uppercase", letterSpacing: "0.12em",
              fontSize: "0.82rem", marginBottom: 20,
              transition: "color 0.3s ease",
            }}>
              Contact
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{ fontSize: "1.1rem" }}>📱</span>
                <div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>
                    WhatsApp
                  </p>
                  <a href="https://wa.me/923254695624" target="_blank" rel="noopener noreferrer"
                    style={{ color: "#25D366", fontSize: "0.84rem", fontWeight: 600, textDecoration: "none" }}>
                    0325-4695624
                  </a>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{ fontSize: "1.1rem" }}>📦</span>
                <div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>
                    Delivery
                  </p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.84rem", transition: "color 0.3s ease" }}>
                    Home delivery available
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 style={{
              fontFamily: "var(--font-oswald)", fontWeight: 700, color: "var(--text-primary)",
              textTransform: "uppercase", letterSpacing: "0.12em",
              fontSize: "0.82rem", marginBottom: 20,
              transition: "color 0.3s ease",
            }}>
              Opening Hours
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { day: "Mon – Fri",  time: "12:00 PM – 11:00 PM" },
                { day: "Saturday",   time: "12:00 PM – 12:00 AM" },
                { day: "Sunday",     time: "1:00 PM – 11:00 PM"  },
              ].map((h) => (
                <div key={h.day}>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    {h.day}
                  </span>
                  <br />
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.84rem", transition: "color 0.3s ease" }}>
                    {h.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: "1px solid var(--border-subtle)",
        padding: "16px 1.5rem",
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
        }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
            © {new Date().getFullYear()} SHAH-E-LASANI CAFE. All rights reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              className="animate-glow-red"
              style={{ width: 8, height: 8, borderRadius: "50%", background: "#E4002B" }}
            />
            <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
              Currently accepting orders
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
