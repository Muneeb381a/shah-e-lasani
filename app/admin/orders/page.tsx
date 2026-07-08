"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────
type OrderItem = {
  id:            string;
  product_name:  string;
  quantity:      number;
  unit_price:    number;
  selected_size: string | null;
  notes:         string | null;
};

type Order = {
  id:             string;
  customer_name:  string;
  customer_phone: string;
  address:        string;
  order_type:     string;
  payment_method: string;
  notes:          string;
  total_amount:   number;
  status:         string;
  created_at:     string;
  order_items:    OrderItem[];
};

// ── Constants ─────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: "Pending",   color: "#f59e0b", bg: "rgba(245,158,11,0.12)"  },
  confirmed: { label: "Confirmed", color: "#3b82f6", bg: "rgba(59,130,246,0.12)"  },
  preparing: { label: "Preparing", color: "#a855f7", bg: "rgba(168,85,247,0.12)"  },
  ready:     { label: "Ready",     color: "#22c55e", bg: "rgba(34,197,94,0.12)"   },
  delivered: { label: "Delivered", color: "#6b7280", bg: "rgba(107,114,128,0.12)" },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "rgba(239,68,68,0.12)"   },
};

const STATUS_ORDER = ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"];

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-PK", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function formatShortTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1)  return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24)   return `${diffH}h ago`;
  return d.toLocaleDateString("en-PK", { day: "2-digit", month: "short" });
}

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

