import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

function makeToken(password: string) {
  return createHash("sha256").update(password + "sl-admin").digest("hex");
}

async function getStoredPassword(): Promise<string> {
  try {
    const db = supabaseAdmin();
    const { data } = await db
      .from("admin_settings")
      .select("value")
      .eq("key", "admin_password")
      .single();
    if (data?.value) return data.value;
  } catch {}
  return process.env.ADMIN_PASSWORD ?? "";
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const stored = await getStoredPassword();

  if (!stored) {
    return NextResponse.json({ error: "ADMIN_PASSWORD not configured" }, { status: 500 });
  }

  if (password !== stored) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_tok", makeToken(password), {
    httpOnly: true, sameSite: "lax", path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
