"use client";

import { Icon } from "@iconify/react";
import { deleteProjectFile } from "@/app/(dashboard)/dashboard/projects/actions";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DocumentsList({
  documents,
  projectId,
}: {
  documents: any[];
  projectId: string;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (doc: any) => {
    if (!confirm("Bu dosyayı silmek istediğinize emin misiniz?")) return;
    setDeletingId(doc.id);
    try {
      await deleteProjectFile(doc.id, doc.storage_path, projectId);
      toast.success("Dosya silindi.");
    } catch {
      toast.error("Silinemedi.");
    } finally {
      setDeletingId(null);
    }
  };

  // Dosya tipine göre ikon seçici
  const getFileIcon = (type: string = "") => {
    if (type.includes("pdf")) return "heroicons:document-text";
    if (type.match(/(jpg|jpeg|png|gif)/)) return "heroicons:photo";
    if (type.includes("doc")) return "heroicons:document";
    return "heroicons:paper-clip";
  };

  // Storage URL'ini oluştur (Supabase URL yapısına göre)
  const getDownloadUrl = (path: string) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-files/${path}`;
  };

  if (documents.length === 0) {
    return (
      <div className="border-2 border-dashed border-slate-100 rounded-xl p-8 text-center">
        <p className="text-sm text-slate-400">Henüz dosya yüklenmemiş.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="group flex items-center justify-between p-3 bg-slate-50 hover:bg-white border border-transparent hover:border-blue-100 rounded-xl transition-all"
        >
          {/* Dosya Bilgisi & İndirme Linki */}
          <a
            href={getDownloadUrl(doc.storage_path)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-500 shadow-sm">
              <Icon icon={getFileIcon(doc.file_type)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-700 truncate">
                {doc.file_name}
              </p>
              <p className="text-[10px] text-slate-400">
                {(doc.file_size / 1024).toFixed(0)} KB •{" "}
                {new Date(doc.created_at).toLocaleDateString("tr-TR")}
              </p>
            </div>
          </a>

          {/* Silme Butonu */}
          <button
            onClick={() => handleDelete(doc)}
            disabled={deletingId === doc.id}
            className="text-slate-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Dosyayı Sil"
          >
            {deletingId === doc.id ? (
              <Icon icon="svg-spinners:180-ring" />
            ) : (
              <Icon icon="heroicons:trash" />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
