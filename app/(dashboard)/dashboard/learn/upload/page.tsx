import { createClient } from "@/utils/supabase/server";
import UploadForm from "@/components/learn/UploadForm";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UploadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Kullanıcının "owner" veya "admin" olduğu takımları çek
  const { data: memberships } = await supabase
    .from("team_members")
    .select("team_id, role, teams(id, name)")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"]);

  // Takım verilerini düzleştir
  const myTeams = memberships?.map((m: any) => m.teams) || [];

  if (myTeams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
          <Icon
            icon="heroicons:lock-closed"
            className="text-4xl text-slate-400"
          />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Yetkiniz Yok</h2>
        <p className="text-slate-500 max-w-md">
          İçerik yüklemek için en az bir takımın yöneticisi olmalısınız.
        </p>
        <Link
          href="/dashboard/teams"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          Takım Oluştur
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <Link
          href="/dashboard/learn"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <Icon icon="heroicons:arrow-left" />
          Öğrenme Merkezine Dön
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Yeni Eğitim Materyali
        </h1>
        <p className="text-slate-500">
          Takımınızın gelişimi için PDF veya Markdown dosyaları yükleyin.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
        <UploadForm teams={myTeams} />
      </div>
    </div>
  );
}
