import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const checks: Record<string, string> = {};

  checks.SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET" : "MISSING";

  const db = supabaseAdmin();

  // Check orders columns via information_schema
  const { data: cols, error: colErr } = await db
    .from("information_schema.columns" as "orders")
    .select("column_name, data_type")
    .eq("table_name" as "id", "orders" as never)
    .eq("table_schema" as "id", "public" as never);

  if (colErr) {
    checks.columns_check = colErr.message;
  } else {
    const names = (cols as unknown as { column_name: string }[]).map((c) => c.column_name);
    checks.orders_columns = names.join(", ");
  }

  // Try a test INSERT then DELETE
  const testPayload = {
    customer_name:    "TEST_DIAGNOSE",
    customer_phone:   "0000000000",
    customer_address: "test",
    order_type:       "delivery",
    payment_method:   "COD",
    notes:            "",
    total_amount:     0,
    status:           "pending",
  };

  const { data: inserted, error: insertErr } = await db
    .from("orders")
    .insert(testPayload)
    .select()
    .single();

  if (insertErr) {
    checks.test_insert = `FAILED: ${insertErr.message}`;
  } else {
    checks.test_insert = "OK";
    // Clean up test row
    await db.from("orders").delete().eq("id", inserted.id);
  }

  return NextResponse.json(checks);
}
