import type { Metadata } from "next";
import { Oswald, Open_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { ThemeProvider } from "@/lib/theme-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SHAH-E-LASANI CAFE — Pizza, Burgers & More",
  description:
    "Order fresh pizza, burgers, deals and more from SHAH-E-LASANI CAFE. Fast delivery, great taste! WhatsApp: 0325-4695624",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${openSans.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <ThemeProvider>
          <CartProvider>
            <Header />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
            <CartDrawer />
            <FloatingWhatsApp />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
