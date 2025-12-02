"use client";

import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { createCalendarEvent } from "@/app/(dashboard)/dashboard/calendar/actions";
import toast from "react-hot-toast";

type Team = {
  id: string;
  name: string;
};

export default function EventModal({ teams }: { teams: Team[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      await createCalendarEvent(formData);
      toast.success("Etkinlik oluşturuldu! 📅");
      setIsOpen(false);
      formRef.current?.reset();
    } catch (error) {
      toast.error("Bir hata oluştu.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-600/20"
      >
        <Icon icon="heroicons:plus" />
        Etkinlik Ekle
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                Yeni Etkinlik
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icon icon="heroicons:x-mark" className="text-2xl" />
              </button>
            </div>

            <form ref={formRef} action={handleSubmit} className="space-y-4">
              {/* Başlık */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Etkinlik Başlığı
                </label>
                <input
                  name="title"
                  required
                  placeholder="Örn: Haftalık Planlama Toplantısı"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm"
                />
              </div>

              {/* Tarihler */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Başlangıç
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Bitiş
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm text-slate-600"
                  />
                </div>
              </div>

              {/* Tip ve Takım */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Tür
                  </label>
                  <select
                    name="type"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="meeting"> Toplantı</option>
                    <option value="reminder"> Hatırlatıcı</option>
                    <option value="holiday"> Tatil / İzin</option>
                    <option value="ooo"> Ofis Dışı</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Takvim
                  </label>
                  <select
                    name="teamId"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="personal">👤 Kişisel</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Açıklama */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Notlar
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm resize-none"
                  placeholder="Detaylar..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <Icon icon="svg-spinners:180-ring" />
                  ) : (
                    <Icon icon="heroicons:check" />
                  )}
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
