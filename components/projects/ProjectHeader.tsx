import { Icon } from "@iconify/react";
import EditProjectModal from "./EditProjectModal";

export default function ProjectHeader({
  project,
  progress,
}: {
  project: any;
  progress: number;
}) {
  // Tarih formatla
  const dueDate = project.due_date
    ? new Date(project.due_date).toLocaleDateString("tr-TR")
    : "Belirsiz";

  // Renk belirle
  const statusColors: any = {
    planning: "bg-slate-100 text-slate-600",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    on_hold: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const statusLabels: any = {
    planning: "Planlanıyor",
    in_progress: "Sürüyor",
    completed: "Tamamlandı",
    on_hold: "Beklemede",
    cancelled: "İptal",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
      {/* Arkaplan Süsü */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                statusColors[project.status] || "bg-slate-100"
              }`}
            >
              {statusLabels[project.status] || project.status}
            </span>
            <span className="text-slate-400 text-xs font-medium flex items-center gap-1">
              <Icon icon="heroicons:calendar" />
              Teslim: {dueDate}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            {project.name}
          </h1>
          <p className="text-slate-500 max-w-2xl text-sm leading-relaxed">
            {project.description || "Bu proje için henüz açıklama girilmemiş."}
          </p>
        </div>

        <div className="flex flex-col items-end gap-4 min-w-[200px]">
          {/* İlerleme Çubuğu */}
          <div className="w-full">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-500">İlerleme</span>
              <span className="text-blue-600">%{progress}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex gap-2">
            <EditProjectModal project={project} />

            <button className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition flex items-center gap-2 shadow-lg shadow-slate-900/10">
              <Icon icon="heroicons:check" />
              Tamamla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
