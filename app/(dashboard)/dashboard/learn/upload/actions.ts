"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function uploadLearningMaterial(formData: FormData) {
  const supabase = await createClient();

  // 1. Kullanıcı Kontrolü
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Form Verilerini Al
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  // xp değeri sayıya çevrilirken hata oluşursa varsayılan 10 olsun
  const xp = parseInt(formData.get("xp") as string) || 10;
  const teamId = formData.get("teamId") as string;
  const file = formData.get("file") as File;

  if (!file || !title) {
    throw new Error("Dosya ve başlık zorunludur.");
  }

  // 3. Dosya Türünü Belirle
  // Dosya adında Türkçe karakter varsa temizleyelim (Supabase Storage bazen sorun çıkarabilir)
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "");
  const fileType = file.name.toLowerCase().endsWith(".pdf")
    ? "pdf"
    : "markdown";

  // 4. Dosyayı Storage'a Yükle
  // Dosya yolu: team_id/timestamp_filename
  const filePath = `${teamId}/${Date.now()}_${sanitizedFileName}`;

  const { error: uploadError } = await supabase.storage
    .from("learning-materials")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Upload Error:", uploadError);
    throw new Error("Dosya yüklenemedi.");
  }

  // 5. Public URL Al
  const {
    data: { publicUrl },
  } = supabase.storage.from("learning-materials").getPublicUrl(filePath);

  // 6. Veritabanına Kayıt At
  const { error: dbError } = await supabase.from("micro_learnings").insert({
    title,
    category,
    xp,
    team_id: teamId,
    created_by: user.id,
    content_type: fileType,
    content_url: publicUrl,
    is_published: true,
    content: "Dosya içeriği görüntüleniyor...", // İçerik metni yerine dosya URL'si kullanılacak
  });

  if (dbError) {
    console.error("DB Error:", dbError);
    throw new Error("Veritabanı kaydı oluşturulamadı.");
  }

  revalidatePath("/dashboard/learn");
  redirect("/dashboard/learn");
}
