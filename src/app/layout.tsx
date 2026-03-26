import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PWAProvider } from "@/components/PWAProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Agendei Barber | Plataforma de Gestão",
  description: "Plataforma completa de Sistema SaaS para Barbearias com agendamento inteligente.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Agendei Barber",
    startupImage: [
      { url: "/api/icon?size=512", media: "(device-width: 390px)" },
    ],
  },
  icons: {
    icon: [
      { url: "/api/icon?size=32", sizes: "32x32", type: "image/png" },
      { url: "/api/icon?size=192", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/api/icon?size=180", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/api/icon?size=32",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-TileColor": "#f97316",
    "msapplication-tap-highlight": "no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <PWAProvider />
      </body>
    </html>
  );
}
