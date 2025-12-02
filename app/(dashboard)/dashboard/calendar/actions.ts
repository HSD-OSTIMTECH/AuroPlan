"use server";

import { createClient } from "@/utils/supabase/server";
import { CalendarItem } from "@/types/calendar";
import { revalidatePath } from "next/cache";

// --- TÜM TAKVİM VERİLERİNİ GETİR ---
export async function getCalendarItems(
  teamId?: string
): Promise<CalendarItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  let items: CalendarItem[] = [];

  // 1. GÖREVLERİ ÇEK (Tasks)
  let tasksQuery = supabase.from("tasks").select("*");

  if (teamId && teamId !== "personal") {
    tasksQuery = tasksQuery.eq("team_id", teamId);
  } else {
    // Kişisel veya tüm görevlerim
    tasksQuery = tasksQuery.eq("created_by", user.id); // Veya assigned_to
  }

  const { data: tasks } = await tasksQuery;

  if (tasks) {
    const taskItems: CalendarItem[] = tasks
      .filter((t) => t.due_date) // Sadece tarihi olanlar
      .map((t) => ({
        id: t.id,
        title: t.title,
        startDate: new Date(t.due_date!),
        endDate: new Date(t.due_date!), // Görevler genelde tek günlük deadline'dır
        type: "task",
        status: t.status,
        priority: t.priority,
        isAllDay: true,
        metadata: {
          description: t.description,
          teamId: t.team_id,
        },
      }));
    items = [...items, ...taskItems];
  }

  // 2. PROJELERİ ÇEK (Projects)
  let projectsQuery = supabase.from("projects").select("*");

  if (teamId && teamId !== "personal") {
    projectsQuery = projectsQuery.eq("team_id", teamId);
  } else {
    projectsQuery = projectsQuery.is("team_id", null).eq("owner_id", user.id);
  }

  const { data: projects } = await projectsQuery;

  if (projects) {
    const projectItems: CalendarItem[] = projects
      .filter((p) => p.start_date && p.due_date)
      .map((p) => ({
        id: p.id,
        title: `PROJE: ${p.name}`,
        startDate: new Date(p.start_date!),
        endDate: new Date(p.due_date!),
        type: "project",
        status: p.status,
        priority: p.priority,
        isAllDay: true,
        metadata: {
          description: p.description,
          teamId: p.team_id,
        },
      }));
    items = [...items, ...projectItems];
  }

  // 3. ETKİNLİKLERİ ÇEK (Calendar Events)
  let eventsQuery = supabase.from("calendar_events").select("*");

  if (teamId && teamId !== "personal") {
    eventsQuery = eventsQuery.eq("team_id", teamId);
  } else {
    eventsQuery = eventsQuery.eq("user_id", user.id).is("team_id", null);
  }

  const { data: events } = await eventsQuery;

  if (events) {
    const eventItems: CalendarItem[] = events.map((e) => ({
      id: e.id,
      title: e.title,
      startDate: new Date(e.start_date),
      endDate: new Date(e.end_date),
      type: "event",
      status: e.event_type, // 'meeting', 'reminder' vb.
      isAllDay: e.is_all_day,
      metadata: {
        description: e.description,
        teamId: e.team_id,
      },
    }));
    items = [...items, ...eventItems];
  }

  return items;
}

// --- YENİ ETKİNLİK EKLE ---
export async function createCalendarEvent(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum açmanız gerekiyor.");

  const title = formData.get("title") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string; // Veya start ile aynı olabilir
  const type = formData.get("type") as string;
  const teamId = formData.get("teamId") as string;
  const description = formData.get("description") as string;

  if (!title || !startDate) return;

  const { error } = await supabase.from("calendar_events").insert({
    title,
    start_date: new Date(startDate).toISOString(),
    end_date: endDate
      ? new Date(endDate).toISOString()
      : new Date(startDate).toISOString(),
    event_type: type || "meeting",
    description,
    user_id: user.id,
    team_id: teamId === "personal" ? null : teamId,
  });

  if (error) throw new Error("Etkinlik oluşturulamadı.");

  revalidatePath("/dashboard/calendar");
}
