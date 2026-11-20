import type { Metadata, Viewport } from "next";
import { Nunito, Playball } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const playball = Playball({
  variable: "--font-playball",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Gia's Patisserie · Kukis rumahan di Palembang",
  description:
    "Pesan cookies dan brownies Gia's Patisserie, lalu bayar pakai QRIS dengan nominal yang sudah terisi otomatis.",
};

export const viewport: Viewport = {
  themeColor: "#fbc4da",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${nunito.variable} ${playball.variable} antialiased`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
