"use client";

import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { uploadProjectFile } from "@/app/(dashboard)/dashboard/projects/actions";
import toast from "react-hot-toast";

export default function UploadDocumentModal({
  projectId,
}: {
  projectId: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Boyut kontrolü (örn: 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dosya boyutu 5MB'dan küçük olmalıdır.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId);

    try {
      await uploadProjectFile(formData);
      toast.success("Dosya yüklendi! 📂");
    } catch (error) {
      toast.error("Yükleme başarısız.");
      console.error(error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Inputu temizle
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className={`cursor-pointer text-slate-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50 ${
          isUploading ? "opacity-50 pointer-events-none" : ""
        }`}
        title="Dosya Yükle"
      >
        {isUploading ? (
          <Icon icon="svg-spinners:180-ring" className="text-xl" />
        ) : (
          <Icon icon="heroicons:plus" className="text-xl" />
        )}
      </label>
    </>
  );
}
