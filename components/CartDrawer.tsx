"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";

export default function CartDrawer() {
  const { state, dispatch, totalItems, totalAmount } = useCart();
  const { theme } = useTheme();
  const dark = theme === "dark";

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => dispatch({ type: "CLOSE_CART" })}
        style={{
          position: "fixed", inset: 0, zIndex: 50,
          background: dark ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "min(420px, 100vw)", zIndex: 51,
        background: "var(--bg-card-2, var(--bg-card))",
        borderLeft: "1px solid var(--border-card)",
        display: "flex", flexDirection: "column",
        boxShadow: dark ? "-24px 0 70px rgba(0,0,0,0.7)" : "-24px 0 70px rgba(0,0,0,0.15)",
        animation: "fadeInRight 0.3s ease both",
        transition: "background 0.3s ease",
      }}>

        {/* Header */}
        <div style={{
          padding: "18px 20px",
          borderBottom: "1px solid var(--border-card)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12, background: "#E4002B",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem", boxShadow: "0 4px 14px rgba(228,0,43,0.35)",
            }}>
              🛒
            </div>
            <div>
              <div style={{
                fontFamily: "var(--font-oswald)", fontWeight: 700, color: "var(--text-primary)",
                fontSize: "1.1rem", letterSpacing: "0.06em", textTransform: "uppercase",
                transition: "color 0.3s ease",
              }}>
                Your Cart
              </div>
              {totalItems > 0 && (
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2 }}>
                  {totalItems} item{totalItems !== 1 ? "s" : ""} — Rs. {totalAmount.toLocaleString()}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => dispatch({ type: "CLOSE_CART" })}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
              border: "none", color: "var(--text-muted)", cursor: "pointer",
              fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#E4002B"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {state.items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 58, marginBottom: 16 }}>🛒</div>
              <p style={{ color: "var(--text-muted)", marginBottom: 20, fontSize: "0.9rem" }}>Your cart is empty</p>
              <button
                onClick={() => dispatch({ type: "CLOSE_CART" })}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#E4002B", fontSize: "0.85rem", textDecoration: "underline",
                }}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {state.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: dark ? "#1a1a1a" : "#f5f5f5",
                    border: "1px solid var(--border-card)",
                    borderRadius: 16, padding: "13px 15px",
                    display: "flex", alignItems: "center", gap: 12,
                    transition: "background 0.3s ease",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      color: "var(--text-primary)", fontSize: "0.88rem",
                      fontWeight: 600, marginBottom: 2,
                      transition: "color 0.3s ease",
                    }}>
                      {item.name}
                    </p>
                    {item.size && (
                      <p style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>{item.size}</p>
                    )}
                    <p style={{ color: "#F5A623", fontSize: "0.9rem", fontWeight: 700, marginTop: 3 }}>
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      onClick={() => dispatch({ type: "UPDATE_QUANTITY", id: item.id, quantity: item.quantity - 1 })}
                      style={{
                        width: 30, height: 30, borderRadius: 8,
                        background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
                        border: "none", color: "var(--text-primary)", cursor: "pointer", fontSize: "1.1rem",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "background 0.2s",
                      }}
                    >
                      −
                    </button>
                    <span style={{
                      color: "var(--text-primary)", fontSize: "0.9rem", fontWeight: 700,
                      minWidth: 18, textAlign: "center",
                    }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => dispatch({ type: "UPDATE_QUANTITY", id: item.id, quantity: item.quantity + 1 })}
                      style={{
                        width: 30, height: 30, borderRadius: 8,
                        background: "rgba(228,0,43,0.15)", border: "1px solid rgba(228,0,43,0.3)",
                        color: "#E4002B", cursor: "pointer", fontSize: "1.1rem",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "background 0.2s",
                      }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => dispatch({ type: "REMOVE_ITEM", id: item.id })}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "var(--text-faint)", fontSize: "1rem", transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#E4002B"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-faint)"; }}
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div style={{ padding: 20, borderTop: "1px solid var(--border-card)" }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 16, padding: "13px 16px",
              background: "rgba(245,166,35,0.08)",
              border: "1px solid rgba(245,166,35,0.18)",
              borderRadius: 14,
            }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                Total ({totalItems} item{totalItems !== 1 ? "s" : ""})
              </span>
              <span style={{
                fontFamily: "var(--font-oswald)", fontWeight: 900,
                color: "#F5A623", fontSize: "1.55rem",
              }}>
                Rs. {totalAmount.toLocaleString()}
              </span>
            </div>

            <Link
              href="/cart"
              onClick={() => dispatch({ type: "CLOSE_CART" })}
              style={{
                display: "block", width: "100%",
                background: "#E4002B", color: "#fff",
                textAlign: "center", padding: "14px",
                borderRadius: 999, textDecoration: "none",
                fontFamily: "var(--font-oswald)", fontWeight: 700,
                fontSize: "1rem", letterSpacing: "0.08em", textTransform: "uppercase",
                boxShadow: "0 6px 24px rgba(228,0,43,0.4)",
                marginBottom: 10, boxSizing: "border-box",
              }}
            >
              Proceed to Checkout →
            </Link>

            <button
              onClick={() => dispatch({ type: "CLEAR_CART" })}
              style={{
                display: "block", width: "100%",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-muted)", textAlign: "center",
                fontSize: "0.8rem", padding: "8px", transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#E4002B"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
