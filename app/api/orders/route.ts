import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db   = supabaseAdmin();

    const { data: order, error: orderErr } = await db
      .from("orders")
      .insert({
        customer_name:    body.name,
        customer_phone:   body.phone,
        customer_address: body.address,
        payment_method:   body.paymentMethod,
        notes:            body.notes ?? "",
        total_amount:     body.total,
        status:           "pending",
      })
      .select()
      .single();

    if (orderErr) throw orderErr;

    // Insert order items
    if (body.items && body.items.length > 0) {
      const rows = body.items.map((item: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        selectedSize?: string;
      }) => ({
        order_id:      order.id,
        product_id:    item.id,
        product_name:  item.name,
        quantity:      item.quantity,
        unit_price:    item.price,
        selected_size: item.selectedSize ?? null,
      }));
      const { error: itemErr } = await db.from("order_items").insert(rows);
      if (itemErr) throw itemErr;
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error("Order save error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to save order" },
      { status: 500 }
    );
  }
}
