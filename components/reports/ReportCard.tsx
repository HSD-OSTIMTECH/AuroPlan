"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import {
  deleteReport,
  getReportDownloadUrl,
} from "@/app/(dashboard)/dashboard/reports/actions";
import toast from "react-hot-toast";

interface ReportCardProps {
  report: {
    id: string;
    title: string;
    description: string | null;
    file_name: string;
    file_type: string;
    file_size: number;
    report_period: string | null;
    tags: string[];
    created_at: string;
    uploaded_by: string;
    profiles?: {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
    } | null;
    teams?: {
      id: string;
      name: string;
    } | null;
    projects?: {
      id: string;
      name: string;
    } | null;
  };
  currentUserId: string;
  showUploader?: boolean;
  showEntity?: boolean;
  onDelete?: () => void;
}

// Dosya türüne göre ikon
function getFileIcon(fileType: string) {
  switch (fileType.toLowerCase()) {
    case "pdf":
      return "heroicons:document-text";
    case "xlsx":
    case "xls":
      return "heroicons:table-cells";
    case "docx":
    case "doc":
      return "heroicons:document";
    case "csv":
      return "heroicons:table-cells";
    case "png":
    case "jpg":
    case "jpeg":
      return "heroicons:photo";
    default:
      return "heroicons:paper-clip";
  }
}

// Dosya türüne göre renk
function getFileColor(fileType: string) {
  switch (fileType.toLowerCase()) {
    case "pdf":
      return "text-red-500 bg-red-50";
    case "xlsx":
    case "xls":
      return "text-green-500 bg-green-50";
    case "docx":
    case "doc":
      return "text-blue-500 bg-blue-50";
    case "csv":
      return "text-emerald-500 bg-emerald-50";
    case "png":
    case "jpg":
    case "jpeg":
      return "text-purple-500 bg-purple-50";
    default:
      return "text-slate-500 bg-slate-50";
  }
}

// Dosya boyutunu formatla
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function ReportCard({
  report,
  currentUserId,
  showUploader = true,
  showEntity = false,
  onDelete,
}: ReportCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = report.uploaded_by === currentUserId;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const { url, error } = await getReportDownloadUrl(report.id);
      if (error) {
        toast.error(error);
        return;
      }
      if (url) {
        // Yeni sekmede aç
        window.open(url, "_blank");
      }
    } catch {
      toast.error("İndirme başlatılamadı");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu raporu silmek istediğinizden emin misiniz?")) return;

    setIsDeleting(true);
    try {
      const { success, error } = await deleteReport(report.id);
      if (error) {
        toast.error(error);
        return;
      }
      if (success) {
        toast.success("Rapor silindi");
        onDelete?.();
      }
    } catch {
      toast.error("Rapor silinemedi");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all group">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Dosya İkonu */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getFileColor(
              report.file_type
            )}`}
          >
            <Icon icon={getFileIcon(report.file_type)} className="text-2xl" />
          </div>

          {/* Bilgiler */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
              {report.title}
            </h3>
            {report.description && (
              <p className="text-sm text-slate-500 line-clamp-2 mt-0.5">
                {report.description}
              </p>
            )}

            {/* Meta Bilgiler */}
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-400">
              <span className="uppercase font-medium text-slate-500">
                {report.file_type}
              </span>
              <span>•</span>
              <span>{formatFileSize(report.file_size)}</span>
              {report.report_period && (
                <>
                  <span>•</span>
                  <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    {report.report_period}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Aksiyonlar */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="İndir / Görüntüle"
            >
              {isDownloading ? (
                <Icon
                  icon="heroicons:arrow-path"
                  className="text-lg animate-spin"
                />
              ) : (
                <Icon icon="heroicons:arrow-down-tray" className="text-lg" />
              )}
            </button>
            {isOwner && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Sil"
              >
                {isDeleting ? (
                  <Icon
                    icon="heroicons:arrow-path"
                    className="text-lg animate-spin"
                  />
                ) : (
                  <Icon icon="heroicons:trash" className="text-lg" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Tags */}
        {report.tags && report.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {report.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          {/* Yükleyen */}
          {showUploader && report.profiles && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600 overflow-hidden">
                {report.profiles.avatar_url ? (
                  <img
                    src={report.profiles.avatar_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  report.profiles.full_name?.charAt(0) || "?"
                )}
              </div>
              <span className="text-xs text-slate-500">
                {report.profiles.full_name || "İsimsiz"}
              </span>
            </div>
          )}

          {/* Entity (Takım/Proje) */}
          {showEntity && (report.teams || report.projects) && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Icon
                icon={
                  report.teams ? "heroicons:user-group" : "heroicons:folder"
                }
                className="text-sm"
              />
              <span>{report.teams?.name || report.projects?.name}</span>
            </div>
          )}

          {/* Tarih */}
          <span className="text-xs text-slate-400 ml-auto">
            {new Date(report.created_at).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
