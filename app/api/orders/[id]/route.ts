import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

type Params = { params: Promise<{ id: string }> };

const VALID_STATUSES = ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"];

// PATCH /api/orders/:id — update order status
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const { status } = await req.json();
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const db = supabaseAdmin();
    const { data, error } = await db
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error("Order update error:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

// GET /api/orders/:id — single order with items
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const db = supabaseAdmin();
    const { data, error } = await db
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", id)
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error("Order fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
