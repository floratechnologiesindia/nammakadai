import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NammaKadai Stationery",
    template: "%s | NammaKadai Stationery",
  },
  description: "Discover curated stationery, notebooks, pens, and desk essentials from NammaKadai.",
  openGraph: {
    title: "NammaKadai Stationery",
    description: "Curated stationery for everyday writing, planning, and gifting.",
    url: "/",
    siteName: "NammaKadai Stationery",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 text-zinc-900`}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500 px-3 py-1 text-sm font-semibold text-white">
                  NammaKadai
                </span>
                <span className="text-sm text-zinc-500">Stationery & Supplies</span>
              </div>
              <nav className="flex gap-4 text-sm font-medium text-zinc-700">
                <a href="/" className="hover:text-emerald-600">
                  Home
                </a>
                <a href="/products" className="hover:text-emerald-600">
                  Products
                </a>
              </nav>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-zinc-500">
              <span>© {new Date().getFullYear()} NammaKadai Stationery</span>
              <span>Crafted with care for stationery lovers.</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
