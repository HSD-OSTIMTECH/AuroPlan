import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getCalendarItems } from "./actions";
import CalendarContainer from "@/components/calendar/CalendarContainer"; // YENİ

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

  const params = await searchParams;
  const teamId = params.teamId || "personal";

  // Takımları Çek
  const { data: memberships } = await supabase
    .from("team_members")
    .select("teams(id, name)")
    .eq("user_id", user.id);

  const myTeams = memberships?.map((m: any) => m.teams).filter(Boolean) || [];

  // Verileri Çek
  const items = await getCalendarItems(teamId);

  return (
    <div className="h-[calc(100vh-100px)]">
      <CalendarContainer
        items={items}
        teams={myTeams}
        teamId={teamId}
        currentUserId={user.id} // <--- BU EKLENDİ
      />
    </div>
  );
}
