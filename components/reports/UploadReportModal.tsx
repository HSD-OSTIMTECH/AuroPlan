"use client";

import { Icon } from "@iconify/react";
import { useState, useRef } from "react";
import {
  uploadReport,
  ReportScope,
} from "@/app/(dashboard)/dashboard/reports/actions";
import toast from "react-hot-toast";

interface UploadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: { id: string; name: string; role: string }[];
  projects: { id: string; name: string; role: string }[];
  defaultScope?: ReportScope;
  defaultTeamId?: string;
  defaultProjectId?: string;
}

// İzin verilen dosya türleri
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
  "application/vnd.ms-excel", // xls
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "application/msword", // doc
  "text/csv",
  "image/png",
  "image/jpeg",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function UploadReportModal({
  isOpen,
  onClose,
  teams,
  projects,
  defaultScope = "personal",
  defaultTeamId,
  defaultProjectId,
}: UploadReportModalProps) {
  const [scope, setScope] = useState<ReportScope>(defaultScope);
  const [teamId, setTeamId] = useState(defaultTeamId || teams[0]?.id || "");
  const [projectId, setProjectId] = useState(
    defaultProjectId || projects[0]?.id || ""
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reportPeriod, setReportPeriod] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    // Dosya türü kontrolü
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      toast.error(
        "Desteklenmeyen dosya türü. PDF, Excel, Word, CSV veya resim yükleyin."
      );
      return;
    }

    // Dosya boyutu kontrolü
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("Dosya boyutu 10MB'dan büyük olamaz.");
      return;
    }

    setFile(selectedFile);
    // Başlık boşsa dosya adından oluştur
    if (!title) {
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
      setTitle(nameWithoutExt);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Lütfen bir dosya seçin");
      return;
    }

    if (!title.trim()) {
      toast.error("Lütfen bir başlık girin");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("scope", scope);
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("reportPeriod", reportPeriod.trim());
    formData.append("tags", tags.trim());
    formData.append("file", file);

    if (scope === "team") {
      formData.append("teamId", teamId);
    } else if (scope === "project") {
      formData.append("projectId", projectId);
    }

    try {
      const { success, error } = await uploadReport(formData);

      if (error) {
        toast.error(error);
        return;
      }

      if (success) {
        toast.success("Rapor başarıyla yüklendi!");
        onClose();
        // Reset form
        setTitle("");
        setDescription("");
        setReportPeriod("");
        setTags("");
        setFile(null);
      }
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Rapor Yükle</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Icon icon="heroicons:x-mark" className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Kapsam Seçimi */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Rapor Kapsamı
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setScope("personal")}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  scope === "personal"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <Icon icon="heroicons:user" className="text-xl mx-auto mb-1" />
                <span className="text-xs font-medium">Bireysel</span>
              </button>
              <button
                type="button"
                onClick={() => setScope("team")}
                disabled={teams.length === 0}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  scope === "team"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                } ${teams.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Icon
                  icon="heroicons:user-group"
                  className="text-xl mx-auto mb-1"
                />
                <span className="text-xs font-medium">Takım</span>
              </button>
              <button
                type="button"
                onClick={() => setScope("project")}
                disabled={projects.length === 0}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  scope === "project"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                } ${
                  projects.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Icon
                  icon="heroicons:folder"
                  className="text-xl mx-auto mb-1"
                />
                <span className="text-xs font-medium">Proje</span>
              </button>
            </div>
          </div>

          {/* Takım Seçimi */}
          {scope === "team" && teams.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Takım
              </label>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Proje Seçimi */}
          {scope === "project" && projects.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Proje
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Dosya Yükleme */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Dosya
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : file
                  ? "border-green-300 bg-green-50"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.xlsx,.xls,.docx,.doc,.csv,.png,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                className="hidden"
              />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <Icon
                    icon="heroicons:document-check"
                    className="text-3xl text-green-500"
                  />
                  <div className="text-left">
                    <p className="font-medium text-slate-900">{file.name}</p>
                    <p className="text-sm text-slate-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Icon
                    icon="heroicons:cloud-arrow-up"
                    className="text-4xl text-slate-300 mx-auto mb-2"
                  />
                  <p className="text-sm text-slate-500">
                    Dosyayı sürükleyin veya{" "}
                    <span className="text-blue-600 font-medium">
                      seçmek için tıklayın
                    </span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    PDF, Excel, Word, CSV, PNG, JPG (max 10MB)
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Başlık */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Rapor Başlığı
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Q4 2025 Performans Raporu"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Açıklama <span className="text-slate-400">(opsiyonel)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Rapor hakkında kısa açıklama..."
              rows={2}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Dönem ve Etiketler */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Dönem <span className="text-slate-400">(opsiyonel)</span>
              </label>
              <input
                type="text"
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                placeholder="Örn: 2025-Q4"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Etiketler <span className="text-slate-400">(virgülle)</span>
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="finansal, aylık"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isUploading || !file}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Icon icon="heroicons:arrow-path" className="animate-spin" />
                  Yükleniyor...
                </>
              ) : (
                <>
                  <Icon icon="heroicons:arrow-up-tray" />
                  Yükle
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
