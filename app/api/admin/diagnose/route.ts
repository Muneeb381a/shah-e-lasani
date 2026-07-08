import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const db = supabaseAdmin();
  const out: Record<string, string> = {};

  // 1. Insert a test order
  const { data: order, error: orderErr } = await db
    .from("orders")
    .insert({
      customer_name:  "TEST_DIAGNOSE",
      customer_phone: "0000000000",
      address:        "test",
      order_type:     "delivery",
      payment_method: "COD",
      notes:          "",
      total_amount:   0,
      status:         "pending",
    })
    .select()
    .single();

  if (orderErr) {
    out.orders_insert = `FAILED: ${orderErr.message}`;
    return NextResponse.json(out);
  }
  out.orders_insert = "OK";

  // 2. Insert a test order_item using every column we send
  const { error: itemErr } = await db.from("order_items").insert({
    order_id:      order.id,
    product_id:    "test-product",
    product_name:  "Test Item",
    quantity:      1,
    unit_price:    100,
    selected_size: "Regular",
    notes:         "test note",
  });

  if (itemErr) {
    out.order_items_insert = `FAILED: ${itemErr.message}`;
  } else {
    out.order_items_insert = "OK";
  }

  // 3. Clean up
  await db.from("orders").delete().eq("id", order.id);

  return NextResponse.json(out);
}
