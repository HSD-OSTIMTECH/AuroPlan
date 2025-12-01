"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// --- PROFİL BİLGİLERİNİ GÜNCELLE ---
export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum açmanız gerekiyor.");

  const fullName = formData.get("fullName") as string;
  const bio = formData.get("bio") as string;
  const website = formData.get("website") as string;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      bio: bio,
      website: website,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("Profile Update Error:", error);
    throw new Error("Profil güncellenemedi.");
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard"); // Header'daki avatar/isim için
}

// --- AVATAR YÜKLEME ---
export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Oturum açmanız gerekiyor.");

  const file = formData.get("avatar") as File;
  if (!file) throw new Error("Dosya seçilmedi.");

  // 1. Dosya ismini hazırla (Kullanıcı ID'si ile benzersiz yapalım)
  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  // 2. Storage'a Yükle ('avatars' bucket'ı daha önce SQL ile oluşturulmuştu)
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error("Avatar Upload Error:", uploadError);
    throw new Error("Resim yüklenemedi.");
  }

  // 3. Public URL al
  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  // 4. Profil tablosunu güncelle
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  if (updateError) {
    throw new Error("Profil resmi güncellenemedi.");
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
}
