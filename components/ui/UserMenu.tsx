"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // Image bileşenini ekledik
import { Icon } from "@iconify/react";
import { signout } from "@/app/(auth)/actions";
import { User } from "@supabase/supabase-js";

interface UserMenuProps {
  user: User;
  userProfile?: {
    full_name?: string | null;
    avatar_url?: string | null;
    email?: string | null;
  } | null;
}

export default function UserMenu({ user, userProfile }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Dışarı tıklandığında menüyü kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Görüntülenecek verileri belirle (Profil tablosu öncelikli)
  const displayName =
    userProfile?.full_name || user.user_metadata.full_name || "Kullanıcı";
  const displayEmail = userProfile?.email || user.email;
  const avatarUrl = userProfile?.avatar_url || user.user_metadata.avatar_url;

  // Baş harf hesapla
  const userInitial = displayName
    ? displayName[0].toUpperCase()
    : displayEmail?.[0].toUpperCase() || "?";

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-border focus:outline-none"
      >
        {avatarUrl ? (
          // Avatar Resmi Varsa
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 shadow-sm">
            <Image
              src={avatarUrl}
              alt={displayName}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          // Avatar Yoksa (Baş Harf)
          <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-sm">
            {userInitial}
          </div>
        )}

        <Icon
          icon="heroicons:chevron-down"
          className={`text-slate-500 text-sm transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-slate-100 mb-1">
            <p className="text-sm font-bold text-slate-900 truncate">
              {displayName}
            </p>
            <p className="text-xs text-slate-500 truncate font-medium">
              {displayEmail}
            </p>
          </div>

          {/* Links */}
          <div className="px-1 space-y-0.5">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Icon icon="heroicons:squares-2x2" className="text-lg" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Icon icon="heroicons:user-circle" className="text-lg" />
              Profil Ayarları
            </Link>
          </div>

          <div className="h-px bg-slate-100 my-1 mx-1" />

          {/* Sign Out */}
          <div className="px-1">
            <form action={signout}>
              <button
                type="submit"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
              >
                <Icon
                  icon="heroicons:arrow-right-on-rectangle"
                  className="text-lg"
                />
                Çıkış Yap
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
