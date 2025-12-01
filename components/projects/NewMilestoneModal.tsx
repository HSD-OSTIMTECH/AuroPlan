"use client";

import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { createMilestone } from "@/app/(dashboard)/dashboard/projects/actions";
import toast from "react-hot-toast";

export default function NewMilestoneModal({
  projectId,
}: {
  projectId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      formData.append("projectId", projectId);
      await createMilestone(formData);
      toast.success("Hedef eklendi! 🎯");
      setIsOpen(false);
      formRef.current?.reset();
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
        className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-blue-100 flex items-center gap-1"
      >
        <Icon icon="heroicons:plus" />
        Ekle
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900">Yeni Kilometre Taşı</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icon icon="heroicons:x-mark" className="text-xl" />
              </button>
            </div>

            <form ref={formRef} action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Hedef Başlığı
                </label>
                <input
                  name="title"
                  required
                  autoFocus
                  placeholder="Örn: Tasarım Onayı"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Hedef Tarih (Opsiyonel)
                </label>
                <input
                  type="date"
                  name="dueDate"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm text-slate-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  {loading && <Icon icon="svg-spinners:180-ring" />}
                  Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
