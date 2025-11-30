import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Navbar from "@/components/ui/Navbar"; // Navbar import edildi
import Footer from "@/components/ui/Footer"; // Footer import edildi
import "./globals.css";

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
        <div className="min-h-screen flex flex-col font-sans">
          <Navbar />

          <main className="flex-1 pt-20">{children}</main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
