"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// --- RAPOR TÜRLERİ ---
export type ReportScope = "personal" | "team" | "project";

// --- KİŞİSEL RAPORLARI GETİR ---
export async function getPersonalReports() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { reports: [], error: "Oturum bulunamadı" };

  const { data: reports, error } = await supabase
    .from("reports")
    .select("*")
    .eq("scope", "personal")
    .eq("uploaded_by", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Kişisel raporlar getirilemedi:", error);
    return { reports: [], error: error.message };
  }

  return { reports: reports || [], error: null };
}

// --- TAKIM RAPORLARINI GETİR ---
export async function getTeamReports(teamId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return { reports: [], error: "Oturum bulunamadı", canUpload: false };

  // Kullanıcının takımda olup olmadığını ve rolünü kontrol et
  const { data: membership } = await supabase
    .from("team_members")
    .select("role")
    .eq("team_id", teamId)
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return {
      reports: [],
      error: "Bu takıma erişim yetkiniz yok",
      canUpload: false,
    };
  }

  const canUpload = ["owner", "admin"].includes(membership.role);

  const { data: reports, error } = await supabase
    .from("reports")
    .select(
      `
      *,
      profiles:uploaded_by(id, full_name, avatar_url)
    `
    )
    .eq("scope", "team")
    .eq("team_id", teamId)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Takım raporları getirilemedi:", error);
    return { reports: [], error: error.message, canUpload };
  }

  return { reports: reports || [], error: null, canUpload };
}

// --- PROJE RAPORLARINI GETİR ---
export async function getProjectReports(projectId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return { reports: [], error: "Oturum bulunamadı", canUpload: false };

  // Kullanıcının projede olup olmadığını ve rolünü kontrol et
  const { data: membership } = await supabase
    .from("project_members")
    .select("role")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return {
      reports: [],
      error: "Bu projeye erişim yetkiniz yok",
      canUpload: false,
    };
  }

  const canUpload = ["owner", "manager"].includes(membership.role);

  const { data: reports, error } = await supabase
    .from("reports")
    .select(
      `
      *,
      profiles:uploaded_by(id, full_name, avatar_url)
    `
    )
    .eq("scope", "project")
    .eq("project_id", projectId)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Proje raporları getirilemedi:", error);
    return { reports: [], error: error.message, canUpload };
  }

  return { reports: reports || [], error: null, canUpload };
}

// --- TÜM RAPORLARI GETİR (Dashboard için) ---
export async function getAllReports() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { personal: [], team: [], project: [] };

  // Kişisel raporlar
  const { data: personalReports } = await supabase
    .from("reports")
    .select("*")
    .eq("scope", "personal")
    .eq("uploaded_by", user.id)
    .order("created_at", { ascending: false });

  // Kullanıcının takımları
  const { data: teamMemberships } = await supabase
    .from("team_members")
    .select("team_id, role")
    .eq("user_id", user.id);

  const teamIds = teamMemberships?.map((m) => m.team_id) || [];

  // Takım raporları
  let teamReports: any[] = [];
  if (teamIds.length > 0) {
    const { data } = await supabase
      .from("reports")
      .select(
        `
        *,
        profiles:uploaded_by(id, full_name, avatar_url),
        teams:team_id(id, name)
      `
      )
      .eq("scope", "team")
      .in("team_id", teamIds)
      .eq("is_public", true)
      .order("created_at", { ascending: false });
    teamReports = data || [];
  }

  // Kullanıcının projeleri
  const { data: projectMemberships } = await supabase
    .from("project_members")
    .select("project_id, role")
    .eq("user_id", user.id);

  const projectIds = projectMemberships?.map((m) => m.project_id) || [];

  // Proje raporları
  let projectReports: any[] = [];
  if (projectIds.length > 0) {
    const { data } = await supabase
      .from("reports")
      .select(
        `
        *,
        profiles:uploaded_by(id, full_name, avatar_url),
        projects:project_id(id, name)
      `
      )
      .eq("scope", "project")
      .in("project_id", projectIds)
      .eq("is_public", true)
      .order("created_at", { ascending: false });
    projectReports = data || [];
  }

  return {
    personal: personalReports || [],
    team: teamReports,
    project: projectReports,
  };
}

