export type CalendarEventType = "task" | "project" | "milestone" | "event";

export interface CalendarItem {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  type: CalendarEventType;
  status?: string; // 'todo', 'in_progress', 'done', 'meeting' vb.
  priority?: string; // 'high', 'medium', 'low'
  isAllDay?: boolean;
  metadata?: {
    description?: string | null;
    teamId?: string | null;
    projectId?: string;
    ownerAvatar?: string | null;
  };
}
