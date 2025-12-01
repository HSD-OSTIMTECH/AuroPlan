"use client";

import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { createUpdate } from "@/app/(dashboard)/dashboard/projects/actions";
import toast from "react-hot-toast";

export default function NewUpdateModal({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      formData.append("projectId", projectId);
      await createUpdate(formData);
      toast.success("Güncelleme paylaşıldı! 📢");
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
        className="text-[10px] font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
      >
        <Icon icon="heroicons:pencil-square" />
        Yaz
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900">Güncelleme Paylaş</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icon icon="heroicons:x-mark" className="text-xl" />
              </button>
            </div>

            <form ref={formRef} action={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {/* Tip Seçimi (Radio Button Görünümlü) */}
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="note"
                    className="peer sr-only"
                    defaultChecked
                  />
                  <div className="text-center px-3 py-2 rounded-lg border border-slate-200 text-slate-500 text-xs font-bold peer-checked:bg-blue-50 peer-checked:text-blue-600 peer-checked:border-blue-200 transition-all">
                    📝 Not
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="risk"
                    className="peer sr-only"
                  />
                  <div className="text-center px-3 py-2 rounded-lg border border-slate-200 text-slate-500 text-xs font-bold peer-checked:bg-red-50 peer-checked:text-red-600 peer-checked:border-red-200 transition-all">
                    jq Risk
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="decision"
                    className="peer sr-only"
                  />
                  <div className="text-center px-3 py-2 rounded-lg border border-slate-200 text-slate-500 text-xs font-bold peer-checked:bg-green-50 peer-checked:text-green-600 peer-checked:border-green-200 transition-all">
                    ✅ Karar
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Başlık
                </label>
                <input
                  name="title"
                  required
                  placeholder="Örn: API Entegrasyonu Tamamlandı"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Detay (Opsiyonel)
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Ekip için notlar..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm resize-none"
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
                  className="px-6 py-2 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <Icon icon="svg-spinners:180-ring" />
                  ) : (
                    <Icon icon="heroicons:paper-airplane" />
                  )}
                  Paylaş
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
