import { createClient } from "@/utils/supabase/server";
import TaskCard from "@/components/tasks/TaskCard";
import NewTaskModal from "@/components/tasks/NewTaskModal";
import { Icon } from "@iconify/react";

export default async function TasksPage() {
  const supabase = await createClient();

  // Oturum açmış kullanıcının görevlerini çek
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div>Veriler yüklenirken bir hata oluştu.</div>;
  }

  // Görevleri durumlarına göre grupla
  const todoTasks = tasks?.filter((t) => t.status === "todo") || [];
  const inProgressTasks =
    tasks?.filter((t) => t.status === "in_progress") || [];
  const doneTasks = tasks?.filter((t) => t.status === "done") || [];

  return (
    <div className="h-full flex flex-col">
      {/* Sayfa Başlığı ve Aksiyon */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Proje Panosu</h2>
          <p className="text-slate-500">
            İş akışınızı buradan yönetin ve takip edin.
          </p>
        </div>
        <NewTaskModal />
      </div>

      {/* Kanban Board Layout */}
      <div className="grid md:grid-cols-3 gap-6 h-full items-start">
        {/* --- YAPILACAKLAR --- */}
        <div className="bg-slate-100/50 p-4 rounded-2xl border border-slate-200/60 min-h-[500px]">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-400"></div>
              Yapılacaklar
            </h3>
            <span className="bg-white text-slate-500 text-xs font-bold px-2 py-0.5 rounded-md border border-slate-200 shadow-sm">
              {todoTasks.length}
            </span>
          </div>

          <div className="space-y-3">
            {todoTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {todoTasks.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                <p className="text-slate-400 text-sm">Görev yok</p>
              </div>
            )}
          </div>
        </div>

        {/* --- SÜRÜYOR --- */}
        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/60 min-h-[500px]">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-bold text-blue-800 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              Sürüyor
            </h3>
            <span className="bg-white text-blue-600 text-xs font-bold px-2 py-0.5 rounded-md border border-blue-100 shadow-sm">
              {inProgressTasks.length}
            </span>
          </div>

          <div className="space-y-3">
            {inProgressTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* --- TAMAMLANDI --- */}
        <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100/60 min-h-[500px]">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-bold text-green-800 flex items-center gap-2">
              <Icon icon="heroicons:check-circle" className="text-green-600" />
              Tamamlandı
            </h3>
            <span className="bg-white text-green-600 text-xs font-bold px-2 py-0.5 rounded-md border border-green-100 shadow-sm">
              {doneTasks.length}
            </span>
          </div>

          <div className="space-y-3">
            {doneTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
