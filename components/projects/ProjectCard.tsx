"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { getProjectPriorityMeta, getProjectStatusMeta } from "./constants";
import type { Database } from "@/types/supabase";

type Project = Database["public"]["Tables"]["projects"]["Row"];

type Props = {
  project: Project;
  milestoneCount?: number;
  memberCount?: number;
};

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default function ProjectCard({ project, milestoneCount = 0, memberCount = 0 }: Props) {
  const statusMeta = getProjectStatusMeta(project.status);
  const priorityMeta = getProjectPriorityMeta(project.priority);

  return (
    <Link href={`/dashboard/projects/${project.id}`} className="group focus:outline-none">
      <article className="h-full flex flex-col bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <span className={`w-2 h-2 rounded-full ${statusMeta.dot}`} />
              {project.team_id ? "Takım Projesi" : "Kişisel"}
            </span>
            <h3 className="mt-1 text-xl font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">
              {project.name}
            </h3>
          </div>
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusMeta.badge}`}>
            {statusMeta.label}
          </span>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
          {project.objective || "Bu proje için henüz amaç tanımlanmadı."}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-5">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-xs uppercase font-semibold text-slate-400">Başlangıç</p>
            <p className="font-semibold mt-1">
              {project.start_date ? dateFormatter.format(new Date(project.start_date)) : "Belirlenmedi"}
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-xs uppercase font-semibold text-slate-400">Teslim</p>
            <p className="font-semibold mt-1">
              {project.due_date ? dateFormatter.format(new Date(project.due_date)) : "Belirlenmedi"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${priorityMeta.badge}`}>
            {priorityMeta.label}
          </span>
          {project.description && (
            <span className="text-xs text-slate-400 line-clamp-1">{project.description}</span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Icon icon="heroicons:flag" className="text-blue-500" />
            <span className="font-semibold">{milestoneCount}</span>
            <span className="text-xs text-slate-400">milestone</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="heroicons:user-group" className="text-slate-400" />
            <span className="font-semibold">{memberCount}</span>
            <span className="text-xs text-slate-400">üye</span>
          </div>
          <div className="flex items-center gap-1 text-primary font-semibold text-xs">
            İncele
            <Icon icon="heroicons:arrow-right" className="text-sm transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </article>
    </Link>
  );
}
