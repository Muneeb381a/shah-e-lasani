"use client";

import { useState } from "react";

export default function FloatingWhatsApp() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="https://wa.me/923254695624?text=Hello!%20I%20want%20to%20place%20an%20order%20from%20Shah-e-Lasani%20Cafe."
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed z-50 flex items-center gap-3 animate-glow-gold"
      style={{
        bottom: "24px",
        right: "24px",
        backgroundColor: "#25D366",
        borderRadius: hovered ? "50px" : "50%",
        padding: hovered ? "14px 20px" : "16px",
        boxShadow: "0 4px 24px rgba(37,211,102,0.45)",
        transition: "border-radius 0.3s ease, padding 0.3s ease, box-shadow 0.3s ease",
        textDecoration: "none",
      }}
      aria-label="Order on WhatsApp"
    >
      {/* Pulse ring */}
      <span
        className="absolute inset-0 rounded-full"
        style={{
          animation: "pulseRing 2.2s ease-in-out infinite",
          backgroundColor: "rgba(37,211,102,0.35)",
          pointerEvents: "none",
        }}
      />

      {/* WhatsApp icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="white"
        style={{ width: "28px", height: "28px", flexShrink: 0 }}
      >
        <path d="M16.003 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.332.627 4.605 1.82 6.604L2.667 29.333l6.912-1.783A13.266 13.266 0 0016.003 29.333C23.369 29.333 29.333 23.363 29.333 16S23.369 2.667 16.003 2.667zm0 24.267a11.028 11.028 0 01-5.624-1.547l-.4-.236-4.104 1.059 1.094-3.971-.262-.41A11 11 0 015.001 16c0-6.07 4.936-11.005 11.002-11.005C22.073 4.995 27 9.93 27 16c0 6.07-4.927 10.934-10.997 10.934zm6.033-8.232c-.329-.165-1.95-.961-2.252-1.073-.303-.11-.523-.165-.744.165-.22.33-.855 1.073-1.048 1.292-.193.22-.385.248-.715.083-.329-.165-1.393-.514-2.654-1.636-.982-.875-1.644-1.955-1.836-2.284-.193-.33-.02-.508.145-.672.15-.148.33-.385.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.744-1.793-1.019-2.455-.268-.644-.54-.556-.744-.567l-.633-.011a1.213 1.213 0 00-.88.413c-.302.33-1.155 1.128-1.155 2.752s1.183 3.19 1.347 3.411c.165.22 2.327 3.557 5.641 4.988.789.341 1.404.545 1.884.697.791.252 1.511.217 2.08.132.634-.095 1.951-.797 2.226-1.567.275-.77.275-1.43.193-1.567-.083-.137-.302-.22-.633-.385z" />
      </svg>

      {/* Tooltip text (shown on hover) */}
      {hovered && (
        <span
          className="text-white text-sm font-semibold whitespace-nowrap"
          style={{ animation: "fadeInRight 0.3s ease both" }}
        >
          Order on WhatsApp
        </span>
      )}
    </a>
  );
}
