import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// POST /api/admin/upload
// Body: multipart/form-data with field "file"
// Returns: { url: string }
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Only image files allowed" }, { status: 400 });
    }

    const ext      = file.name.split(".").pop() ?? "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer   = await file.arrayBuffer();

    const db = supabaseAdmin();

    // Auto-create bucket if it doesn't exist yet
    const { data: buckets } = await db.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === "product-images");
    if (!exists) {
      const { error: bucketErr } = await db.storage.createBucket("product-images", {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5 MB
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      });
      if (bucketErr) throw bucketErr;
    }

    const { data, error } = await db.storage
      .from("product-images")
      .upload(filename, buffer, { contentType: file.type, upsert: false });

    if (error) throw error;

    const { data: urlData } = db.storage
      .from("product-images")
      .getPublicUrl(data.path);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
