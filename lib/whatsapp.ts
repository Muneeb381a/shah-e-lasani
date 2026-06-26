const SHOP_WHATSAPP = "923254695624";

export type OrderForWhatsApp = {
  customerName: string;
  customerPhone: string;
  orderType: "delivery" | "pickup";
  address?: string;
  items: { name: string; size?: string; quantity: number; price: number }[];
  totalAmount: number;
  paymentMethod: string;
};

export function buildWhatsAppUrl(order: OrderForWhatsApp): string {
  const itemLines = order.items.map(
    (item) =>
      `• ${item.name}${item.size ? ` (${item.size})` : ""} ×${item.quantity} — Rs. ${(item.price * item.quantity).toLocaleString()}`
  );

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
    ...(isPickup
      ? []
      : [`📍 *Address:* ${order.address}`]),
    ``,
    `🛒 *Order Details:*`,
    ...itemLines,
    ``,
    `💰 *Total: Rs. ${order.totalAmount.toLocaleString()}*`,
    `💳 *Payment:* ${order.paymentMethod}`,
    ``,
    `_Order placed from website_`,
  ];

  const message = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${SHOP_WHATSAPP}?text=${message}`;
}
