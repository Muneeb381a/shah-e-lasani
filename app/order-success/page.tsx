"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const waRaw = searchParams.get("wa");
  const waUrl = waRaw ? decodeURIComponent(waRaw) : null;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      <div className="max-w-md w-full text-center">
        <div
          className="rounded-2xl p-8 border"
          style={{ backgroundColor: "#242424", borderColor: "#333333" }}
        >
          <div className="text-6xl mb-4">✅</div>
          <h1 className="font-heading font-bold text-3xl text-white uppercase tracking-wider mb-3">
            Order Placed!
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Your order has been received. Please confirm on WhatsApp so we can
            start preparing it right away!
          </p>

          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-white py-4 rounded-full font-heading font-bold uppercase tracking-wider text-lg mb-4 transition-colors"
              style={{ backgroundColor: "#16a34a" }}
            >
              📱 Confirm on WhatsApp
            </a>
          )}

          <Link
            href="/"
            className="block w-full border py-3 rounded-full font-medium text-sm transition-colors text-gray-400 hover:text-white"
            style={{ borderColor: "#333333" }}
          >
            Back to Home
          </Link>
        </div>

        <p className="text-gray-600 text-xs mt-6">
          SHAH-E-LASANI CAFE — WhatsApp: 0325-4695624
        </p>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-400">Loading…</p>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
