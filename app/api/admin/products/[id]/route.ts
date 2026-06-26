import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

type Params = { params: Promise<{ id: string }> };

// GET /api/admin/products/:id
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const db = supabaseAdmin();
    const { data, error } = await db
      .from("products")
      .select("*, product_sizes(*)")
      .eq("id", id)
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PUT /api/admin/products/:id
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await req.json();
    const db   = supabaseAdmin();

    const { data: product, error } = await db
      .from("products")
      .update({
        name:           body.name,
        description:    body.description ?? "",
        base_price:     body.base_price,
        original_price: body.original_price ?? null,
        is_available:   body.is_available ?? true,
        is_deal:        body.is_deal ?? false,
        category_id:    body.category_id,
        image:          body.image ?? null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Replace sizes: delete old → insert new
    if (body.sizes !== undefined) {
      await db.from("product_sizes").delete().eq("product_id", id);
      if (body.sizes.length > 0) {
        const rows = body.sizes.map((s: { label: string; price: number }) => ({
          product_id: id,
          label: s.label,
          price: s.price,
        }));
        const { error: sErr } = await db.from("product_sizes").insert(rows);
        if (sErr) throw sErr;
      }
    }

    return NextResponse.json(product);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE /api/admin/products/:id
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const db = supabaseAdmin();
    // Sizes cascade-delete via FK; delete product
    const { error } = await db.from("products").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