// ── Print receipt ─────────────────────────────────────────────────────────────
function printOrder(order: Order) {
  const orderNum = order.id.slice(-6).toUpperCase();
  const isPickup = order.order_type === "pickup";
  const now      = new Date(order.created_at);
  const dateStr  = now.toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" });
  const timeStr  = now.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit", hour12: true });

  const itemRows = order.order_items.map((item) => {
    const label     = item.selected_size ? `${item.product_name} (${item.selected_size})` : item.product_name;
    const unitPrice = `Rs.${Number(item.unit_price).toLocaleString()}`;
    const total     = `Rs.${(item.unit_price * item.quantity).toLocaleString()}`;
    const noteRow   = item.notes
      ? `<tr><td></td><td colspan="3" style="font-size:10px;color:#555;padding-bottom:5px;font-style:italic;">  ↳ ${item.notes}</td></tr>`
      : "";
    return `
      <tr style="border-bottom:1px dotted #ccc;">
        <td style="padding:5px 6px 5px 0;text-align:center;font-weight:700;vertical-align:middle;width:22px;">${item.quantity}</td>
        <td style="padding:5px 4px;vertical-align:middle;">${label}</td>
        <td style="padding:5px 4px;text-align:right;vertical-align:middle;white-space:nowrap;width:60px;">${unitPrice}</td>
        <td style="padding:5px 0 5px 4px;text-align:right;font-weight:700;vertical-align:middle;white-space:nowrap;width:65px;">${total}</td>
      </tr>${noteRow}`;
  }).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Bill #${orderNum}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
    color: #111;
    background: #fff;
    width: 80mm;
    max-width: 80mm;
    padding: 10px 8px 20px;
  }
  .c  { text-align:center; }
  .r  { text-align:right; }
  .b  { font-weight:bold; }
  .xs { font-size:10px; }
  .sm { font-size:11px; }
  hr.dash   { border:none; border-top:1px dashed #000; margin:8px 0; }
  hr.solid  { border:none; border-top:1px solid  #000; margin:8px 0; }
  hr.thick  { border:none; border-top:2px solid  #000; margin:8px 0; }
  table { width:100%; border-collapse:collapse; }
  td, th { line-height:1.4; }
  @media print {
    @page { size:80mm auto; margin:0; }
    body  { padding:6px 8px 24px; }
  }
</style>
</head>
<body>

<!-- SHOP HEADER -->
<div class="c" style="padding:4px 0 6px;">
  <div style="font-size:7px;letter-spacing:5px;text-transform:uppercase;color:#555;margin-bottom:4px;">Welcome to</div>
  <div style="font-size:22px;font-weight:900;letter-spacing:2px;line-height:1;">SHAH-E-LASANI</div>
  <div style="font-size:11px;font-weight:700;letter-spacing:4px;margin-top:1px;">CAFE &amp; RESTAURANT</div>
  <hr class="dash" style="margin:6px 0;">
  <div class="sm">Chakrala Kulluwal Road, Sialkot</div>
  <div class="sm" style="margin-top:3px;font-weight:700;">0325-4695624</div>
  <div class="xs" style="margin-top:2px;color:#444;">www.shahelasanicafe.com</div>
</div>

<hr class="thick">

<!-- ORDER META -->
<table style="margin-bottom:2px;">
  <tr>
    <td class="b" style="font-size:13px;">Bill #${orderNum}</td>
    <td class="r xs">${dateStr}</td>
  </tr>
  <tr>
    <td>
      <span style="border:1.5px solid #000;padding:1px 7px;font-size:10px;font-weight:700;letter-spacing:1px;">
        ${isPickup ? "TAKEAWAY" : "DELIVERY"}
      </span>
    </td>
    <td class="r xs">${timeStr}</td>
  </tr>
</table>

<hr class="dash">

<!-- CUSTOMER -->
<table>
  <tr>
    <td class="xs b" style="width:46px;color:#444;padding:2px 0;">Name&nbsp;:</td>
    <td class="sm b" style="padding:2px 0;">${order.customer_name || "—"}</td>
  </tr>
  <tr>
    <td class="xs" style="color:#444;padding:2px 0;">Phone&nbsp;:</td>
    <td class="sm" style="padding:2px 0;">${order.customer_phone || "—"}</td>
  </tr>
  ${!isPickup ? `<tr>
    <td class="xs" style="color:#444;vertical-align:top;padding:2px 0;">Address:</td>
    <td class="xs" style="padding:2px 0;">${order.address || "—"}</td>
  </tr>` : ""}
</table>

<hr class="dash">

<!-- ITEMS HEADER -->
<table>
  <thead>
    <tr style="border-bottom:1px solid #000;">
      <th style="width:22px;text-align:center;padding-bottom:4px;" class="xs">QTY</th>
      <th style="text-align:left;padding-bottom:4px;" class="xs">ITEM</th>
      <th style="text-align:right;padding-bottom:4px;width:60px;" class="xs">RATE</th>
      <th style="text-align:right;padding-bottom:4px;width:65px;" class="xs">AMOUNT</th>
    </tr>
  </thead>
  <tbody>
    ${itemRows}
  </tbody>
</table>

<hr class="solid">

<!-- TOTAL -->
<table>
  <tr>
    <td class="b" style="font-size:14px;padding:3px 0;">TOTAL</td>
    <td class="r b" style="font-size:14px;padding:3px 0;">Rs. ${order.total_amount?.toLocaleString()}</td>
  </tr>
  <tr>
    <td class="xs" style="color:#444;padding-top:2px;">Payment&nbsp;:</td>
    <td class="r xs" style="padding-top:2px;">${order.payment_method || "—"}</td>
  </tr>
</table>

${order.notes ? `<hr class="dash"><div class="xs" style="color:#444;"><span class="b">Note:</span> ${order.notes}</div>` : ""}

<hr class="thick">

<!-- FOOTER -->
<div class="c xs" style="line-height:2;margin-top:2px;">
  <div class="b">*** THANK YOU FOR YOUR ORDER! ***</div>
  <div>Aap ka shukriya — Please visit again</div>
  <div style="margin-top:4px;font-size:9px;color:#555;letter-spacing:1px;">~ Shah-e-Lasani Cafe, Sialkot ~</div>
</div>

</body>
</html>`;

  const win = window.open("", "_blank", "width=420,height=700");
  if (!win) return;
  win.document.documentElement.innerHTML = html;
  win.focus();
  setTimeout(() => { win.print(); }, 500);
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
      color: cfg.color, background: cfg.bg,
      border: `1px solid ${cfg.color}44`,
      whiteSpace: "nowrap",
    }}>{cfg.label}</span>
  );
}

// ── Order detail modal ────────────────────────────────────────────────────────
function OrderDetailModal({ order, onClose, onStatusChange }: {
  order:          Order;
  onClose:        () => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [updating, setUpdating] = useState(false);

  async function changeStatus(newStatus: string) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) onStatusChange(order.id, newStatus);
    } finally {
      setUpdating(false);
    }
  }

  const orderNum    = order.id.slice(-6).toUpperCase();
  const isPickup    = order.order_type === "pickup";

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      }} />

      {/* Panel */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 101, width: "min(600px, 95vw)",
        maxHeight: "90vh", overflowY: "auto",
        background: "#141414",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20,
        boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontWeight: 800, color: "#fff", fontSize: 17 }}>
              Order #{orderNum}
            </div>
            <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>
              {formatTime(order.created_at)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={() => printOrder(order)}
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8, padding: "7px 14px",
                color: "#ccc", fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              🖨️ Print
            </button>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 8,
              background: "rgba(255,255,255,0.06)", border: "none",
              color: "#666", cursor: "pointer", fontSize: 18,
            }}>×</button>
          </div>
        </div>

        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Status + change */}
          <div>
            <div style={{ fontSize: 11, color: "#555", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
              Order Status
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {STATUS_ORDER.map((s) => {
                const cfg   = STATUS_CONFIG[s];
                const active = order.status === s;
                return (
                  <button key={s} onClick={() => !active && changeStatus(s)} disabled={updating || active}
                    style={{
                      padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                      cursor: active ? "default" : "pointer",
                      border: `1px solid ${active ? cfg.color : "rgba(255,255,255,0.1)"}`,
                      background: active ? cfg.bg : "transparent",
                      color: active ? cfg.color : "#555",
                      opacity: updating && !active ? 0.5 : 1,
                      transition: "all 0.15s",
                    }}
                  >{cfg.label}</button>
                );
              })}
            </div>
          </div>

          {/* Customer info */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "14px 16px",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px",
          }}>
            {[
              { label: "Customer",      value: order.customer_name    || "—" },
              { label: "Phone",         value: order.customer_phone   || "—" },
              { label: "Payment",       value: order.payment_method   || "—" },
              { label: "Order Type",    value: isPickup ? "🏃 Pickup" : "🚚 Home Delivery" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 13, color: "#ddd", fontWeight: 600 }}>{value}</div>
              </div>
            ))}
            {!isPickup && order.address && (
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Delivery Address</div>
                <div style={{ fontSize: 13, color: "#ddd" }}>{order.address}</div>
              </div>
            )}
          </div>

          {/* Items */}
          <div>
            <div style={{ fontSize: 11, color: "#555", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
              Items ({order.order_items?.length ?? 0})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(order.order_items ?? []).map((item) => (
                <div key={item.id} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10, padding: "11px 14px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: "#ddd", fontWeight: 600 }}>
                        {item.product_name}
                        {item.selected_size && <span style={{ color: "#666", fontWeight: 400, marginLeft: 6 }}>({item.selected_size})</span>}
                        <span style={{ color: "#555", marginLeft: 6 }}>×{item.quantity}</span>
                      </div>
                      {item.notes && (
                        <div style={{
                          marginTop: 5, fontSize: 11, color: "#888", lineHeight: 1.5,
                          background: "rgba(228,0,43,0.06)",
                          border: "1px solid rgba(228,0,43,0.14)",
                          borderRadius: 6, padding: "4px 8px",
                        }}>
                          {item.notes}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: "#F5A623", fontWeight: 700, marginLeft: 12, whiteSpace: "nowrap" }}>
                      Rs. {(item.unit_price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div style={{
            background: "rgba(245,166,35,0.07)",
            border: "1px solid rgba(245,166,35,0.18)",
            borderRadius: 12, padding: "14px 16px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ color: "#888", fontSize: 13 }}>Total Amount</span>
            <span style={{ fontWeight: 900, fontSize: "1.5rem", color: "#F5A623" }}>
              Rs. {order.total_amount?.toLocaleString()}
            </span>
          </div>

          {/* Notes */}
          {order.notes && (
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10, padding: "11px 14px",
            }}>
              <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Order Note</div>
              <div style={{ fontSize: 13, color: "#aaa" }}>{order.notes}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminOrdersPage() {
  const [orders,       setOrders]       = useState<Order[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search,       setSearch]       = useState("");
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [lastRefresh,  setLastRefresh]  = useState(new Date());
  const [newOrderAlert, setNewOrderAlert] = useState<string | null>(null); // customer name
  const intervalRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const orderIdsRef    = useRef<Set<string>>(new Set());

  function playBeep() {
    try {
      const ctx  = new AudioContext();
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0, ctx.currentTime);

      // Two-tone ding
      [0, 0.18].forEach((offset, i) => {
        const osc = ctx.createOscillator();
        osc.connect(gain);
        osc.frequency.value = i === 0 ? 880 : 1100;
        gain.gain.setValueAtTime(0.35, ctx.currentTime + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.35);
        osc.start(ctx.currentTime + offset);
        osc.stop(ctx.currentTime + offset + 0.35);
      });
    } catch {}
  }

  const fetchOrders = useCallback(async () => {
    try {
      const res  = await fetch("/api/orders");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? `HTTP ${res.status}`);
      }
      const list = Array.isArray(data) ? data : [];
      orderIdsRef.current = new Set(list.map((o: Order) => o.id));
      setOrders(list);
      setLastRefresh(new Date());
      setError("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Could not load orders: ${msg}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    intervalRef.current = setInterval(fetchOrders, 30000);

    // Supabase Realtime — listen for new orders
    const channel = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        async (payload) => {
          const newId = (payload.new as Order).id;
          if (orderIdsRef.current.has(newId)) return;

          // Fetch full order with items
          const res  = await fetch(`/api/orders/${newId}`);
          const full = res.ok ? await res.json() : payload.new;

          setOrders((prev) => {
            if (prev.find((o) => o.id === newId)) return prev;
            orderIdsRef.current.add(newId);
            return [full, ...prev];
          });

          setNewOrderAlert((full as Order).customer_name ?? "Customer");
          setLastRefresh(new Date());
          playBeep();

          // Change tab title
          document.title = "🔔 New Order! — Admin";
          setTimeout(() => { document.title = "Orders — Admin"; }, 8000);
        },
      )
      .subscribe();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  function handleStatusChange(id: string, newStatus: string) {
    setOrders((prev) =>
      prev.map((o) => o.id === id ? { ...o, status: newStatus } : o)
    );
  }

  const selectedOrder = orders.find((o) => o.id === selectedId) ?? null;

  // Filter + search
  const visible = orders.filter((o) => {
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const q           = search.toLowerCase();
    const matchSearch = !q || (
      (o.customer_name  ?? "").toLowerCase().includes(q) ||
      (o.customer_phone ?? "").toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q)
    );
    return matchStatus && matchSearch;
  });

  // Today stats
  const todayOrders  = orders.filter((o) => isToday(o.created_at));
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const todayTotal   = todayOrders.reduce((s, o) => s + (o.total_amount ?? 0), 0);

  return (
    <div>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Orders</h1>
          <div style={{ fontSize: 12, color: "#444" }}>
            Last updated: {lastRefresh.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}
            &nbsp;· Auto-refreshes every 30s
          </div>
        </div>
        <button
          onClick={() => { setLoading(true); fetchOrders(); }}
          style={{
            background: "rgba(228,0,43,0.12)",
            border: "1px solid rgba(228,0,43,0.25)",
            borderRadius: 8, color: "#ff6b6b",
            fontSize: 13, fontWeight: 600, padding: "8px 16px",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* ── New order alert banner ── */}
      {newOrderAlert && (
        <div
          onClick={() => setNewOrderAlert(null)}
          style={{
            marginBottom: 20,
            background: "linear-gradient(135deg,rgba(228,0,43,0.18),rgba(228,0,43,0.08))",
            border: "1px solid rgba(228,0,43,0.4)",
            borderRadius: 12, padding: "14px 18px",
            display: "flex", alignItems: "center", gap: 12,
            cursor: "pointer",
            animation: "pulse 1.5s ease-in-out 3",
          }}
        >
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: "#E4002B",
            boxShadow: "0 0 0 4px rgba(228,0,43,0.25)",
            animation: "ping 1s ease-in-out infinite",
            flexShrink: 0,
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>
              🔔 Naya Order Aaya!
            </div>
            <div style={{ color: "#ff8fa3", fontSize: 12, marginTop: 2 }}>
              {newOrderAlert} ka order abhi place hua — list mein sabse upar hai
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setNewOrderAlert(null); }}
            style={{
              background: "none", border: "none", color: "#666",
              cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 4,
            }}
          >×</button>
        </div>
      )}

      <style>{`
        @keyframes ping {
          0%, 100% { box-shadow: 0 0 0 4px rgba(228,0,43,0.25); }
          50%       { box-shadow: 0 0 0 8px rgba(228,0,43,0.1);  }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.85; }
        }
      `}</style>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Today's Orders", value: todayOrders.length,             color: "#3b82f6" },
          { label: "Pending",         value: pendingCount,                   color: "#f59e0b" },
          { label: "Today's Revenue", value: `Rs. ${todayTotal.toLocaleString()}`, color: "#F5A623" },
          { label: "Total Orders",    value: orders.length,                  color: "#6b7280" },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: "#0d0d0d",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12, padding: "16px 18px",
          }}>
            <div style={{ fontSize: 10, color: "#555", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, phone, order ID…"
          style={{
            background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, padding: "9px 14px", color: "#fff",
            fontSize: 13, outline: "none", flex: "1 1 200px",
          }}
        />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["all", ...STATUS_ORDER].map((s) => {
            const active = filterStatus === s;
            const label  = s === "all" ? "All" : STATUS_CONFIG[s].label;
            const color  = s === "all" ? "#888" : STATUS_CONFIG[s].color;
            return (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{
                  padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                  cursor: "pointer",
                  border: `1px solid ${active ? color : "rgba(255,255,255,0.1)"}`,
                  background: active ? `${color}18` : "transparent",
                  color: active ? color : "#555",
                  transition: "all 0.15s",
                }}
              >{label}</button>
            );
          })}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div style={{
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 10, padding: "14px 18px", color: "#fca5a5",
          fontSize: 13, marginBottom: 16,
        }}>
          ⚠️ {error}
          <div style={{ fontSize: 11, color: "#f87171", marginTop: 6 }}>
            Run SQL migration in Supabase: CREATE TABLE orders (...) — see setup guide.
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ color: "#444", fontSize: 14, padding: "40px 0", textAlign: "center" }}>
          Loading orders…
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && visible.length === 0 && (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          color: "#333", fontSize: 14,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>📋</div>
          {orders.length === 0
            ? "No orders yet. When a customer places an order, it will appear here."
            : "No orders match the current filter."}
        </div>
      )}

      {/* Orders list */}
      {!loading && visible.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {visible.map((order) => {
            const orderNum = order.id.slice(-6).toUpperCase();
            const isPickup = order.order_type === "pickup";
            const itemSummary = (order.order_items ?? [])
              .map((i) => `${i.quantity}× ${i.product_name}`)
              .join(", ");

            return (
              <div
                key={order.id}
                onClick={() => setSelectedId(order.id)}
                style={{
                  background: "#0d0d0d",
                  border: `1px solid ${order.status === "pending" ? "rgba(245,158,11,0.25)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 12, padding: "14px 18px",
                  cursor: "pointer", transition: "all 0.15s",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto auto",
                  gap: "0 16px",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(228,0,43,0.3)";
                  (e.currentTarget as HTMLDivElement).style.background  = "#111";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = order.status === "pending"
                    ? "rgba(245,158,11,0.25)"
                    : "rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLDivElement).style.background  = "#0d0d0d";
                }}
              >
                {/* Order # + time */}
                <div style={{ minWidth: 70 }}>
                  <div style={{ fontWeight: 800, color: "#fff", fontSize: 13 }}>#{orderNum}</div>
                  <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>{formatShortTime(order.created_at)}</div>
                </div>

                {/* Customer + items */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ color: "#ddd", fontWeight: 600, fontSize: 13 }}>
                      {order.customer_name || "Unknown"}
                    </span>
                    <span style={{ fontSize: 10, color: "#555" }}>
                      {order.customer_phone}
                    </span>
                    <span style={{
                      fontSize: 10, color: isPickup ? "#25D366" : "#3b82f6",
                      background: isPickup ? "rgba(37,211,102,0.1)" : "rgba(59,130,246,0.1)",
                      border: `1px solid ${isPickup ? "rgba(37,211,102,0.2)" : "rgba(59,130,246,0.2)"}`,
                      borderRadius: 4, padding: "1px 6px", fontWeight: 600,
                    }}>
                      {isPickup ? "PICKUP" : "DELIVERY"}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 11, color: "#555",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {itemSummary || "No items"}
                  </div>
                </div>

                {/* Total + payment */}
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, color: "#F5A623", fontSize: 14 }}>
                    Rs. {order.total_amount?.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>
                    {order.payment_method === "Cash on Delivery" ? "💵 COD" : "🏦 Bank"}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order detail modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedId(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
