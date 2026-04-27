import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./context/cart-provider";
import { Poppins, Inter } from "next/font/google";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";

export const metadata: Metadata = {
  title: "Académie des Dresseurs",
  description: "Plateforme pédagogique et e-commerce Pokémon TCG",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${poppins.variable} ${inter.variable}`}>
      <body className="antialiased">
        <CartProvider>
          {children}
          <Footer />
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  );
}
