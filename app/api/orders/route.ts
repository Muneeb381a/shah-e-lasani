import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// POST /api/orders — place a new order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db   = supabaseAdmin();

    const { data: order, error: orderErr } = await db
      .from("orders")
      .insert({
        customer_name:    body.customerName,
        customer_phone:   body.customerPhone,
        customer_address: body.address ?? "",
        order_type:       body.orderType ?? "delivery",
        payment_method:   body.paymentMethod,
        notes:            body.notes ?? "",
        total_amount:     body.totalAmount,
        status:           "pending",
      })
      .select()
      .single();

    if (orderErr) throw orderErr;

    if (body.items && body.items.length > 0) {
      const rows = body.items.map((item: {
        productId?: string;
        name:       string;
        price:      number;
        quantity:   number;
        size?:      string;
        notes?:     string;
      }) => ({
        order_id:      order.id,
        product_id:    item.productId ?? null,
        product_name:  item.name,
        quantity:      item.quantity,
        unit_price:    item.price,
        selected_size: item.size ?? null,
        notes:         item.notes ?? null,
      }));
      const { error: itemErr } = await db.from("order_items").insert(rows);
      if (itemErr) throw itemErr;
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error("Order save error:", err);
    return NextResponse.json({ success: false, message: "Failed to save order" }, { status: 500 });
  }
}

// GET /api/orders — admin: list all orders newest first
export async function GET() {
  try {
    const db = supabaseAdmin();

    const { data: orders, error } = await db
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) throw error;
    return NextResponse.json(orders ?? []);
  } catch (err) {
    console.error("Orders fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
