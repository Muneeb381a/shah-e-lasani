const SHOP_WHATSAPP = "923254695624";

export type OrderForWhatsApp = {
  customerName:  string;
  customerPhone: string;
  orderType:     "delivery" | "pickup";
  address?:      string;
  items: {
    name:     string;
    size?:    string;
    notes?:   string;
    quantity: number;
    price:    number;
  }[];
  totalAmount:   number;
  paymentMethod: string;
};

export function buildWhatsAppUrl(order: OrderForWhatsApp): string {
  const itemLines: string[] = [];

  for (const item of order.items) {
    // Main item line
    const sizePart = item.size ? ` (${item.size})` : "";
    itemLines.push(
      `• *${item.name}*${sizePart} ×${item.quantity} — Rs. ${(item.price * item.quantity).toLocaleString()}`
    );

    // Deal customization selections (stored as "Label: Value · Label: Value")
    if (item.notes) {
      const parts = item.notes.split(" · ");
      for (const part of parts) {
        const colonIdx = part.indexOf(": ");
        if (colonIdx !== -1) {
          const label = part.slice(0, colonIdx).trim();
          const value = part.slice(colonIdx + 2).trim();
          if (label.toLowerCase().startsWith("note")) {
            itemLines.push(`   📝 _${value}_`);
          } else {
            itemLines.push(`   ↳ ${label}: *${value}*`);
          }
        } else {
          itemLines.push(`   ↳ ${part.trim()}`);
        }
      }
    }
  }

  const isPickup = order.orderType === "pickup";

  const lines = [
    `🍕 *SHAH-E-LASANI CAFE — Naya Order!*`,
    ``,
    isPickup
      ? `🏃 *Order Type:* PICKUP (Customer will collect)`
      : `🚚 *Order Type:* HOME DELIVERY`,
    ``,
    `👤 *Customer:* ${order.customerName}`,
    `📱 *Phone:* ${order.customerPhone}`,
    ...(isPickup ? [] : [`📍 *Address:* ${order.address}`]),
    ``,
    `🛒 *Order Details:*`,
    ...itemLines,
    ``,
    `💰 *Total: Rs. ${order.totalAmount.toLocaleString()}*`,
    `💳 *Payment:* ${order.paymentMethod}`,
    ...(order.paymentMethod.toLowerCase().includes("bank") || order.paymentMethod.toLowerCase().includes("transfer")
      ? [``, `📸 _Payment screenshot attached below_`]
      : []),
    ``,
    `_Order placed from website_`,
  ];

  const message = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${SHOP_WHATSAPP}?text=${message}`;
}
