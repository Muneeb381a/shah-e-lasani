"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");
  const [success,         setSuccess]         = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!currentPassword) { setError("Purana password daalen"); return; }
    if (!newPassword)      { setError("Naya password daalen");   return; }
    if (newPassword.length < 6) { setError("Naya password kam az kam 6 characters ka hona chahiye"); return; }
    if (newPassword !== confirmPassword) { setError("Naya password aur confirm password match nahi karte"); return; }
    if (newPassword === currentPassword) { setError("Naya password purane se alag hona chahiye"); return; }

    setLoading(true);
    try {
      const res  = await fetch("/api/admin/change-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Password change nahi hua"); return; }
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Kuch masla hua, dobara try karein");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 44px 11px 14px",
    background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, color: "#fff", fontSize: 14,
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  function PasswordField({
    label, value, onChange, show, onToggle, placeholder,
  }: {
    label: string; value: string; onChange: (v: string) => void;
    show: boolean; onToggle: () => void; placeholder?: string;
  }) {
    return (
      <div>
        <label style={{
          display: "block", fontSize: 11, fontWeight: 700,
          color: "#555", letterSpacing: "0.12em", textTransform: "uppercase",
          marginBottom: 8,
        }}>
          {label}
        </label>
        <div style={{ position: "relative" }}>
          <input
            type={show ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder ?? "••••••••"}
            style={inputStyle}
            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(228,0,43,0.5)"; }}
            onBlur={(e)  => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
          />
          <button
            type="button"
            onClick={onToggle}
            style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "#444", padding: 4,
            }}
          >
            {show ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480 }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Settings</h1>
        <div style={{ fontSize: 12, color: "#444" }}>Admin panel ki settings manage karein</div>
      </div>

      {/* Password change card */}
      <div style={{
        background: "#0d0d0d",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16, padding: "28px 28px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "rgba(228,0,43,0.1)", border: "1px solid rgba(228,0,43,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E4002B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>Password Change Karein</div>
            <div style={{ fontSize: 11, color: "#444", marginTop: 1 }}>Admin login ka password update karein</div>
          </div>
        </div>

        {/* Success */}
        {success && (
          <div style={{
            background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
            borderRadius: 10, padding: "12px 16px",
            color: "#22c55e", fontSize: 13, fontWeight: 600,
            marginBottom: 20, display: "flex", alignItems: "center", gap: 8,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Password successfully change ho gaya!
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 10, padding: "12px 16px",
            color: "#f87171", fontSize: 13,
            marginBottom: 20, display: "flex", alignItems: "center", gap: 8,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <PasswordField
            label="Purana Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={showCurrent}
            onToggle={() => setShowCurrent((v) => !v)}
            placeholder="Apna purana password daalen"
          />
          <PasswordField
            label="Naya Password"
            value={newPassword}
            onChange={setNewPassword}
            show={showNew}
            onToggle={() => setShowNew((v) => !v)}
            placeholder="Naya password (kam az kam 6 characters)"
          />
          <PasswordField
            label="Naya Password Confirm Karein"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
            placeholder="Dobara naya password daalen"
          />

          {/* Strength indicator */}
          {newPassword.length > 0 && (
            <div>
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{
                    flex: 1, height: 3, borderRadius: 2,
                    background: newPassword.length >= i * 3
                      ? i <= 1 ? "#ef4444"
                      : i <= 2 ? "#f59e0b"
                      : i <= 3 ? "#22c55e"
                      : "#22c55e"
                      : "rgba(255,255,255,0.07)",
                    transition: "background 0.2s",
                  }} />
                ))}
              </div>
              <div style={{ fontSize: 10, color: "#444" }}>
                {newPassword.length < 3  ? "Bohot chota" :
                 newPassword.length < 6  ? "Kamzor" :
                 newPassword.length < 9  ? "Theek hai" :
                 newPassword.length < 12 ? "Acha hai" : "Bohot strong!"}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6,
              padding: "12px",
              background: loading ? "rgba(228,0,43,0.4)" : "linear-gradient(135deg,#E4002B,#c0001f)",
              color: "#fff", border: "none", borderRadius: 10,
              fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 16px rgba(228,0,43,0.3)",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Password change ho raha hai…" : "Password Change Karein"}
          </button>
        </form>
      </div>

      {/* Info box */}
      <div style={{
        marginTop: 16,
        background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)",
        borderRadius: 10, padding: "12px 16px",
        display: "flex", gap: 10, alignItems: "flex-start",
      }}>
        <svg style={{ flexShrink: 0, marginTop: 1 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <div style={{ fontSize: 11, color: "#555", lineHeight: 1.6 }}>
          Password change hone ke baad aap automatically logged in rahenge. Agar doosri device pe login hai to wahan dobara password dalna hoga.
        </div>
      </div>
    </div>
  );
}
