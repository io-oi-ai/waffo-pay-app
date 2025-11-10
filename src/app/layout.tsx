import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "App Pay Store Platform",
  description:
    "Merchant console and storefront solution for mobile games, combining bonus monetization, flexible payments, and reliable fulfilment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
