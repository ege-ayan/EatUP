import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EatUP - Öğrenciler İçin Ucuz Yemek, Restoranlar İçin Atık Azaltma",
  description:
    "EatUP ile restoranların kalan yemeklerini öğrenciler indirimli fiyatlarla tüketebilir. Gıda atığını azaltın, bütçenizi koruyun. İstanbul'un en sürdürülebilir yemek platformu.",
  keywords: [
    "yemek",
    "öğrenci",
    "restoran",
    "ucuz yemek",
    "gıda atığı",
    "sürdürülebilirlik",
    "İstanbul",
  ],
  openGraph: {
    title: "EatUP - Öğrenciler İçin Ucuz Yemek",
    description:
      "Restoranların kalan yemeklerini öğrenciler indirimli fiyatlarla tüketebilir. Gıda atığını azaltın!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
