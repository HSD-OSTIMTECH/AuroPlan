"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import UserMenu from "../ui/UserMenu";
import { User } from "@supabase/supabase-js";

// Sayfa yollarına göre başlık haritası
const pageTitles: { [key: string]: string } = {
  "/dashboard": "Genel Bakış",
  "/dashboard/tasks": "Görev Yöneticisi",
  "/dashboard/learn": "Mikro Öğrenme Merkezi",
  "/dashboard/settings": "Hesap Ayarları",
  "/dashboard/profile": "Profilim",
};

// Props tipini güncelliyoruz
interface HeaderProps {
  user: User;
  userProfile?: {
    full_name?: string | null;
    avatar_url?: string | null;
    email?: string | null;
  } | null;
}

export default function Header({ user, userProfile }: HeaderProps) {
  const pathname = usePathname();

  // Dinamik başlık yönetimi (örn: /dashboard/projects/123 -> Proje Detayı)
  let title = pageTitles[pathname];
  if (!title) {
    if (pathname.includes("/projects/")) title = "Proje Detayı";
    else if (pathname.includes("/teams/")) title = "Takım Yönetimi";
    else title = "Dashboard";
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Sol: Başlık ve Breadcrumb */}
      <div className="flex items-center gap-4">
        {/* Mobil Menü Tetikleyici (Mobilde görünecek) */}
        <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          <Icon icon="heroicons:bars-3" className="text-xl" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-slate-800">{title}</h1>
          {/* Opsiyonel: Tarih veya Breadcrumb */}
          <p className="text-xs text-slate-500 hidden md:block">
            {new Date().toLocaleDateString("tr-TR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Sağ: Aksiyonlar ve Profil */}
      <div className="flex items-center gap-4">
        {/* Bildirimler */}
        <button className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
          <Icon icon="heroicons:bell" className="text-xl" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1"></div>

        {/* Kullanıcı Menüsü - Profil bilgisi ile */}
        <UserMenu user={user} userProfile={userProfile} />
      </div>
    </header>
  );
}
