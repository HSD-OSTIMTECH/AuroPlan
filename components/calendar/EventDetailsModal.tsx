"use client";
import { CalendarItem } from "@/types/calendar";
import { Icon } from "@iconify/react";
import { deleteCalendarEvent } from "@/app/(dashboard)/dashboard/calendar/actions";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  item: CalendarItem | null;
  onClose: () => void;
  currentUserId: string;
}

export default function EventDetailsModal({
  item,
  onClose,
  currentUserId,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!item) return null;

  // Yetki Kontrolü: Oluşturan ben miyim?
  const canManage = item.metadata?.creatorId === currentUserId;

  const handleDelete = async () => {
    if (!confirm("Bu etkinliği silmek istediğinize emin misiniz?")) return;
    setIsDeleting(true);
    try {
      await deleteCalendarEvent(item.id);
      toast.success("Silindi");
      onClose();
    } catch {
      toast.error("Silinemedi");
    } finally {
      setIsDeleting(false);
    }
  };

  // Tip Rengi ve İkonu
  let typeInfo = {
    icon: "heroicons:calendar",
    label: "Etkinlik",
    bg: "bg-slate-100",
    text: "text-slate-600",
  };

  if (item.type === "task")
    typeInfo = {
      icon: "heroicons:check-circle",
      label: "Görev",
      bg: "bg-blue-100",
      text: "text-blue-700",
    };
  else if (item.type === "project")
    typeInfo = {
      icon: "heroicons:folder",
      label: "Proje",
      bg: "bg-purple-100",
      text: "text-purple-700",
    };
  else if (item.status === "meeting")
    typeInfo = {
      icon: "heroicons:users",
      label: "Toplantı",
      bg: "bg-amber-100",
      text: "text-amber-700",
    };
  else if (item.status === "holiday")
    typeInfo = {
      icon: "heroicons:sparkles",
      label: "Tatil",
      bg: "bg-pink-100",
      text: "text-pink-700",
    };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 relative animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <Icon icon="heroicons:x-mark" className="text-xl" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${typeInfo.bg} ${typeInfo.text}`}
          >
            <Icon icon={typeInfo.icon} className="text-xl" />
          </div>
          <div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${typeInfo.text}`}
            >
              {typeInfo.label}
            </span>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              {item.title}
            </h3>
          </div>
        </div>

        {/* Detaylar */}
        <div className="space-y-4 py-2">
          <div className="flex gap-3 text-sm text-slate-600">
            <Icon
              icon="heroicons:clock"
              className="text-lg text-slate-400 mt-0.5"
            />
            <div>
              <p className="font-medium">
                {item.startDate.toLocaleDateString("tr-TR")}
                {!item.isAllDay &&
                  ` • ${item.startDate.toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`}
              </p>
              {item.endDate > item.startDate && (
                <p className="text-slate-400 text-xs">
                  Bitiş: {item.endDate.toLocaleDateString("tr-TR")}
                </p>
              )}
            </div>
          </div>

          {item.metadata?.description && (
            <div className="flex gap-3 text-sm text-slate-600">
              <Icon
                icon="heroicons:bars-3-bottom-left"
                className="text-lg text-slate-400 mt-0.5"
              />
              <p className="bg-slate-50 p-3 rounded-lg w-full border border-slate-100 text-xs leading-relaxed">
                {item.metadata.description}
              </p>
            </div>
          )}

          {item.type !== "event" && (
            <div className="flex gap-3 text-sm">
              <Icon icon="heroicons:link" className="text-lg text-slate-400" />
              <a
                href={
                  item.type === "project"
                    ? `/dashboard/projects/${item.id}`
                    : "/dashboard/tasks"
                }
                className="text-blue-600 hover:underline font-medium"
              >
                Kaynağa Git
              </a>
            </div>
          )}
        </div>

        {/* Aksiyonlar (Sadece Event ve Sahibi ise) */}
        {item.type === "event" && canManage && (
          <div className="border-t border-slate-100 mt-6 pt-4 flex justify-end gap-2">
            <button
              disabled={true}
              className="px-3 py-2 text-xs font-bold text-slate-400 border border-slate-200 rounded-lg cursor-not-allowed"
              title="Düzenleme yakında"
            >
              Düzenle
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-colors flex items-center gap-1"
            >
              {isDeleting ? (
                <Icon icon="svg-spinners:180-ring" />
              ) : (
                <Icon icon="heroicons:trash" />
              )}
              Sil
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
