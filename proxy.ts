import { NextRequest, NextResponse } from "next/server";

async function toHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function expectedToken() {
  const pwd    = process.env.ADMIN_PASSWORD ?? "";
  const bytes  = new TextEncoder().encode(pwd + "sl-admin");
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return toHex(digest);
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  if (pathname.startsWith("/admin")) {
    const cookie = req.cookies.get("admin_tok")?.value;
    const token  = await expectedToken();
    if (!cookie || cookie !== token) {
      const url      = req.nextUrl.clone();
      url.pathname   = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
