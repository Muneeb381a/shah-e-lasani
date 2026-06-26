import { createClient } from "@supabase/supabase-js";

const url     = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Public client — safe for browser & server reads
export const supabase = createClient(url, anonKey);

// Admin client — uses service role key, server-side only
export function supabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY not set");
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/* ── Types ─────────────────────────────────────────────────── */

export type DbProduct = {
  id: string;
  name: string;
  description: string;
  base_price: number;
  original_price: number | null;
  is_available: boolean;
  is_deal: boolean;
  category_id: string;
  created_at: string;
  product_sizes?: { id: string; label: string; price: number }[];
};

export type DbCategory = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};
