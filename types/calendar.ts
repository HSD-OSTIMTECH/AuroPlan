export type CalendarEventType = "task" | "project" | "milestone" | "event";

export interface CalendarItem {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  type: CalendarEventType;
  status?: string;
  priority?: string;
  isAllDay?: boolean;
  metadata?: {
    description?: string | null;
    teamId?: string | null;
    projectId?: string;
    creatorId?: string; // <--- YENİ: Yetki kontrolü için
    ownerAvatar?: string | null;
  };
}
