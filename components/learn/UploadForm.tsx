"use client";

import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { uploadLearningMaterial } from "../../app/(dashboard)/dashboard/learn/upload/actions";
import toast from "react-hot-toast";

type Team = {
  id: string;
  name: string;
};

export default function UploadForm({ teams }: { teams: Team[] }) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".pdf") && !file.name.endsWith(".md")) {
        toast.error(
          "Sadece PDF veya Markdown (.md) dosyaları yükleyebilirsiniz."
        );
        e.target.value = "";
        setFileName(null);
        return;
      }
      setFileName(file.name);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsUploading(true);
    try {
      await uploadLearningMaterial(formData);
      toast.success("İçerik başarıyla yayınlandı!");
      formRef.current?.reset();
      setFileName(null);
    } catch (error) {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      console.error(error);
      setIsUploading(false); // Sadece hata durumunda loading'i kapat, başarılıysa redirect olacak
    }
  };

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto"
    >
      {/* Başlık ve Kategori */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">
            İçerik Başlığı
          </label>
          <input
            name="title"
            required
            placeholder="Örn: React Best Practices"
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Kategori</label>
          <div className="relative">
            <select
              name="category"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none"
            >
              <option value="Productivity">Verimlilik</option>
              <option value="Communication">İletişim</option>
              <option value="Management">Yönetim</option>
              <option value="Strategy">Strateji</option>
              <option value="Soft Skills">Kişisel Gelişim</option>
              <option value="Technical">Teknik</option>
            </select>
            <Icon
              icon="heroicons:chevron-down"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Takım ve XP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">
            Hangi Takım İçin?
          </label>
          <div className="relative">
            <select
              name="teamId"
              required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none"
            >
              <option value="" disabled selected>
                Takım Seçin...
              </option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <Icon
              icon="heroicons:users"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">XP Değeri</label>
          <input
            name="xp"
            type="number"
            defaultValue={50}
            min={10}
            max={500}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
        </div>
      </div>

      {/* Dosya Yükleme Alanı */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700">
          Materyal Yükle (PDF veya Markdown)
        </label>
        <div className="relative group">
          <input
            type="file"
            name="file"
            accept=".pdf,.md"
            required
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div
            className={`
            border-2 border-dashed rounded-2xl p-8 text-center transition-all
            ${
              fileName
                ? "border-green-300 bg-green-50"
                : "border-slate-300 bg-slate-50 group-hover:border-blue-400 group-hover:bg-blue-50"
            }
          `}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  fileName
                    ? "bg-green-100 text-green-600"
                    : "bg-white text-slate-400 shadow-sm"
                }`}
              >
                <Icon
                  icon={
                    fileName ? "heroicons:check" : "heroicons:cloud-arrow-up"
                  }
                  className="text-2xl"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">
                  {fileName || "Dosyayı buraya sürükleyin veya tıklayın"}
                </p>
                {!fileName && (
                  <p className="text-xs text-slate-400 mt-1">
                    PDF veya .md dosyaları (Maks. 10MB)
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isUploading}
          className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <Icon icon="svg-spinners:180-ring" className="text-xl" />
              Yükleniyor...
            </>
          ) : (
            <>
              <Icon icon="heroicons:paper-airplane" className="text-xl" />
              İçeriği Yayınla
            </>
          )}
        </button>
      </div>
    </form>
  );
}
