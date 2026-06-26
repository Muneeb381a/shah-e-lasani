import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 style={{ margin: "0 0 28px", fontSize: 22, fontWeight: 700, color: "#fff" }}>
        Add New Product
      </h1>
      <ProductForm mode="new" />
    </div>
  );
}
