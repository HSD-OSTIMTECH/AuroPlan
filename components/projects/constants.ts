export const PROJECT_STATUS_META = {
  planning: {
    label: "Planlama",
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400",
  },
  in_progress: {
    label: "Devam Ediyor",
    badge: "bg-blue-50 text-blue-700 border border-blue-200",
    dot: "bg-blue-500 animate-pulse",
  },
  on_hold: {
    label: "Beklemede",
    badge: "bg-slate-100 text-slate-600 border border-slate-200",
    dot: "bg-slate-300",
  },
  completed: {
    label: "Tamamlandı",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-400",
  },
  cancelled: {
    label: "İptal",
    badge: "bg-rose-50 text-rose-700 border border-rose-200",
    dot: "bg-rose-400",
  },
} as const;

export const PROJECT_PRIORITY_META = {
  low: {
    label: "Düşük Öncelik",
    badge: "bg-slate-50 text-slate-600 border border-slate-200",
  },
  medium: {
    label: "Orta Öncelik",
    badge: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  high: {
    label: "Yüksek Öncelik",
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  critical: {
    label: "Kritik",
    badge: "bg-rose-50 text-rose-700 border border-rose-200",
  },
} as const;

export function getProjectStatusMeta(status?: string | null) {
  if (!status) return PROJECT_STATUS_META.planning;
  return PROJECT_STATUS_META[status as keyof typeof PROJECT_STATUS_META] ?? PROJECT_STATUS_META.planning;
}

export function getProjectPriorityMeta(priority?: string | null) {
  if (!priority) return PROJECT_PRIORITY_META.medium;
  return PROJECT_PRIORITY_META[priority as keyof typeof PROJECT_PRIORITY_META] ?? PROJECT_PRIORITY_META.medium;
}
