import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const checks: Record<string, string> = {};

  // 1. Env vars
  checks.SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL      ? "SET" : "MISSING";
  checks.SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? "SET" : "MISSING";
  checks.SERVICE_ROLE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY     ? "SET" : "MISSING";
  checks.ADMIN_PASSWORD    = process.env.ADMIN_PASSWORD                 ? "SET" : "MISSING";

  // 2. Supabase connection
  let dbError = "ok";
  try {
    const db = supabaseAdmin();
    const { error } = await db.from("orders").select("id").limit(1);
    if (error) dbError = error.message;
  } catch (e) {
    dbError = e instanceof Error ? e.message : String(e);
  }
  checks.supabase_orders_table = dbError;

  // 3. order_items table
  let itemsError = "ok";
  try {
    const db = supabaseAdmin();
    const { error } = await db.from("order_items").select("id").limit(1);
    if (error) itemsError = error.message;
  } catch (e) {
    itemsError = e instanceof Error ? e.message : String(e);
  }
  checks.supabase_order_items_table = itemsError;

  return NextResponse.json(checks);
}
