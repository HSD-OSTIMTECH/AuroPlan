import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Icon } from "@iconify/react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import CompleteButton from "./CompleteButton"; // Birazdan oluşturacağız

export default async function LearningDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // İçeriği çek
  const { data: learning, error } = await supabase
    .from("micro_learnings")
    .select("*, teams(name)")
    .eq("id", params.id)
    .single();

  if (error || !learning) notFound();

  // Kullanıcı bu içeriği daha önce tamamlamış mı?
  const { data: progress } = await supabase
    .from("user_progress")
    .select("id")
    .eq("user_id", user?.id)
    .eq("learning_id", params.id)
    .single();

  const isCompleted = !!progress;

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* --- Header --- */}
      <div className="mb-8">
        <Link
          href="/dashboard/learn"
          className="text-slate-500 hover:text-blue-600 flex items-center gap-2 text-sm mb-4 transition-colors"
        >
          <Icon icon="heroicons:arrow-left" />
          Öğrenme Merkezine Dön
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {learning.team_id && (
                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded font-bold">
                  {learning.teams?.name} Takımına Özel
                </span>
              )}
              <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded font-bold uppercase">
                {learning.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              {learning.title}
            </h1>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-amber-500 font-extrabold text-2xl flex items-center gap-1">
              <Icon icon="heroicons:bolt" />
              {learning.xp} XP
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Tamamlanınca Kazanılacak
            </span>
          </div>
        </div>
      </div>

      {/* --- İçerik Alanı --- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        {/* Duruma Göre Render */}
        {learning.content_type === "pdf" && learning.content_url ? (
          // PDF Görüntüleyici (Iframe)
          <iframe
            src={learning.content_url}
            className="w-full h-[800px]"
            title="PDF Document"
          />
        ) : learning.content_type === "markdown" || learning.content_url ? (
          // Markdown / Text İçerik
          <div className="p-8 md:p-12 prose prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600">
            {/* Eğer URL varsa fetch edilip gösterilebilir, şimdilik 'content' kolonu markdown kabul ediliyor */}
            <ReactMarkdown>
              {learning.content || "İçerik yüklenemedi."}
            </ReactMarkdown>
          </div>
        ) : (
          // Düz Metin
          <div className="p-8 md:p-12 text-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
            {learning.content}
          </div>
        )}
      </div>

      {/* --- Alt Kısım: Aksiyon --- */}
      <div className="mt-8 flex justify-center pb-20">
        <CompleteButton
          learningId={learning.id}
          xp={learning.xp}
          isCompleted={isCompleted}
        />
      </div>
    </div>
  );
}
