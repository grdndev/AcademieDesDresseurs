import type { NextConfig } from "next";

const _rawApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";
const API_URL = (() => { try { return new URL(_rawApiUrl).origin; } catch { return "http://localhost:5001"; } })();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://assets.tcgdex.net/**")],
  },

  // ─── HEADERS DE SÉCURITÉ ──────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Interdit le chargement dans une iframe (clickjacking)
          { key: "X-Frame-Options", value: "DENY" },

          // Empêche le sniffing de Content-Type
          { key: "X-Content-Type-Options", value: "nosniff" },

          // Politique référent : envoie uniquement l'origine sur cross-origin
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

          // HSTS : HTTPS obligatoire pendant 1 an (activer en prod uniquement)
          ...(process.env.NODE_ENV === "production"
            ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" }]
            : []),

          // Désactive les features browser non nécessaires
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(self), usb=()",
          },

          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Scripts : self + Google (OAuth + Fonts)
              "script-src 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com",
              // Styles : self + Google Fonts + inline (Tailwind)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Images : self + TCGDex CDN
              "img-src 'self' data: blob: https://assets.tcgdex.net https://lh3.googleusercontent.com",
              // Frames : Google Sign-In
              "frame-src https://accounts.google.com",
              // Connexions API
              `connect-src 'self' ${API_URL} https://accounts.google.com`,
              // Aucun objet embed
              "object-src 'none'",
              // Base URI restreinte
              "base-uri 'self'",
              // Formulaires : self uniquement
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
