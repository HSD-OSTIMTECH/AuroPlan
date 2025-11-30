import { createClient } from "@/utils/supabase/server";
import LearningCard from "@/components/learn/LearningCard";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default async function LearnPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Profil bilgisini çek (XP için)
  const { data: profile } = await supabase
    .from("profiles")
    .select("total_xp")
    .eq("id", user?.id)
    .single();

  // 2. Kullanıcının üyesi olduğu takımları bul
  const { data: memberships } = await supabase
    .from("team_members")
    .select("team_id");

  const myTeamIds = memberships?.map((m) => m.team_id) || [];

  // 3. İçerikleri Çek (Herkese açık OR Benim Takımım)
  let query = supabase
    .from("micro_learnings")
    .select("*")
    .eq("is_published", true);

  if (myTeamIds.length > 0) {
    // team_id NULL (Herkese açık) VEYA team_id IN (Benim Takımlarım)
    query = query.or(`team_id.is.null,team_id.in.(${myTeamIds.join(",")})`);
  } else {
    query = query.is("team_id", null);
  }

  const { data: learnings } = await query.order("created_at", {
    ascending: false,
  });

  // 4. İlerlemeyi çek
  const { data: progress } = await supabase
    .from("user_progress")
    .select("learning_id")
    .eq("user_id", user?.id);

  const completedIds = new Set(progress?.map((p) => p.learning_id));

  // --- İstatistikler ---
  const currentXP = profile?.total_xp || 0;
  const level = Math.floor(currentXP / 100) + 1;
  const nextLevelXP = level * 100;
  const progressPercent = Math.min(((currentXP % 100) / 100) * 100, 100);

  const totalLearnings = learnings?.length || 0;
  const completedCount = completedIds.size;
  const completionRate =
    totalLearnings > 0
      ? Math.round((completedCount / totalLearnings) * 100)
      : 0;

  // --- İçerik Gruplama ---
  const teamLearnings = learnings?.filter((l) => l.team_id !== null) || [];
  const publicLearnings = learnings?.filter((l) => l.team_id === null) || [];

  return (
    <div className="space-y-10 pb-20">
      {/* --- HEADER & GAMIFICATION CARD --- */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Sol: Karşılama ve Level */}
        <div className="md:col-span-2 bg-gradient-to-r from-primary to-blue-400 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[240px]">
          {/* Dekoratif */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Level {level}
              </span>
              <span className="text-blue-200 text-xs font-medium">
                Gelişim Yolculuğu
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Bilgi Güçtür!</h1>
            <p className="text-blue-100 text-sm max-w-lg leading-relaxed opacity-90">
              Her yeni bilgi, takımına ve sana değer katar. Okuduğun her
              materyal seni bir sonraki seviyeye taşır.
            </p>
          </div>

          <div className="mt-8">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-blue-200">Sonraki Seviye</span>
              <span className="text-amber-400">
                {currentXP} / {nextLevelXP} XP
              </span>
            </div>
            <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Sağ: İstatistik Özeti */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
              <Icon icon="heroicons:check-badge" className="text-2xl" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">
                {completedCount}
              </div>
              <div className="text-xs text-slate-500 font-bold uppercase">
                Tamamlanan
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full"></div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Icon icon="heroicons:chart-pie" className="text-2xl" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">
                %{completionRate}
              </div>
              <div className="text-xs text-slate-500 font-bold uppercase">
                Genel Başarı
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/learn/upload"
            className="mt-auto w-full py-3 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-200 border-dashed"
          >
            <Icon icon="heroicons:plus" />
            İçerik Ekle
          </Link>
        </div>
      </div>

      {/* --- TAKIM İÇERİKLERİ (Varsa Göster) --- */}
      {teamLearnings.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
              <Icon icon="heroicons:users" className="text-lg" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Takımına Özel Materyaller
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamLearnings.map((learning) => (
              <LearningCard
                key={learning.id}
                learning={learning}
                isCompleted={completedIds.has(learning.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* --- GENEL İÇERİKLER --- */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
            <Icon icon="heroicons:globe-alt" className="text-lg" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Genel Gelişim Kataloğu
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicLearnings.map((learning) => (
            <LearningCard
              key={learning.id}
              learning={learning}
              isCompleted={completedIds.has(learning.id)}
            />
          ))}

          {publicLearnings.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <p className="text-slate-500">Henüz genel içerik bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
