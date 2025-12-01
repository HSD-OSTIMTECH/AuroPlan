import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

import ProjectHeader from "@/components/projects/ProjectHeader";
import MilestonesList from "@/components/projects/MilestonesList";
import ProjectUpdates from "@/components/projects/ProjectUpdates";
import NewMilestoneModal from "@/components/projects/NewMilestoneModal";
import NewUpdateModal from "@/components/projects/NewUpdateModal";
import UploadDocumentModal from "@/components/projects/UploadDocumentModal";
import DocumentsList from "@/components/projects/DocumentsList";
import AddMemberModal from "@/components/projects/AddMemberModal";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // DEĞİŞİKLİK 2: params'ı await ediyoruz
  const { id } = await params;

  // 1. Proje Detaylarını Çek
  const { data: project, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      teams ( name, slug ),
      project_milestones ( id, title, status, due_date, order_index ),
      project_members ( id, role, user_id, profiles ( id, full_name, avatar_url ) ),
      project_updates ( id, title, created_at, author_id, profiles(full_name, avatar_url) ),
      project_documents ( id, file_name, file_type, file_size, storage_path, created_at )
    `
    )
    .eq("id", id) // DEĞİŞİKLİK 3: params.id yerine id değişkeni kullanıldı
    .single();

  if (error || !project) {
    notFound();
  }

  const { data: allTeamMembers } = await supabase
    .from("team_members")
    .select("user_id, profiles(id, full_name, email, avatar_url)")
    .eq("team_id", project.team_id);

  const existingUserIds = new Set(
    project.project_members.map((m: any) => m.user_id)
  );

  const availableMembers =
    allTeamMembers
      ?.filter((tm: any) => !existingUserIds.has(tm.user_id))
      .map((tm: any) => tm.profiles) // Sadece profil objesini al
      .filter(Boolean) || []; // null profilleri temizle

  const documents =
    project.project_documents?.sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ) || [];

  // Veriyi düzenle
  const milestones = project.project_milestones.sort(
    (a, b) => a.order_index - b.order_index
  );
  const updates = project.project_updates.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const members = project.project_members;

  // İlerleme hesabı
  const completedMilestones = milestones.filter(
    (m) => m.status === "done"
  ).length;
  const progress =
    milestones.length > 0
      ? Math.round((completedMilestones / milestones.length) * 100)
      : 0;

  return (
    <div className="space-y-8 pb-20">
      {/* --- Breadcrumb --- */}
      <nav className="flex items-center text-sm text-slate-500 mb-4">
        <Link
          href="/dashboard/projects"
          className="hover:text-slate-900 transition-colors"
        >
          Projeler
        </Link>
        <Icon icon="heroicons:chevron-right" className="mx-2 text-xs" />
        <span className="font-semibold text-slate-900 truncate max-w-[200px]">
          {project.name}
        </span>
      </nav>

      {/* --- Header --- */}
      <ProjectHeader project={project} progress={progress} />

      {/* --- Main Content Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SOL KOLON (Ana Akış) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Kilometre Taşları */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Icon icon="heroicons:map" className="text-blue-500" />
                Yol Haritası (Milestones)
              </h3>
              {/* Yeni Modal Bileşeni Buraya Geliyor */}
              <NewMilestoneModal projectId={project.id} />
            </div>
            <div className="p-6">
              <MilestonesList milestones={milestones} projectId={project.id} />
            </div>
          </div>

          {/* Dosyalar / Dokümanlar (Placeholder) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Icon
                  icon="heroicons:document-text"
                  className="text-amber-500"
                />
                Dokümanlar
              </h3>

              {/* Yükleme Butonu Bileşeni */}
              <UploadDocumentModal projectId={project.id} />
            </div>

            {/* Liste Bileşeni */}
            <DocumentsList documents={documents} projectId={project.id} />
          </div>
        </div>

        {/* SAĞ KOLON (Yan Bilgiler) */}
        <div className="space-y-8">
          {/* Proje Ekibi */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm">
              Proje Ekibi
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {members.map((member: any) => (
                <div key={member.id} className="relative group">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
                    {member.profiles?.avatar_url ? (
                      <Image
                        src={member.profiles.avatar_url}
                        alt=""
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-bold">
                        {member.profiles?.full_name?.[0] || "?"}
                      </div>
                    )}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {member.profiles?.full_name}
                  </div>
                </div>
              ))}
              <AddMemberModal
                projectId={project.id}
                availableMembers={availableMembers}
              />
            </div>
          </div>

          {/* Güncellemeler (Feed) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">
                Son Güncellemeler
              </h3>

              {/* YENİ MODAL BURAYA EKLENDİ */}
              <NewUpdateModal projectId={project.id} />
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              <ProjectUpdates updates={updates} projectId={project.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
