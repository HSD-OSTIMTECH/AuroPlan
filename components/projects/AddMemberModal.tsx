"use client";

import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { addProjectMember } from "@/app/(dashboard)/dashboard/projects/actions";
import toast from "react-hot-toast";
import Image from "next/image";

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
};

export default function AddMemberModal({
  projectId,
  availableMembers,
}: {
  projectId: string;
  availableMembers: Profile[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      formData.append("projectId", projectId);
      await addProjectMember(formData);
      toast.success("Kullanıcı projeye eklendi! 🚀");
      setIsOpen(false);
      formRef.current?.reset();
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors bg-white"
        title="Üye Ekle"
      >
        <Icon icon="heroicons:plus" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900">Projeye Üye Ekle</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icon icon="heroicons:x-mark" className="text-xl" />
              </button>
            </div>

            {availableMembers.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-300">
                  <Icon icon="heroicons:users" className="text-2xl" />
                </div>
                <p className="text-sm text-slate-500">
                  Takımınızdaki herkes zaten bu projede.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Önce "Takım Üyeleri" sayfasından takıma yeni kişi davet edin.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-4 text-blue-600 text-sm font-bold hover:underline"
                >
                  Kapat
                </button>
              </div>
            ) : (
              <form ref={formRef} action={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">
                    Kişi Seçin
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-100 rounded-xl p-1">
                    {availableMembers.map((member) => (
                      <label
                        key={member.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors has-[:checked]:bg-blue-50 has-[:checked]:border-blue-200 border border-transparent"
                      >
                        <input
                          type="radio"
                          name="userId"
                          value={member.id}
                          className="sr-only"
                          required
                        />

                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {member.avatar_url ? (
                            <Image
                              src={member.avatar_url}
                              alt=""
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-slate-500">
                              {(
                                member.full_name?.[0] ||
                                member.email?.[0] ||
                                "?"
                              ).toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {member.full_name || "İsimsiz"}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {member.email}
                          </p>
                        </div>

                        <Icon
                          icon="heroicons:check-circle"
                          className="text-blue-600 text-xl opacity-0 peer-checked:opacity-100 hidden peer-checked:block"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Rol
                  </label>
                  <select
                    name="role"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                  >
                    <option value="contributor">Katılımcı (Contributor)</option>
                    <option value="manager">Yönetici (Manager)</option>
                    <option value="viewer">İzleyici (Viewer)</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Icon icon="svg-spinners:180-ring" />
                    ) : (
                      <Icon icon="heroicons:plus" />
                    )}
                    Projeye Ekle
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
