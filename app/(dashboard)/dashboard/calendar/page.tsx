import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getCalendarItems } from "./actions";
import CalendarView from "@/components/calendar/CalendarView";
import EventModal from "@/components/calendar/EventModal"; // <--- İMPORT EKLENDİ
import { Icon } from "@iconify/react";

// Sayfa sunucu bileşeni (Server Component)
export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ teamId?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. URL'den takım ID'sini al
  const params = await searchParams;
  const teamId = params.teamId || "personal";

  // 2. Kullanıcının Takımlarını Çek (Modal için)
  const { data: memberships } = await supabase
    .from("team_members")
    .select("teams(id, name)")
    .eq("user_id", user.id);

  const myTeams = memberships?.map((m: any) => m.teams).filter(Boolean) || [];

  // 3. Takvim Verilerini Çek (Görevler + Projeler + Etkinlikler)
  const items = await getCalendarItems(teamId);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Icon icon="heroicons:calendar-days" className="text-blue-600" />
            Takvim
          </h1>
          <p className="text-slate-500 text-sm">
            {teamId === "personal" ? "Kişisel planlamanız" : "Takım planlaması"}
          </p>
        </div>

        {/* Yeni Modal Bileşeni */}
        <EventModal teams={myTeams} />
      </div>

      {/* Takvim Bileşeni */}
      <div className="flex-1">
        <CalendarView items={items} />
      </div>
    </div>
  );
}
