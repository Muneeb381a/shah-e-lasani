"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router   = useRouter();
  const [pw, setPw]     = useState("");
  const [error, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      const d = await res.json();
      setErr(d.error ?? "Login failed");
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080808",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <form
        onSubmit={submit}
        style={{
          background: "#111",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          padding: "40px 36px",
          width: "100%",
          maxWidth: 380,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>Admin Login</div>
          <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>Shah-e-Lasani Cafe</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontSize: 13, color: "#aaa" }}>Password</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
            placeholder="Enter admin password"
            style={{
              background: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              padding: "12px 14px",
              color: "#fff",
              fontSize: 15,
              outline: "none",
            }}
          />
        </div>

        {error && (
          <div style={{
            background: "rgba(228,0,43,0.12)",
            border: "1px solid rgba(228,0,43,0.3)",
            borderRadius: 8,
            padding: "10px 14px",
            color: "#ff4d4d",
            fontSize: 13,
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#E4002B",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "14px",
            fontSize: 15,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>
    </div>
  );
}
