import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ReportsPageClient from "./ReportsPageClient";
import { getAllReports, getUploadableEntities } from "./actions";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const params = await searchParams;
  const activeTab = params?.tab || "personal";

  // Raporları getir
  const { personal, team, project } = await getAllReports();

  // Yüklenebilecek takım/projeler
  const { teams, projects } = await getUploadableEntities();

  return (
    <ReportsPageClient
      userId={user.id}
      activeTab={activeTab}
      personalReports={personal}
      teamReports={team}
      projectReports={project}
      uploadableTeams={teams}
      uploadableProjects={projects}
    />
  );
}
