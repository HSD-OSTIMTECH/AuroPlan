"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { useState, useMemo } from "react";

// Tip Tanımları
type Team = {
  id: string;
  name: string;
  slug: string;
};

type SidebarProps = {
  teams: Team[];
  userEmail?: string;
};

// ... (menuGroups ve bottomItems dizileri aynı kalacak, buraya tekrar yazmıyorum yer kaplamasın diye) ...
const menuGroups = [
  // ... mevcut menuGroups içeriği ...
  {
    title: "Genel",
    items: [
      {
        title: "Genel Bakış",
        path: "/dashboard",
        icon: "heroicons:squares-2x2",
      },
      {
        title: "Takvim",
        path: "/dashboard/calendar",
        icon: "heroicons:calendar-days",
      },
    ],
  },
  {
    title: "İş Yönetimi",
    items: [
      {
        title: "Görevlerim",
        path: "/dashboard/tasks",
        icon: "heroicons:check-circle",
      },
      {
        title: "Projeler",
        path: "/dashboard/projects",
        icon: "heroicons:folder-open",
        badge: "Yeni",
        badgeColor: "bg-green-100 text-green-700",
      },
      {
        title: "Takım Üyeleri",
        path: "/dashboard/team",
        icon: "heroicons:users",
      },
      {
        title: "Raporlar",
        path: "/dashboard/reports",
        icon: "heroicons:chart-bar-square",
        isPro: true,
      },
    ],
  },
  {
    title: "Gelişim & Akademi",
    items: [
      {
        title: "Öğrenme Merkezi",
        path: "/dashboard/learn",
        icon: "heroicons:academic-cap",
      },
      {
        title: "Başarılarım",
        path: "/dashboard/achievements",
        icon: "heroicons:trophy",
      },
      {
        title: "Sıralama",
        path: "/dashboard/leaderboard",
        icon: "heroicons:chart-bar",
        badge: "Yeni",
        badgeColor: "bg-amber-100 text-amber-700",
      },
    ],
  },
];

const bottomItems = [
  {
    title: "Ayarlar",
    path: "/dashboard/settings",
    icon: "heroicons:cog-6-tooth",
  },
];

export default function Sidebar({ teams, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isTeamMenuOpen, setIsTeamMenuOpen] = useState(false);

  // URL'den teamId'yi al, yoksa ilk takımı kullan
  const activeTeamId = searchParams.get("teamId");

  const activeTeam = useMemo(() => {
    if (activeTeamId) {
      const found = teams.find((t) => t.id === activeTeamId);
      if (found) return found;
    }
    return (
      teams[0] || {
        name: "Kişisel Alan",
        id: "personal",
        slug: "personal",
      }
    );
  }, [activeTeamId, teams]);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 z-40 hidden md:flex flex-col">
      {/* --- WORKSPACE HEADER (Takım Seçici) --- */}
      <div className="h-16 flex items-center px-4 border-b border-slate-100 relative">
        <button
          onClick={() => setIsTeamMenuOpen(!isTeamMenuOpen)}
          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors text-left group"
        >
          <div className="relative w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-600/20">
            <span className="font-bold text-sm">
              {activeTeam.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">
              {activeTeam.name}
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              {teams.length > 0 ? "Ücretsiz Plan" : "Takım Yok"}
            </p>
          </div>
          <Icon icon="heroicons:chevron-up-down" className="text-slate-400" />
        </button>

        {/* Takım Dropdown Menüsü */}
        {isTeamMenuOpen && (
          <div className="absolute top-14 left-2 right-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Takımlarım
            </div>
            {teams.map((team) => (
              <Link
                key={team.id}
                href={`/dashboard/team?teamId=${team.id}`}
                onClick={() => setIsTeamMenuOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left"
              >
                <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                  {team.name.substring(0, 2).toUpperCase()}
                </div>
                <span className="truncate flex-1">{team.name}</span>
                {team.id === activeTeam.id && (
                  <Icon icon="heroicons:check" className="text-blue-600" />
                )}
              </Link>
            ))}
            <div className="h-px bg-slate-100 my-1"></div>
            <Link
              href="/dashboard/teams/create"
              className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              onClick={() => setIsTeamMenuOpen(false)}
            >
              <Icon icon="heroicons:plus-circle" />
              Yeni Takım Oluştur
            </Link>
          </div>
        )}
      </div>

      {/* --- SCROLLABLE MENU --- */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 custom-scrollbar">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              {group.title}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`
                      flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        icon={item.icon}
                        className={`text-lg ${
                          isActive
                            ? "text-blue-600"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      <span>{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.isPro && (
                        <Icon
                          icon="heroicons:lock-closed"
                          className="text-xs text-slate-300"
                        />
                      )}
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold min-w-[20px] text-center ${
                            item.badgeColor || "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="space-y-0.5">
          {bottomItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <Icon icon={item.icon} className="text-lg text-slate-400" />
              {item.title}
            </Link>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center gap-3 px-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-medium text-slate-500 truncate max-w-[140px]">
            {userEmail || "Kullanıcı"}
          </span>
        </div>
      </div>
    </aside>
  );
}
