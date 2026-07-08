import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// POST /api/orders — place a new order (resilient to old DB schema)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db   = supabaseAdmin();

    // ── Try inserting with full schema first ──────────────────
    let orderResult = await db
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

    // ── Fallback: old schema without order_type ───────────────
    if (orderResult.error) {
      console.warn("Full insert failed, trying without order_type:", orderResult.error.message);
      orderResult = await db
        .from("orders")
        .insert({
          customer_name:    body.customerName,
          customer_phone:   body.customerPhone,
          customer_address: body.address ?? "",
          payment_method:   body.paymentMethod,
          notes:            body.notes ?? "",
          total_amount:     body.totalAmount,
          status:           "pending",
        })
        .select()
        .single();
    }

    if (orderResult.error) throw orderResult.error;
    const order = orderResult.data;

    // ── Insert order items ────────────────────────────────────
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

      let itemResult = await db.from("order_items").insert(rows);

      // Fallback: old schema without notes column
      if (itemResult.error) {
        console.warn("Items insert failed, trying without notes:", itemResult.error.message);
        const rowsNoNotes = rows.map(({ notes: _n, ...rest }: { notes?: string | null; [key: string]: unknown }) => rest);
        itemResult = await db.from("order_items").insert(rowsNoNotes);
      }

      if (itemResult.error) throw itemResult.error;
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Order save error:", msg);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
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

    if (error) {
      // Table doesn't exist yet → return empty list so admin page still loads
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return NextResponse.json([]);
      }
      throw error;
    }
    return NextResponse.json(orders ?? []);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Orders fetch error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
