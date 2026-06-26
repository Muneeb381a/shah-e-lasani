"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm, { ProductFormData } from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData]   = useState<ProductFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((r) => r.json())
      .then((p) => {
        setData({
          name:           p.name,
          description:    p.description,
          base_price:     p.base_price,
          original_price: p.original_price,
          is_available:   p.is_available,
          is_deal:        p.is_deal,
          category_id:    p.category_id,
          image:          p.image ?? null,
          sizes: p.product_sizes?.map((s: { label: string; price: number }) => ({
            label: s.label,
            price: s.price,
          })) ?? [],
        });
        setLoading(false);
      });
  }, [id]);

  return (
    <div>
      <h1 style={{ margin: "0 0 28px", fontSize: 22, fontWeight: 700, color: "#fff" }}>
        Edit Product
      </h1>
      {loading ? (
        <div style={{ color: "#555" }}>Loading…</div>
      ) : (
        <ProductForm mode="edit" productId={id} initial={data ?? undefined} />
      )}
    </div>
  );
}
