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
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. Takımları Çek
  const { data: memberships } = await supabase
    .from("team_members")
    .select("team_id, role, teams(id, name, slug)")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: true });

  // 2. Takım Listesini Oluştur
  const realTeams = (memberships ?? [])
    .map((membership) => ({
      id: membership.teams?.id ?? membership.team_id,
      name: membership.teams?.name ?? "Takım",
      slug: membership.teams?.slug ?? "",
      role: membership.role,
      type: "team",
    }))
    .filter((team) => !!team.id);

  // 3. "Kişisel Projeler" Alanını Listeye Ekle
  const allWorkspaces = [
    {
      id: "personal",
      name: "Kişisel Projeler",
      slug: "personal",
      role: "owner",
      type: "personal",
    },
    ...realTeams,
  ];

  // 4. Aktif Alanı Belirle
  const resolvedSearchParams = await searchParams;
  const requestedTeamId = resolvedSearchParams?.teamId;

  const activeWorkspace =
    requestedTeamId && allWorkspaces.some((w) => w.id === requestedTeamId)
      ? allWorkspaces.find((w) => w.id === requestedTeamId)
      : allWorkspaces[0]; // Varsayılan olarak ilk sıradaki (Kişisel veya ilk takım)

  if (!activeWorkspace) {
    // Teorik olarak buraya düşmez ama güvenlik için
    return <div>Yüklüyor...</div>;
  }

  // --- DEBUG LOGLARI ---
  console.log("------------------------------------------------");
  console.log("🔍 Projects Page Check");
  console.log("👤 User:", user.id);
  console.log("Pf Active Workspace:", activeWorkspace.name, activeWorkspace.id);

  // 5. Projeleri Çek (Dinamik Sorgu)
  let query = supabase
    .from("projects")
    .select("*, project_milestones(count), project_members(count)");

  if (activeWorkspace.id === "personal") {
    // Kişisel projeler: team_id NULL olanlar ve sahibi benim olanlar
    query = query.is("team_id", null).eq("owner_id", user.id);
  } else {
    // Takım projeleri: team_id eşleşenler
    query = query.eq("team_id", activeWorkspace.id);
  }

  const { data: projectRows, error: projectError } = await query.order(
    "created_at",
    { ascending: false }
  );

  if (projectError) {
    console.error("❌ Project Error:", projectError);
  } else {
    console.log("✅ Found:", projectRows?.length);
  }
  console.log("------------------------------------------------");

  const projects = (projectRows as ProjectRecord[] | null) ?? [];

  const normalized = projects.map((project) => ({
    ...project,
    milestoneCount: project.project_milestones?.[0]?.count ?? 0,
    memberCount: project.project_members?.[0]?.count ?? 0,
  }));

  const totalProjects = normalized.length;
  const activeProjects = normalized.filter(
    (p) => p.status === "in_progress"
  ).length;
  const upcomingDeadlines = normalized.filter((project) => {
    if (!project.due_date) return false;
    const due = new Date(project.due_date);
    const now = new Date();
    const diff = due.getTime() - now.getTime();
    return diff >= 0 && diff <= 1000 * 60 * 60 * 24 * 14; // 14 gün
  }).length;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            {activeWorkspace.id === "personal" ? (
              <>
                <Icon icon="heroicons:user" /> Bireysel Alan
              </>
            ) : (
              <>
                <Icon icon="heroicons:users" /> Takım Alanı
              </>
            )}
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            {activeWorkspace.name}
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mt-1">
            {activeWorkspace.id === "personal"
              ? "Sadece sizin görebileceğiniz bireysel projeleriniz."
              : "Bu takıma ait projeler ve işbirlikleri."}
          </p>
        </div>

        {/* Modal'a tüm takımları gönderiyoruz ki seçim yapılabilsin */}
        <CreateProjectModal
          teams={realTeams}
          activeTeamId={
            activeWorkspace.id === "personal" ? "" : activeWorkspace.id
          }
        />
      </header>

      {/* --- SEKME YAPISI (Workspace Switcher) --- */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
        {allWorkspaces.map((workspace) => (
          <Link
            key={workspace.id}
            href={`/dashboard/projects?teamId=${workspace.id}`}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-all ${
              workspace.id === activeWorkspace.id
                ? "border-slate-900 text-slate-900 bg-slate-50"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            {workspace.id === "personal" ? (
              <Icon icon="heroicons:user" />
            ) : (
              <Icon icon="heroicons:users" />
            )}
            {workspace.name}
          </Link>
        ))}
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon="heroicons:squares-2x2"
          label="Toplam Proje"
          value={totalProjects}
          description="Bu alandaki tüm projeler"
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
          description="14 gün içinde"
        />
      </div>

      {normalized.length === 0 ? (
        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              <Icon
                icon="heroicons:sparkles"
                className="text-2xl text-slate-300"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Henüz proje yok
              </h3>
              <p className="text-slate-500 text-sm max-w-md mt-1">
                "{activeWorkspace.name}" altında henüz bir çalışma
                başlatmadınız.
              </p>
            </div>
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
