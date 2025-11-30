"use client";

import { Icon } from "@iconify/react";
import { deleteTask, updateTaskStatus } from "../../app/(dashboard)/dashboard/tasks/action";
import { useState } from "react";

// Tip tanımlaması (Normalde types klasöründen gelmeli)
type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  due_date: string | null;
};

const priorityColors: { [key: string]: string } = {
  low: "bg-slate-100 text-slate-600 border-slate-200",
  medium: "bg-blue-50 text-blue-600 border-blue-100",
  high: "bg-amber-50 text-amber-600 border-amber-100",
  critical: "bg-red-50 text-red-600 border-red-100",
};

export default function TaskCard({ task }: { task: Task }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Bu görevi silmek istediğinize emin misiniz?")) return;
    setIsLoading(true);
    await deleteTask(task.id);
    setIsLoading(false);
  };

  const handleMove = async (direction: "next" | "prev") => {
    setIsLoading(true);
    let newStatus = task.status;

    // Basit durum makinesi
    if (task.status === "todo" && direction === "next")
      newStatus = "in_progress";
    else if (task.status === "in_progress" && direction === "next")
      newStatus = "done";
    else if (task.status === "in_progress" && direction === "prev")
      newStatus = "todo";
    else if (task.status === "done" && direction === "prev")
      newStatus = "in_progress";

    if (newStatus !== task.status) {
      await updateTaskStatus(task.id, newStatus);
    }
    setIsLoading(false);
  };

  return (
    <div
      className={`group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 ${
        isLoading ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Üst Kısım: Etiketler ve Menü */}
      <div className="flex justify-between items-start mb-3">
        <span
          className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${
            priorityColors[task.priority] || priorityColors.medium
          }`}
        >
          {task.priority === "high"
            ? "Yüksek"
            : task.priority === "medium"
            ? "Orta"
            : "Düşük"}
        </span>

        <button
          onClick={handleDelete}
          className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Icon icon="heroicons:trash" />
        </button>
      </div>

      {/* İçerik */}
      <h4 className="font-bold text-slate-800 mb-1 leading-tight">
        {task.title}
      </h4>
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Alt Kısım: Aksiyonlar ve Tarih */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Icon icon="heroicons:clock" />
          <span>Bugün</span>
        </div>

        {/* Hızlı Durum Değiştirme Butonları */}
        <div className="flex gap-1">
          {task.status !== "todo" && (
            <button
              onClick={() => handleMove("prev")}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              title="Geri Taşı"
            >
              <Icon icon="heroicons:chevron-left" />
            </button>
          )}
          {task.status !== "done" && (
            <button
              onClick={() => handleMove("next")}
              className="p-1.5 rounded hover:bg-blue-50 text-blue-500 hover:text-blue-700"
              title="İlerle"
            >
              <Icon icon="heroicons:chevron-right" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