// --- RAPOR YÜKLE ---
export async function uploadReport(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Oturum bulunamadı" };

  const scope = formData.get("scope") as ReportScope;
  const teamId = formData.get("teamId") as string | null;
  const projectId = formData.get("projectId") as string | null;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const reportPeriod = formData.get("reportPeriod") as string;
  const tagsString = formData.get("tags") as string;
  const file = formData.get("file") as File;

  if (!title || !file) {
    return { success: false, error: "Başlık ve dosya gerekli" };
  }

  // Yetki kontrolü
  if (scope === "team" && teamId) {
    const { data: membership } = await supabase
      .from("team_members")
      .select("role")
      .eq("team_id", teamId)
      .eq("user_id", user.id)
      .single();

    if (!membership || !["owner", "admin"].includes(membership.role)) {
      return { success: false, error: "Takım raporu yükleme yetkiniz yok" };
    }
  }

  if (scope === "project" && projectId) {
    const { data: membership } = await supabase
      .from("project_members")
      .select("role")
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .single();

    if (!membership || !["owner", "manager"].includes(membership.role)) {
      return { success: false, error: "Proje raporu yükleme yetkiniz yok" };
    }
  }

  // Dosya uzantısını al
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "pdf";
  const fileName = `${Date.now()}_${Math.random()
    .toString(36)
    .substring(7)}.${fileExt}`;

  // Storage path: scope/id/filename
  let storagePath = "";
  if (scope === "personal") {
    storagePath = `personal/${user.id}/${fileName}`;
  } else if (scope === "team" && teamId) {
    storagePath = `team/${teamId}/${fileName}`;
  } else if (scope === "project" && projectId) {
    storagePath = `project/${projectId}/${fileName}`;
  }

  // Dosyayı storage'a yükle
  const { error: uploadError } = await supabase.storage
    .from("reports")
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Dosya yükleme hatası:", uploadError);
    return {
      success: false,
      error: "Dosya yüklenemedi: " + uploadError.message,
    };
  }

  // Tags'i array'e çevir
  const tags = tagsString
    ? tagsString
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  // Veritabanına kaydet
  const { error: dbError } = await supabase.from("reports").insert({
    scope,
    team_id: scope === "team" ? teamId : null,
    project_id: scope === "project" ? projectId : null,
    uploaded_by: user.id,
    title,
    description: description || null,
    file_name: file.name,
    file_type: fileExt,
    file_size: file.size,
    storage_path: storagePath,
    report_period: reportPeriod || null,
    tags,
    is_public: true,
  });

  if (dbError) {
    console.error("Veritabanı hatası:", dbError);
    // Yüklenen dosyayı sil
    await supabase.storage.from("reports").remove([storagePath]);
    return { success: false, error: "Rapor kaydedilemedi: " + dbError.message };
  }

  revalidatePath("/dashboard/reports");
  return { success: true, error: null };
}

// --- RAPOR SİL ---
export async function deleteReport(reportId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Oturum bulunamadı" };

  // Raporu getir
  const { data: report, error: fetchError } = await supabase
    .from("reports")
    .select("*")
    .eq("id", reportId)
    .single();

  if (fetchError || !report) {
    return { success: false, error: "Rapor bulunamadı" };
  }

  // Yetki kontrolü - sadece yükleyen silebilir
  if (report.uploaded_by !== user.id) {
    return { success: false, error: "Bu raporu silme yetkiniz yok" };
  }

  // Storage'dan sil
  const { error: storageError } = await supabase.storage
    .from("reports")
    .remove([report.storage_path]);

  if (storageError) {
    console.error("Dosya silme hatası:", storageError);
  }

  // Veritabanından sil
  const { error: dbError } = await supabase
    .from("reports")
    .delete()
    .eq("id", reportId);

  if (dbError) {
    console.error("Rapor silme hatası:", dbError);
    return { success: false, error: "Rapor silinemedi" };
  }

  revalidatePath("/dashboard/reports");
  return { success: true, error: null };
}

// --- RAPOR İNDİR URL'İ AL ---
export async function getReportDownloadUrl(reportId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { url: null, error: "Oturum bulunamadı" };

  // Raporu getir
  const { data: report, error: fetchError } = await supabase
    .from("reports")
    .select("*")
    .eq("id", reportId)
    .single();

  if (fetchError || !report) {
    return { url: null, error: "Rapor bulunamadı" };
  }

  // Yetki kontrolü
  if (report.scope === "personal" && report.uploaded_by !== user.id) {
    return { url: null, error: "Bu rapora erişim yetkiniz yok" };
  }

  if (report.scope === "team" && report.team_id) {
    const { data: membership } = await supabase
      .from("team_members")
      .select("id")
      .eq("team_id", report.team_id)
      .eq("user_id", user.id)
      .single();

    if (!membership) {
      return { url: null, error: "Bu rapora erişim yetkiniz yok" };
    }
  }

  if (report.scope === "project" && report.project_id) {
    const { data: membership } = await supabase
      .from("project_members")
      .select("id")
      .eq("project_id", report.project_id)
      .eq("user_id", user.id)
      .single();

    if (!membership) {
      return { url: null, error: "Bu rapora erişim yetkiniz yok" };
    }
  }

  // Signed URL oluştur (1 saat geçerli)
  const { data: signedUrl, error: signError } = await supabase.storage
    .from("reports")
    .createSignedUrl(report.storage_path, 3600);

  if (signError) {
    console.error("URL oluşturma hatası:", signError);
    return { url: null, error: "İndirme linki oluşturulamadı" };
  }

  return { url: signedUrl.signedUrl, error: null };
}

// --- KULLANICININ YÜKLEYEBİLECEĞİ TAKIMLAR/PROJELER ---
export async function getUploadableEntities() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { teams: [], projects: [] };

  // Kullanıcının owner/admin olduğu takımlar
  const { data: teamMemberships } = await supabase
    .from("team_members")
    .select("team_id, role, teams(id, name)")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"]);

  const teams =
    teamMemberships?.map((m: any) => ({
      id: m.teams.id,
      name: m.teams.name,
      role: m.role,
    })) || [];

  // Kullanıcının owner/manager olduğu projeler
  const { data: projectMemberships } = await supabase
    .from("project_members")
    .select("project_id, role, projects(id, name)")
    .eq("user_id", user.id)
    .in("role", ["owner", "manager"]);

  const projects =
    projectMemberships?.map((m: any) => ({
      id: m.projects.id,
      name: m.projects.name,
      role: m.role,
    })) || [];

  return { teams, projects };
}
