import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iowa Testing Portal",
  description: "Iowa Testing Portal",
};

import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
        <footer className="border-t border-slate-200 bg-white py-4">
          <div className="max-w-4xl mx-auto px-4 text-center text-sm text-slate-500">
            <Link href="/faq" className="hover:text-slate-700">
              FAQ
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
