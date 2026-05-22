import type { Metadata, Viewport } from "next";
import Script from 'next/script';
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import ThemeWrapper from "../components/ThemeWrapper";

const inter = Inter({
  variable: "--font-geist-sans", // map it to the tailwind default variable
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

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
      className={`${inter.variable} ${poppins.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <head />
      <body className="min-h-full flex flex-col bg-theme-bg-from text-theme-text transition-colors duration-500">
        <ThemeWrapper>
          {children}
        </ThemeWrapper>
        {/* model-viewer web component — must load via Next.js Script for production */}
        <Script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
