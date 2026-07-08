import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const db  = supabaseAdmin();
  const out: Record<string, unknown> = {};

  // Get orders columns via pg_catalog
  const { data: oCols } = await db.rpc("get_table_columns" as never, { tbl: "orders" } as never);
  out.orders_cols = oCols ?? "rpc_not_available";

  // Get order_items columns via pg_catalog
  const { data: iCols } = await db.rpc("get_table_columns" as never, { tbl: "order_items" } as never);
  out.order_items_cols = iCols ?? "rpc_not_available";

  // Fallback: just try inserting order_items with every plausible column name variant
  // First insert a dummy order to get an id
  const { data: ord } = await db
    .from("orders")
    .insert({ customer_name: "DIAG", customer_phone: "0", address: "x", total_amount: 0, status: "pending" })
    .select("id").single();

  if (ord) {
    const variants: Record<string, unknown>[] = [
      // Variant A — our schema
      { order_id: ord.id, product_name: "X", product_id: "p1", quantity: 1, unit_price: 0, selected_size: null, notes: null },
      // Variant B — minimal (discover which basic cols exist)
      { order_id: ord.id, quantity: 1 },
    ];

    for (let i = 0; i < variants.length; i++) {
      const { error } = await db.from("order_items").insert(variants[i]);
      out[`variant_${i === 0 ? "A_full" : "B_minimal"}`] = error ? `FAIL: ${error.message}` : "OK";
      if (!error) break;
    }

    await db.from("orders").delete().eq("id", ord.id);
  }

  return NextResponse.json(out);
}
