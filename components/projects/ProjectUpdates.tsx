import { Icon } from "@iconify/react";
import Image from "next/image";

export default function ProjectUpdates({
  updates,
  projectId,
}: {
  updates: any[];
  projectId: string;
}) {
  if (updates.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-300">
          <Icon icon="heroicons:chat-bubble-left-right" className="text-xl" />
        </div>
        <p className="text-xs text-slate-400">Henüz güncelleme paylaşılmadı.</p>
      </div>
    );
  }

  const typeConfig: any = {
    note: {
      icon: "heroicons:document-text",
      color: "text-blue-500 bg-blue-50",
    },
    risk: {
      icon: "heroicons:exclamation-triangle",
      color: "text-red-500 bg-red-50",
    },
    decision: {
      icon: "heroicons:check-circle",
      color: "text-green-500 bg-green-50",
    },
    retro: {
      icon: "heroicons:arrow-path",
      color: "text-purple-500 bg-purple-50",
    },
  };

  return (
    <div className="divide-y divide-slate-100">
      {updates.map((update) => {
        const config = typeConfig[update.update_type] || typeConfig.note;

        return (
          <div
            key={update.id}
            className="p-4 hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-start gap-3">
              {/* Yazar Avatarı */}
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border border-white shadow-sm">
                {update.profiles?.avatar_url ? (
                  <Image
                    src={update.profiles.avatar_url}
                    alt=""
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">
                    {update.profiles?.full_name?.[0] || "?"}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-700 truncate">
                    {update.profiles?.full_name}
                  </span>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                    {new Date(update.created_at).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-0.5 mb-1">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center ${config.color}`}
                  >
                    <Icon icon={config.icon} className="text-[10px]" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {update.title}
                  </h4>
                </div>

                {update.body && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {update.body}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
