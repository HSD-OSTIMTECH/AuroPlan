"use client";

import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { updateProject } from "@/app/(dashboard)/dashboard/projects/actions";
import toast from "react-hot-toast";

export default function EditProjectModal({ project }: { project: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      formData.append("projectId", project.id);
      await updateProject(formData);
      toast.success("Proje güncellendi! ✅");
      setIsOpen(false);
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
      >
        <Icon icon="heroicons:pencil-square" />
        Düzenle
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                Projeyi Düzenle
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icon icon="heroicons:x-mark" className="text-2xl" />
              </button>
            </div>

            <form ref={formRef} action={handleSubmit} className="space-y-4">
              {/* İsim */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Proje Adı
                </label>
                <input
                  name="name"
                  defaultValue={project.name}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>

              {/* Açıklama */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={project.description || ""}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                />
              </div>

              {/* Durum ve Öncelik */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Durum
                  </label>
                  <select
                    name="status"
                    defaultValue={project.status}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="planning">Planlanıyor</option>
                    <option value="in_progress">Sürüyor</option>
                    <option value="on_hold">Beklemede</option>
                    <option value="completed">Tamamlandı</option>
                    <option value="cancelled">İptal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Öncelik
                  </label>
                  <select
                    name="priority"
                    defaultValue={project.priority}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksek</option>
                    <option value="critical">Kritik</option>
                  </select>
                </div>
              </div>

              {/* Tarihler */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Başlangıç
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    defaultValue={project.start_date || ""}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Bitiş (Hedef)
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    defaultValue={project.due_date || ""}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
