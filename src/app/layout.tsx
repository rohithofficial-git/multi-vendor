import type { Metadata, Viewport } from "next";

import "./globals.css";
import ThemeWrapper from "../components/ThemeWrapper";
import ModelViewerLoader from "../components/ModelViewerLoader";

// Bypassing next/font to prevent Vercel build timeout errors
// We will use standard CSS custom properties instead.

export const metadata: Metadata = {
  title: " Horizon | Futuristic Multi-Vendor Luxury Marketplace",
  description: "Curated boutique marketplace featuring artisan watchmakers, high-end acoustics, mobility innovations, and vanguard design artifacts.",
  keywords: ["luxury", "marketplace", "e-commerce", "futuristic", "multi-vendor", "watches", "audio", "gear"],
  authors: [{ name: "Aetheris Team" }],
  openGraph: {
    title: "Aetheris Horizon | Premium Multi-Vendor Hub",
    description: "Experience luxury marketplace shopping powered by AI recommendations and real-time merchant studios.",
    url: "https://aetheris.horizon",
    siteName: "Aetheris Horizon",
    images: [
      {
        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Aetheris Luxury Watch",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-theme-bg-from text-theme-text transition-colors duration-500">
        {/* Registers <model-viewer> custom element on the client */}
        <ModelViewerLoader />
        <ThemeWrapper>
          {children}
        </ThemeWrapper>
      </body>
    </html>
  );
}
