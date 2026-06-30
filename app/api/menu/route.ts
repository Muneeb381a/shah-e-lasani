import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { categories as staticCategories, products as staticProducts } from "@/data/menu";

// GET /api/menu — fetch live menu from Supabase, fall back to static data
export async function GET() {
  try {
    const { data: categories, error: catErr } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");

    if (catErr) throw catErr;

    const { data: products, error: prodErr } = await supabase
      .from("products")
      .select("*, product_sizes(*)")
      .eq("is_available", true)
      .order("name");

    if (prodErr) throw prodErr;

    // Shape into same structure as static menuCategories
    const shaped = categories.map((cat) => ({
      id:    cat.id,
      name:  cat.name,
      items: products
        .filter((p) => p.category_id === cat.id)
        .map((p) => ({
          id:            p.id,
          name:          p.name,
          description:   p.description,
          price:         p.base_price,
          originalPrice: p.original_price ?? undefined,
          isDeal:        p.is_deal,
          categoryId:    p.category_id,
          image:         p.image ?? undefined,
          dealConfig:    p.deal_config ?? undefined,
          sizes: p.product_sizes?.map((s: { label: string; price: number }) => ({
            label: s.label,
            price: s.price,
          })) ?? [],
        })),
    }));

    return NextResponse.json(shaped);
  } catch {
    // Fall back to static data so the site never shows blank menu
    const shaped = staticCategories.map((cat) => ({
      id:    cat.id,
      name:  cat.name,
      items: staticProducts
        .filter((p) => p.categoryId === cat.id && p.isAvailable)
        .map((p) => ({
          id:            p.id,
          name:          p.name,
          description:   p.description,
          price:         p.basePrice,
          originalPrice: p.originalPrice,
          isDeal:        p.isDeal,
          categoryId:    p.categoryId,
          image:         p.image,
          sizes:         p.sizes ?? [],
        })),
    }));
    return NextResponse.json(shaped);
  }
}
