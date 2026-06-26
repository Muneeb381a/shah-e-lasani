import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET /api/admin/products — list all products with sizes
export async function GET() {
  try {
    const db = supabaseAdmin();
    const { data, error } = await db
      .from("products")
      .select("*, product_sizes(*), categories(name)")
      .order("category_id")
      .order("name");

    if (error) throw error;
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST /api/admin/products — create product (+ sizes)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db   = supabaseAdmin();

    const { data: product, error } = await db
      .from("products")
      .insert({
        name:           body.name,
        description:    body.description ?? "",
        base_price:     body.base_price,
        original_price: body.original_price ?? null,
        is_available:   body.is_available ?? true,
        is_deal:        body.is_deal ?? false,
        category_id:    body.category_id,
        image:          body.image ?? null,
      })
      .select()
      .single();

    if (error) throw error;

    // Insert sizes if provided
    if (body.sizes && body.sizes.length > 0) {
      const sizeRows = body.sizes.map((s: { label: string; price: number }) => ({
        product_id: product.id,
        label: s.label,
        price: s.price,
      }));
      const { error: sizeErr } = await db.from("product_sizes").insert(sizeRows);
      if (sizeErr) throw sizeErr;
    }

    return NextResponse.json(product, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
