"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Yardımcı Fonksiyon: URL dostu slug oluşturur
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// --- PROJE OLUŞTURMA (YENİ) ---

export async function createProject(formData: FormData) {
  const supabase = await createClient();

  // 1. Kullanıcı Kontrolü
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Form Verilerini Al ve Temizle
  const teamId = (formData.get("teamId") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const status = (formData.get("status") as string) || "planning";
  const priority = (formData.get("priority") as string) || "medium";
  const objective = (formData.get("objective") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const startDate = (formData.get("startDate") as string) || null;
  const dueDate = (formData.get("dueDate") as string) || null;
  const coverImageUrl = (formData.get("coverImageUrl") as string)?.trim();

  // 3. Validasyon
  if (!teamId || !name) {
    throw new Error("Proje adı ve takım seçimi zorunludur.");
  }

  // 4. Benzersiz Slug Oluşturma
  const slugBase = slugify(name);
  const slug = `${slugBase}-${Date.now().toString(36).slice(-4)}`;

  // 5. Veritabanına Kayıt
  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      name,
      team_id: teamId,
      owner_id: user.id,
      slug,
      status,
      priority,
      objective: objective || null,
      description: description || null,
      start_date: startDate, // Boşsa null gider
      due_date: dueDate, // Boşsa null gider
      cover_image_url: coverImageUrl || null,
    })
    .select()
    .single();

  if (error || !project) {
    console.error("Create Project Error:", error);
    throw new Error("Proje oluşturulamadı. Lütfen tekrar deneyin.");
  }

  // NOT: Manuel olarak project_members'a ekleme yapmıyoruz.
  // Veritabanındaki 'handle_new_project' trigger'ı bunu otomatik yapıyor.

  // 6. Yönlendirme ve Yenileme
  revalidatePath("/dashboard/projects");
  // İsterseniz direkt yeni proje sayfasına yönlendirebilirsiniz:
  // redirect(`/dashboard/projects/${project.id}`);
}

// --- MILESTONE (KİLOMETRE TAŞI) İŞLEMLERİ (MEVCUT) ---

export async function createMilestone(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum açmanız gerekiyor.");

  const title = formData.get("title") as string;
  const dueDate = formData.get("dueDate") as string;
  const projectId = formData.get("projectId") as string;

  if (!title || !projectId) {
    throw new Error("Başlık zorunludur.");
  }

  const { error } = await supabase.from("project_milestones").insert({
    project_id: projectId,
    title,
    due_date: dueDate || null,
    status: "planned",
    order_index: 0,
  });

  if (error) {
    console.error("Milestone Error:", error);
    throw new Error("Kilometre taşı oluşturulamadı.");
  }

  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function toggleMilestoneStatus(
  milestoneId: string,
  currentStatus: string,
  projectId: string
) {
  const supabase = await createClient();

  const newStatus = currentStatus === "done" ? "planned" : "done";

  const { error } = await supabase
    .from("project_milestones")
    .update({ status: newStatus })
    .eq("id", milestoneId);

  if (error) throw new Error("Durum güncellenemedi.");

  revalidatePath(`/dashboard/projects/${projectId}`);
}

// --- GÜNCELLEME (UPDATE) İŞLEMLERİ (MEVCUT) ---

export async function createUpdate(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Oturum açmanız gerekiyor.");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string; // Body
  const projectId = formData.get("projectId") as string;
  const type = (formData.get("type") as string) || "note";

  const { error } = await supabase.from("project_updates").insert({
    project_id: projectId,
    author_id: user.id,
    title,
    body: description,
    update_type: type,
  });

  if (error) {
    console.error("Update Error:", error);
    throw new Error("Güncelleme paylaşılamadı.");
  }

  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function uploadProjectFile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum açmanız gerekiyor.");

  const file = formData.get("file") as File;
  const projectId = formData.get("projectId") as string;

  if (!file || !projectId) throw new Error("Dosya seçilmedi.");

  // 1. Dosya ismini temizle ve benzersiz yap
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}_${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`;
  const filePath = `${projectId}/${fileName}`; // Dosyaları proje klasörlerinde tutalım

  // 2. Storage'a Yükle
  const { error: uploadError } = await supabase.storage
    .from("project-files")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Storage Upload Error:", uploadError);
    throw new Error("Dosya yüklenemedi.");
  }

  // 3. Veritabanına Kaydet (project_documents)
  const { error: dbError } = await supabase.from("project_documents").insert({
    project_id: projectId,
    uploader_id: user.id,
    file_name: file.name, // Orijinal isim
    storage_path: filePath,
    file_type: fileExt,
    file_size: file.size,
  });

  if (dbError) {
    console.error("DB Document Error:", dbError);
    throw new Error("Dosya kaydı oluşturulamadı.");
  }

  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function deleteProjectFile(
  documentId: string,
  storagePath: string,
  projectId: string
) {
  const supabase = await createClient();

  // 1. Storage'dan Sil
  const { error: storageError } = await supabase.storage
    .from("project-files")
    .remove([storagePath]);

  if (storageError) {
    console.error("Storage Delete Error:", storageError);
    // Storage'dan silinemese bile veritabanından silmeyi deneyebiliriz veya hata dönebiliriz.
  }

  // 2. Veritabanından Sil
  const { error: dbError } = await supabase
    .from("project_documents")
    .delete()
    .eq("id", documentId);

  if (dbError) throw new Error("Dosya kaydı silinemedi.");

  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function addProjectMember(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum açmanız gerekiyor.");

  const projectId = formData.get("projectId") as string;
  const userId = formData.get("userId") as string;
  const role = formData.get("role") as string || 'contributor';

  if (!projectId || !userId) {
    throw new Error("Kullanıcı ve proje seçimi zorunludur.");
  }

  // 1. Bu kullanıcı zaten projede mi?
  const { data: existing } = await supabase
    .from("project_members")
    .select("id")
    .eq("project_id", projectId)
    .eq("user_id", userId)
    .single();

  if (existing) {
    throw new Error("Bu kullanıcı zaten projeye ekli.");
  }

  // 2. Ekleme İşlemi
  const { error } = await supabase
    .from("project_members")
    .insert({
      project_id: projectId,
      user_id: userId,
      role: role
    });

  if (error) {
    console.error("Add Member Error:", error);
    throw new Error("Üye projeye eklenemedi.");
  }

  revalidatePath(`/dashboard/projects/${projectId}`);
}