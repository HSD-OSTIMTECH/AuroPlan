import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import type { Database } from "@/types/supabase";
import { getProjectPriorityMeta, getProjectStatusMeta } from "@/components/projects/constants";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"] & {
  teams?: { id: string; name: string | null; slug: string | null } | null;
  project_milestones?: Database["public"]["Tables"]["project_milestones"]["Row"][] | null;
  project_updates?: Database["public"]["Tables"]["project_updates"]["Row"][] | null;
  project_documents?: Database["public"]["Tables"]["project_documents"]["Row"][] | null;
};

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
        *,
        teams ( id, name, slug ),
        project_milestones ( * ),
        project_updates ( * ),
        project_documents ( * )
      `,
    )
    .eq("id", params.id)
    .single();

  if (error || !data) {
    notFound();
  }

  const project = data as ProjectRow;
  const statusMeta = getProjectStatusMeta(project.status);
  const priorityMeta = getProjectPriorityMeta(project.priority);

  const milestones = (project.project_milestones ?? []).sort(
    (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0),
  );
  const updates = (project.project_updates ?? []).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  const documents = project.project_documents ?? [];

  const formatDate = (value?: string | null) =>
    value ? dateFormatter.format(new Date(value)) : "Belirlenmedi";

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/dashboard/projects" className="hover:text-primary flex items-center gap-1">
          <Icon icon="heroicons:arrow-left" />
          Proje listesine dön
        </Link>
        <span className="text-slate-300">/</span>
        <span>{project.name}</span>
      </div>

      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {project.teams?.name ?? "Takım Projesi"}
            </p>
            <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
            {project.description && (
              <p className="text-sm text-slate-500 mt-2 max-w-3xl">{project.description}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${statusMeta.badge}`}>
              {statusMeta.label}
            </span>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${priorityMeta.badge}`}>
              {priorityMeta.label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
          <InfoBlock label="Başlangıç" value={formatDate(project.start_date)} icon="heroicons:play" />
          <InfoBlock label="Teslim" value={formatDate(project.due_date)} icon="heroicons:calendar" />
          <InfoBlock
            label="Oluşturulma"
            value={dateFormatter.format(new Date(project.created_at))}
            icon="heroicons:clock"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Icon icon="heroicons:light-bulb" className="text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">Proje Amacı</h2>
          </div>
          <p className="text-slate-600 text-sm">
            {project.objective || "Bu projeye ait hedef henüz eklenmedi."}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Icon icon="heroicons:adjustments-horizontal" className="text-blue-500" />
            <h2 className="text-lg font-bold text-slate-900">Planlama Özeti</h2>
          </div>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li>• Takvim, raporlar ve görevler proje özelinde planlanacak (yakında).</li>
            <li>• Kilometre taşları bu ekrandan yönetilecek.</li>
            <li>• Mikro öğrenme kartları proje bazlı filtrelenecek.</li>
          </ul>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Kilometre Taşları</h2>
            <p className="text-sm text-slate-500">
              Teslim tarihlerini planlayın, ilerlemeyi takip edin.
            </p>
          </div>
          <button className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1">
            <Icon icon="heroicons:plus-circle" />
            Yakında
          </button>
        </div>
        {milestones.length === 0 ? (
          <p className="text-sm text-slate-500 border border-dashed border-slate-200 rounded-2xl p-6 text-center">
            Henüz milestone eklenmedi. Projenin ana teslimlerini burada toplayacağız.
          </p>
        ) : (
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="border border-slate-100 rounded-2xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{milestone.title}</p>
                  {milestone.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{milestone.description}</p>
                  )}
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p className="font-semibold">{formatDate(milestone.due_date)}</p>
                  <p className="capitalize">{milestone.status?.replace("_", " ")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Icon icon="heroicons:chat-bubble-left-ellipsis" className="text-emerald-500" />
            <h2 className="text-lg font-bold text-slate-900">Son Notlar</h2>
          </div>
          {updates.length === 0 ? (
            <p className="text-sm text-slate-500 border border-dashed border-slate-200 rounded-2xl p-4 text-center">
              Henüz kayıtlı stratejik not yok. Rapor ve kararlar yakında burada olacak.
            </p>
          ) : (
            <div className="space-y-3">
              {updates.slice(0, 4).map((update) => (
                <div key={update.id} className="border border-slate-100 rounded-2xl p-4">
                  <p className="text-xs uppercase text-slate-400 font-semibold">
                    {update.update_type}
                  </p>
                  <h3 className="text-sm font-bold text-slate-900">{update.title}</h3>
                  {update.body && (
                    <p className="text-sm text-slate-600 line-clamp-2 mt-1">{update.body}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-2">
                    {dateFormatter.format(new Date(update.created_at))}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Icon icon="heroicons:folder" className="text-slate-500" />
            <h2 className="text-lg font-bold text-slate-900">Dokümanlar</h2>
          </div>
          {documents.length === 0 ? (
            <p className="text-sm text-slate-500 border border-dashed border-slate-200 rounded-2xl p-4 text-center">
              Supabase storage ile proje belgeleri burada tutulacak.
            </p>
          ) : (
            <div className="space-y-3">
              {documents.slice(0, 5).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between border border-slate-100 rounded-2xl p-3 text-sm"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{doc.file_name}</p>
                    <p className="text-xs text-slate-400">{doc.file_type}</p>
                  </div>
                  <span className="text-xs text-slate-500">
                    {dateFormatter.format(new Date(doc.created_at))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function InfoBlock({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="border border-slate-100 rounded-2xl p-4 flex items-center gap-3 bg-slate-50/50">
      <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center">
        <Icon icon={icon} className="text-slate-500" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">{label}</p>
        <p className="text-base font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
