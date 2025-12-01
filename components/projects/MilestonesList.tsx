"use client";
import { Icon } from "@iconify/react";
import { toggleMilestoneStatus } from "@/app/(dashboard)/dashboard/projects/actions";
import { useState } from "react";
import toast from "react-hot-toast";

export default function MilestonesList({
  milestones,
  projectId,
}: {
  milestones: any[];
  projectId: string;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggle = async (id: string, status: string) => {
    setLoadingId(id);
    try {
      await toggleMilestoneStatus(id, status, projectId);
      if (status !== "done") toast.success("Hedef tamamlandı! 🎉");
    } catch {
      toast.error("Durum güncellenemedi.");
    } finally {
      setLoadingId(null);
    }
  };

  if (milestones.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
          <Icon icon="heroicons:map" className="text-2xl" />
        </div>
        <p className="text-slate-500 text-sm">
          Henüz yol haritası oluşturulmadı.
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Yukarıdaki "Ekle" butonu ile başlayın.
        </p>
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 py-2">
      {milestones.map((milestone) => (
        <div key={milestone.id} className="relative pl-8 group">
          {/* Durum Noktası (Tıklanabilir) */}
          <button
            onClick={() => handleToggle(milestone.id, milestone.status)}
            disabled={loadingId === milestone.id}
            className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 transition-all z-10 flex items-center justify-center
             ${
               milestone.status === "done"
                 ? "bg-green-500 border-green-500 hover:bg-green-600"
                 : "bg-white border-slate-300 hover:border-blue-500 hover:scale-110"
             }`}
          >
            {loadingId === milestone.id ? (
              <Icon
                icon="svg-spinners:180-ring"
                className="text-[8px] text-slate-500"
              />
            ) : (
              milestone.status === "done" && (
                <Icon icon="heroicons:check" className="text-white w-3 h-3" />
              )
            )}
          </button>

          <div className="flex justify-between items-start">
            <div>
              <h4
                className={`text-sm font-bold transition-colors ${
                  milestone.status === "done"
                    ? "text-slate-400 line-through"
                    : "text-slate-800"
                }`}
              >
                {milestone.title}
              </h4>
              {milestone.due_date && (
                <span
                  className={`text-xs ${
                    milestone.status === "done"
                      ? "text-slate-300"
                      : "text-slate-400"
                  }`}
                >
                  Hedef:{" "}
                  {new Date(milestone.due_date).toLocaleDateString("tr-TR")}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
