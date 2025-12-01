"use client";

import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import {
  updateProfile,
  uploadAvatar,
} from "@/app/(dashboard)/dashboard/profile/actions";
import toast from "react-hot-toast";

type Profile = {
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
};

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- BİLGİ GÜNCELLEME ---
  const handleUpdate = async (formData: FormData) => {
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success("Profil güncellendi! ✅");
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // --- AVATAR DEĞİŞTİRME ---
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Dosya boyutu 2MB'dan küçük olmalıdır.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await uploadAvatar(formData);
      toast.success("Profil resmi yenilendi! 📸");
    } catch (error) {
      toast.error("Resim yüklenemedi.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* --- AVATAR BÖLÜMÜ --- */}
      <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col items-center text-center">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md overflow-hidden relative">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                <Icon icon="heroicons:user" className="text-4xl" />
              </div>
            )}

            {/* Yükleme Overlay */}
            <div
              className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <Icon
                  icon="svg-spinners:180-ring"
                  className="text-white text-2xl"
                />
              ) : (
                <Icon icon="heroicons:camera" className="text-white text-2xl" />
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 text-xs font-bold text-blue-600 hover:underline"
            disabled={uploading}
          >
            Fotoğrafı Değiştir
          </button>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </div>
        <p className="text-slate-500 text-xs mt-2">
          JPG, GIF veya PNG. Maksimum 2MB.
        </p>
      </div>

      {/* --- FORM BÖLÜMÜ --- */}
      <div className="p-8">
        <form action={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Ad Soyad
              </label>
              <div className="relative">
                <Icon
                  icon="heroicons:user"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="fullName"
                  defaultValue={profile.full_name || ""}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                  placeholder="Adınız Soyadınız"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                E-posta
              </label>
              <div className="relative opacity-60 cursor-not-allowed">
                <Icon
                  icon="heroicons:envelope"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  disabled
                  defaultValue={profile.email || ""}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Web Sitesi
            </label>
            <div className="relative">
              <Icon
                icon="heroicons:link"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                name="website"
                defaultValue={profile.website || ""}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Biyografi
            </label>
            <textarea
              name="bio"
              rows={4}
              defaultValue={profile.bio || ""}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm resize-none"
              placeholder="Kendinizden kısaca bahsedin..."
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Icon icon="svg-spinners:180-ring" />
              ) : (
                <Icon icon="heroicons:check" />
              )}
              Değişiklikleri Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
