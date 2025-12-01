"use client";

import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { createProject } from "@/app/(dashboard)/dashboard/projects/actions";

type Team = {
  id: string;
  name: string;
};

type Props = {
  teams: Team[];
  activeTeamId: string;
};

export default function CreateProjectModal({ teams, activeTeamId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await createProject(formData);
      toast.success("Proje oluşturuldu");
      formRef.current?.reset();
      setIsOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Proje oluşturulamadı.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (teams.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-blue-600/20"
      >
        <Icon icon="heroicons:plus" className="text-lg" />
        Yeni Proje
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-100 shadow-2xl">
            <div className="flex items-start justify-between px-6 pt-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Proje Başlat
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  Yol haritanızı planlayın
                </h3>
                <p className="text-sm text-slate-500">
                  Takımınızı hizalayın, teslim tarihlerini belirleyin ve proje
                  ritmini oluşturun.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icon icon="heroicons:x-mark" className="text-2xl" />
              </button>
            </div>

            <form ref={formRef} action={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Takım">
                  <select
                    name="teamId"
                    defaultValue={activeTeamId || "personal"}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all appearance-none"
                  >
                    <option value="personal">
                      Kişisel Proje (Takımsız)
                    </option>
                    <optgroup label="Takımlarım">
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </FormField>
                <FormField label="Proje Adı">
                  <input
                    name="name"
                    required
                    minLength={3}
                    placeholder="Örn: Aura Plan v1.0"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Durum">
                  <select
                    name="status"
                    defaultValue="planning"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="planning">Planlama</option>
                    <option value="in_progress">Devam ediyor</option>
                    <option value="on_hold">Beklemede</option>
                  </select>
                </FormField>
                <FormField label="Öncelik">
                  <select
                    name="priority"
                    defaultValue="medium"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksek</option>
                    <option value="critical">Kritik</option>
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Başlangıç">
                  <input
                    type="date"
                    name="startDate"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </FormField>
                <FormField label="Teslim Tarihi">
                  <input
                    type="date"
                    name="dueDate"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </FormField>
              </div>

              <FormField label="Proje Amacı">
                <textarea
                  name="objective"
                  rows={3}
                  placeholder="Bu proje ile neyi başarmak istiyoruz?"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                />
              </FormField>

              <FormField label="Açıklama / Plan Notu">
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Kapsam, teslimler ve önemli notlar..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                />
              </FormField>

              <FormField label="Kapak Görseli (opsiyonel)">
                <input
                  name="coverImageUrl"
                  type="url"
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </FormField>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-3 text-sm font-bold text-slate-500 hover:text-slate-700"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 text-sm font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Icon icon="svg-spinners:180-ring" />
                      Kaydediliyor
                    </>
                  ) : (
                    <>
                      <Icon icon="heroicons:bolt" />
                      Projeyi Başlat
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      {children}
    </label>
  );
}
