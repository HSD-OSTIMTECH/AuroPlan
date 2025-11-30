import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import ToasterRegistry from "@/components/ui/ToasterRegistry";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Aura Plan - Kurumsal Görev ve İş Yönetimi",
  description:
    "Bireysel ve takım çalışmaları için optimize edilmiş, mikro öğrenme destekli modern iş yönetim platformu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nunito.variable}>
      <body
        className={`${nunito.className} antialiased bg-background text-foreground`}
      >
        <ToasterRegistry />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
