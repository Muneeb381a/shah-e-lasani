"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type PaymentMethod = "COD" | "BANK_TRANSFER";
type OrderType    = "delivery" | "pickup";

const CAFE_ADDRESS = "Chakrala Kulluwal Road, Jamia Masjid Hanafiya Road Wali, Sialkot";

export default function CartPage() {
  const { state, dispatch, totalAmount } = useCart();
  const router = useRouter();

  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [form, setForm] = useState({
    customerName: "", customerPhone: "", address: "",
    paymentMethod: "COD" as PaymentMethod,
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const totalItems = state.items.reduce((n, i) => n + i.quantity, 0);
  const isPickup   = orderType === "pickup";

  if (state.items.length === 0) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg-page)", padding: "2rem",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>🛒</div>
          <h2 style={{
            fontFamily: "var(--font-oswald)", fontWeight: 800, fontSize: "2rem",
            color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.06em",
            marginBottom: 10,
          }}>Cart is Empty</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 28 }}>Add some items to your cart first!</p>
          <Link href="/menu" style={{
            display: "inline-block", background: "#E4002B", color: "#fff",
            padding: "13px 32px", borderRadius: 999, textDecoration: "none",
            fontFamily: "var(--font-oswald)", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.08em",
            boxShadow: "0 8px 24px rgba(228,0,43,0.4)",
          }}>Browse Menu</Link>
        </div>
      </div>
    );
  }

  async function handleOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerName.trim() || !form.customerPhone.trim()) {
      setError("Please fill in your name and phone number.");
      return;
    }
    if (!isPickup && !form.address.trim()) {
      setError("Please enter your delivery address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const orderData = {
        customerName:  form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        orderType,
        address:       isPickup ? "PICKUP — Customer collecting" : form.address.trim(),
        items:         state.items.map((i) => ({ name: i.name, size: i.size, quantity: i.quantity, price: i.price })),
        totalAmount,
        paymentMethod: form.paymentMethod === "COD" ? "Cash on Delivery" : "Bank Transfer",
      };
      await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      }).catch(() => {});
      const waUrl = buildWhatsAppUrl(orderData);
      dispatch({ type: "CLEAR_CART" });
      router.push(`/order-success?wa=${encodeURIComponent(waUrl)}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const fieldStyle: React.CSSProperties = {
    width: "100%", padding: "13px 16px",
    background: "var(--bg-input)", border: "1px solid var(--border-input)",
    borderRadius: 12, color: "var(--text-primary)",
    fontFamily: "var(--font-open-sans)", fontSize: "0.9rem",
    outline: "none", transition: "border-color 0.2s, background 0.3s ease",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", color: "var(--text-muted)",
    fontSize: "0.72rem", fontWeight: 600,
    letterSpacing: "0.15em", textTransform: "uppercase",
    marginBottom: 8,
  };
  const cardStyle: React.CSSProperties = {
    background: "var(--bg-card)", border: "1px solid var(--border-card)",
    borderRadius: 20, padding: "24px",
    transition: "background 0.3s ease, border-color 0.3s ease",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", transition: "background 0.3s ease" }}>

      {/* Page header */}
      <div style={{
        background: "var(--bg-surface)", borderBottom: "1px solid var(--border-subtle)",
        padding: "2rem 1.5rem",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Link href="/menu" style={{
            color: "var(--text-muted)", fontSize: "0.8rem", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 12,
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#E4002B"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"; }}
          >← Back to Menu</Link>
          <h1 style={{
            fontFamily: "var(--font-oswald)", fontWeight: 900, color: "var(--text-primary)",
            fontSize: "clamp(2rem, 5vw, 3rem)", textTransform: "uppercase",
            letterSpacing: "0.04em", lineHeight: 1,
          }}>Checkout</h1>
          <div style={{ width: 50, height: 3, background: "linear-gradient(90deg,#E4002B,#F5A623)", borderRadius: 2, marginTop: 12 }} />
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{
        maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 28, alignItems: "start",
      }}>

        <form onSubmit={handleOrder} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* ── STEP 1: Pickup or Delivery ── */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, background: "#E4002B",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
              }}>📦</div>
              <h2 style={{
                fontFamily: "var(--font-oswald)", fontWeight: 700, color: "var(--text-primary)",
                fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.08em",
              }}>Order Type</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {([
                {
                  value: "delivery" as OrderType,
                  icon: "🚚",
                  title: "Home Delivery",
                  desc: "We bring it to your door",
                },
                {
                  value: "pickup" as OrderType,
                  icon: "🏃",
                  title: "Pickup",
                  desc: "Collect from our cafe",
                },
              ]).map((opt) => {
                const sel = orderType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setOrderType(opt.value)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      gap: 8, padding: "18px 12px",
                      borderRadius: 16,
                      border: `2px solid ${sel ? "#E4002B" : "var(--border-card)"}`,
                      background: sel ? "rgba(228,0,43,0.07)" : "var(--bg-input)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: sel ? "0 0 0 4px rgba(228,0,43,0.1)" : "none",
                    }}
                  >
                    <span style={{ fontSize: "2rem" }}>{opt.icon}</span>
                    <span style={{
                      fontWeight: 700, fontSize: "0.88rem",
                      color: sel ? "#E4002B" : "var(--text-primary)",
                    }}>{opt.title}</span>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "center" }}>
                      {opt.desc}
                    </span>
                    {sel && (
                      <span style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: "#E4002B", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.65rem", color: "#fff", fontWeight: 900,
                      }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Pickup info box */}
            {isPickup && (
              <div style={{
                marginTop: 14, padding: "14px 16px",
                background: "rgba(37,211,102,0.07)",
                border: "1px solid rgba(37,211,102,0.2)",
                borderRadius: 12,
                animation: "slideDown 0.2s ease both",
              }}>
                <p style={{ color: "#25D366", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                  📍 Pickup Location
                </p>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.83rem", lineHeight: 1.6, margin: 0 }}>
                  {CAFE_ADDRESS}
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: 8 }}>
                  Your order will be ready in <strong style={{ color: "var(--text-secondary)" }}>15–20 minutes</strong>. We&apos;ll confirm on WhatsApp.
                </p>
              </div>
            )}
          </div>

          {/* ── STEP 2: Details ── */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, background: "#E4002B",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem",
              }}>👤</div>
              <h2 style={{
                fontFamily: "var(--font-oswald)", fontWeight: 700, color: "var(--text-primary)",
                fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.08em",
              }}>
                {isPickup ? "Your Details" : "Delivery Details"}
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input type="text" value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  placeholder="Your full name" required style={fieldStyle}
                  onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#E4002B"; }}
                  onBlur={(e)  => { (e.currentTarget as HTMLInputElement).style.borderColor = "var(--border-input)"; }}
                />
              </div>
              <div>
                <label style={labelStyle}>Phone Number *</label>
                <input type="tel" value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                  placeholder="03XX-XXXXXXX" required style={fieldStyle}
                  onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#E4002B"; }}
                  onBlur={(e)  => { (e.currentTarget as HTMLInputElement).style.borderColor = "var(--border-input)"; }}
                />
              </div>

              {/* Address — only shown for delivery */}
              {!isPickup && (
                <div style={{ animation: "slideDown 0.2s ease both" }}>
                  <label style={labelStyle}>Delivery Address *</label>
                  <textarea value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="House/Flat #, Street, Area, City"
                    required={!isPickup} rows={3}
                    style={{ ...fieldStyle, resize: "none" }}
                    onFocus={(e) => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = "#E4002B"; }}
                    onBlur={(e)  => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = "var(--border-input)"; }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── STEP 3: Payment ── */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, background: "#E4002B",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem",
              }}>💳</div>
              <h2 style={{
                fontFamily: "var(--font-oswald)", fontWeight: 700, color: "var(--text-primary)",
                fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.08em",
              }}>Payment Method</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {([
                { value: "COD",           label: "Cash on Delivery", icon: "💵", desc: isPickup ? "Pay when you collect" : "Pay when your order arrives" },
                { value: "BANK_TRANSFER", label: "Bank Transfer",    icon: "🏦", desc: "Transfer & share screenshot" },
              ] as { value: PaymentMethod; label: string; icon: string; desc: string }[]).map((m) => {
                const sel = form.paymentMethod === m.value;
                return (
                  <label key={m.value} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 16px", borderRadius: 14,
                    border: `1px solid ${sel ? "#E4002B" : "var(--border-card)"}`,
                    background: sel ? "rgba(228,0,43,0.07)" : "transparent",
                    cursor: "pointer", transition: "all 0.2s",
                  }}>
                    <input type="radio" name="paymentMethod" value={m.value}
                      checked={sel} onChange={() => setForm({ ...form, paymentMethod: m.value })}
                      style={{ accentColor: "#E4002B" }}
                    />
                    <span style={{ fontSize: "1.4rem" }}>{m.icon}</span>
                    <div>
                      <div style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.88rem" }}>{m.label}</div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.72rem", marginTop: 2 }}>{m.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
            {form.paymentMethod === "BANK_TRANSFER" && (
              <div style={{
                marginTop: 14, padding: "14px 16px",
                background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.18)", borderRadius: 12,
              }}>
                <p style={{ color: "#F5A623", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
                  Account Details
                </p>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginBottom: 3 }}>
                  JazzCash / Easypaisa: <strong>0325-4695624</strong>
                </p>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                  Account Name: <strong>SHAH-E-LASANI CAFE</strong>
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.72rem", marginTop: 8, lineHeight: 1.5 }}>
                  Transfer the amount and share payment screenshot on WhatsApp after placing your order.
                </p>
              </div>
            )}
          </div>

          {error && (
            <div style={{
              padding: "12px 16px", borderRadius: 12,
              background: "rgba(127,29,29,0.3)", border: "1px solid rgba(239,68,68,0.4)",
              color: "#fca5a5", fontSize: "0.85rem",
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "16px",
            background: loading ? "var(--text-muted)" : "#E4002B", color: "#fff",
            border: "none", borderRadius: 999, cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "var(--font-oswald)", fontWeight: 700,
            fontSize: "1.05rem", textTransform: "uppercase", letterSpacing: "0.08em",
            boxShadow: loading ? "none" : "0 8px 28px rgba(228,0,43,0.45)",
            transition: "all 0.2s",
          }}>
            {loading ? "Placing Order…" : "Place Order & Confirm on WhatsApp 📱"}
          </button>
        </form>

        {/* ── Order Summary ── */}
        <div style={{ ...cardStyle, position: "sticky", top: 80 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "#E4002B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>🧾</div>
            <h2 style={{
              fontFamily: "var(--font-oswald)", fontWeight: 700, color: "var(--text-primary)",
              fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.08em",
            }}>Order Summary</h2>
          </div>

          {/* Order type badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "7px 14px", borderRadius: 999, marginBottom: 16,
            background: isPickup ? "rgba(37,211,102,0.1)" : "rgba(228,0,43,0.1)",
            border: `1px solid ${isPickup ? "rgba(37,211,102,0.25)" : "rgba(228,0,43,0.25)"}`,
          }}>
            <span>{isPickup ? "🏃" : "🚚"}</span>
            <span style={{
              fontSize: "0.75rem", fontWeight: 700,
              color: isPickup ? "#25D366" : "#E4002B",
              letterSpacing: "0.05em",
            }}>
              {isPickup ? "PICKUP" : "HOME DELIVERY"}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {state.items.map((item) => (
              <div key={item.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                paddingBottom: 10, borderBottom: "1px solid var(--border-subtle)",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 500 }}>
                    {item.name}
                  </span>
                  {item.size && <span style={{ color: "var(--text-muted)", fontSize: "0.72rem", marginLeft: 6 }}>({item.size})</span>}
                  <span style={{ color: "var(--text-faint)", fontSize: "0.72rem", marginLeft: 6 }}>×{item.quantity}</span>
                </div>
                <span style={{ color: "#F5A623", fontSize: "0.88rem", fontWeight: 700, marginLeft: 12, whiteSpace: "nowrap" }}>
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Delivery / Pickup note */}
          <div style={{
            padding: "10px 14px", borderRadius: 10,
            background: "var(--bg-input)", marginBottom: 16,
            display: "flex", alignItems: "center", gap: 8,
            border: "1px solid var(--border-subtle)",
          }}>
            <span style={{ fontSize: "0.9rem" }}>{isPickup ? "🏃" : "🚚"}</span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
              {isPickup
                ? "Pickup ready in 15–20 min"
                : "Free delivery on orders above Rs. 1,000"}
            </span>
          </div>

          <div style={{
            padding: "14px 16px",
            background: "rgba(245,166,35,0.08)",
            border: "1px solid rgba(245,166,35,0.18)",
            borderRadius: 14,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Total ({totalItems} item{totalItems !== 1 ? "s" : ""})
            </div>
            <span style={{
              fontFamily: "var(--font-oswald)", fontWeight: 900,
              color: "#F5A623", fontSize: "1.75rem", lineHeight: 1,
            }}>
              Rs. {totalAmount.toLocaleString()}
            </span>
          </div>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <p style={{ color: "var(--text-faint)", fontSize: "0.72rem" }}>
              Shah-e-Lasani Cafe • WhatsApp: 0325-4695624
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
