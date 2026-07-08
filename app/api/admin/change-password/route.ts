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
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Naya password kam az kam 6 characters ka hona chahiye" }, { status: 400 });
    }

    const stored = await getStoredPassword();
    if (currentPassword !== stored) {
      return NextResponse.json({ error: "Purana password galat hai" }, { status: 401 });
    }

    const db = supabaseAdmin();
    await db
      .from("admin_settings")
      .upsert({ key: "admin_password", value: newPassword, updated_at: new Date().toISOString() });

    // Return new cookie so user stays logged in with new password
    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_tok", makeToken(newPassword), {
      httpOnly: true, sameSite: "lax", path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
