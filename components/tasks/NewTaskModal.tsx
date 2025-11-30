"use client";

import { Icon } from "@iconify/react";
import { createTask } from "../../app/(dashboard)/dashboard/tasks/action";
import { useState, useRef } from "react";

export default function NewTaskModal() {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsOpen(false);
    await createTask(formData);
    formRef.current?.reset(); // Formu temizle
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-blue-600/20"
      >
        <Icon icon="heroicons:plus" className="text-lg" />
        Yeni Görev
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                Yeni Görev Oluştur
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icon icon="heroicons:x-mark" className="text-2xl" />
              </button>
            </div>

            <form ref={formRef} action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Başlık
                </label>
                <input
                  name="title"
                  required
                  placeholder="Örn: Landing page tasarımı..."
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Detayları buraya ekleyin..."
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Öncelik
                  </label>
                  <select
                    name="priority"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="medium">Orta</option>
                    <option value="low">Düşük</option>
                    <option value="high">Yüksek</option>
                    <option value="critical">Kritik</option>
                  </select>
                </div>
                {/* Tarih seçici eklenebilir */}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
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
