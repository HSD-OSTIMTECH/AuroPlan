import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import ProjectCard from "@/components/projects/ProjectCard";
import { Icon } from "@iconify/react";
import Link from "next/link";
import type { Database } from "@/types/supabase";

type SearchParams = {
  teamId?: string;
};

type ProjectRecord = Database["public"]["Tables"]["projects"]["Row"] & {
  project_milestones?: { count: number }[];
  project_members?: { count: number }[];
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams> | SearchParams;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: memberships } = await supabase
    .from("team_members")
    .select("team_id, role, teams(id, name, slug)")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: true });

  if (!memberships || memberships.length === 0) {
    redirect("/dashboard/teams/create");
  }

  const teams = (memberships ?? [])
    .map((membership) => ({
      id: membership.teams?.id ?? membership.team_id,
      name: membership.teams?.name ?? "Takım",
      slug: membership.teams?.slug ?? "",
      role: membership.role,
    }))
    .filter((team) => !!team.id);

  const resolvedSearchParams =
    typeof (searchParams as any)?.then === "function"
      ? await (searchParams as Promise<SearchParams>)
      : (searchParams as SearchParams);

  const requestedTeamId = resolvedSearchParams?.teamId;

  const activeTeamId =
    requestedTeamId && teams.some((team) => team.id === requestedTeamId)
      ? requestedTeamId
      : teams[0].id;

  const activeTeam = teams.find((team) => team.id === activeTeamId) || teams[0];

  const { data: projectRows } = await supabase
    .from("projects")
    .select("*, project_milestones(count), project_members(count)")
    .eq("team_id", activeTeam.id)
    .order("created_at", { ascending: false });

  const projects = (projectRows as ProjectRecord[] | null) ?? [];

  const normalized = projects.map((project) => ({
    ...project,
    milestoneCount: project.project_milestones?.[0]?.count ?? 0,
    memberCount: project.project_members?.[0]?.count ?? 0,
  }));

  const totalProjects = normalized.length;
  const activeProjects = normalized.filter((p) => p.status === "in_progress").length;
  const upcomingDeadlines = normalized.filter((project) => {
    if (!project.due_date) return false;
    const due = new Date(project.due_date);
    const now = new Date();
    const diff = due.getTime() - now.getTime();
    return diff >= 0 && diff <= 1000 * 60 * 60 * 24 * 14; // 14 gün
  }).length;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Proje Alanı
          </p>
          <h2 className="text-2xl font-bold text-slate-900">{activeTeam.name} projeleri</h2>
          <p className="text-sm text-slate-500 max-w-2xl">
            Yol haritanızı planlayın, kapsamı ve kilometre taşlarını bu alan üzerinden yönetin.
          </p>
        </div>
        <CreateProjectModal teams={teams} activeTeamId={activeTeam.id} />
      </header>

      {teams.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {teams.map((team) => (
            <Link
              key={team.id}
              href={`/dashboard/projects?teamId=${team.id}`}
              className={`px-4 py-2 text-sm font-semibold rounded-full border transition-colors ${
                team.id === activeTeam.id
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {team.name}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon="heroicons:squares-2x2"
          label="Toplam Proje"
          value={totalProjects}
          description="Planlanan tüm çalışmalar"
        />
        <StatCard
          icon="heroicons:bolt"
          label="Aktif Proje"
          value={activeProjects}
          accent="text-blue-600"
          description="Şu an ilerleyenler"
        />
        <StatCard
          icon="heroicons:calendar-days"
          label="Yaklaşan Teslim"
          value={upcomingDeadlines}
          accent="text-amber-600"
          description="14 gün içinde teslim"
        />
      </div>

      {normalized.length === 0 ? (
        <div className="border border-dashed border-slate-300 rounded-2xl p-10 text-center bg-slate-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center">
              <Icon icon="heroicons:sparkles" className="text-xl text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Henüz proje yok</h3>
            <p className="text-slate-500 text-sm max-w-md">
              İlk projenizi oluşturarak takımınızdaki hedefleri tek bir pano üzerinde toplamaya
              başlayın.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {normalized.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              milestoneCount={project.milestoneCount}
              memberCount={project.memberCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
  accent = "text-emerald-600",
}: {
  icon: string;
  label: string;
  value: number;
  description: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
          <Icon icon={icon} className="text-lg" />
        </div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </div>
      </div>
      <div className={`text-3xl font-extrabold ${accent}`}>{value}</div>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
    </div>
  );
}
