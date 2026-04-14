import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./context/cart-provider";

export const metadata: Metadata = {
  title: "Académie des Dresseurs",
  description: "Plateforme pédagogique et e-commerce Pokémon TCG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
      <CartProvider>
        {children}
      </CartProvider>
      </body>
    </html>
  );
}
