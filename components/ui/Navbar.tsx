import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { createClient } from "@/utils/supabase/server"; // Server client import edildi
import UserMenu from "./UserMenu"; // UserMenu import edildi

export default async function Navbar() {
  const supabase = await createClient();

  // Kullanıcıyı getir
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo Alanı */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-lg transition-all">
            <Image
              src="/Logos/JustLogo.jpg"
              alt="Aura Plan Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-2xl font-bold text-primary tracking-tight">
            Aura Plan
          </span>
        </Link>

        {/* Menü - Mobil uyumluluk için hidden md:flex kalsın, ileride mobile menu eklenebilir */}
        <nav className="hidden md:flex gap-8 text-sm font-bold text-muted">
          {user ? (
            // Giriş yapmış kullanıcı için Navigasyon
            <>
              <Link
                href="/dashboard"
                className="hover:text-primary transition-colors"
              >
                Panom
              </Link>
              <Link
                href="/dashboard/tasks"
                className="hover:text-primary transition-colors"
              >
                Görevler
              </Link>
              <Link
                href="/dashboard/learn"
                className="hover:text-primary transition-colors"
              >
                Öğrenme
              </Link>
            </>
          ) : (
            // Ziyaretçi için Navigasyon
            <>
              <a
                href="/#solutions"
                className="hover:text-primary transition-colors"
              >
                Çözümler
              </a>
              <a
                href="/#micro-learning"
                className="hover:text-primary transition-colors"
              >
                Mikro Öğrenme
              </a>
              <a
                href="/#pricing"
                className="hover:text-primary transition-colors"
              >
                Kurumsal
              </a>
            </>
          )}
        </nav>

        {/* Aksiyon Alanı */}
        <div className="flex gap-4 items-center">
          {user ? (
            // Kullanıcı varsa UserMenu göster
            <UserMenu user={user} />
          ) : (
            // Kullanıcı yoksa Giriş/Kayıt butonlarını göster
            <>
              <Link
                href="/login"
                className="text-sm font-bold text-muted hover:text-primary transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 text-sm font-bold bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
              >
                Ücretsiz Dene
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
