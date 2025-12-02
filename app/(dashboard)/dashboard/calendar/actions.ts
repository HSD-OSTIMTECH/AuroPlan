"use server";

import { createClient } from "@/utils/supabase/server";
import { CalendarItem } from "@/types/calendar";
import { revalidatePath } from "next/cache";

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
    tasksQuery = tasksQuery.eq("created_by", user.id);
  }
  const { data: tasks } = await tasksQuery;

  if (tasks) {
    items.push(
      ...tasks
        .filter((t) => t.due_date)
        .map(
          (t) =>
            ({
              id: t.id,
              title: t.title,
              startDate: new Date(t.due_date!),
              endDate: new Date(t.due_date!),
              type: "task",
              status: t.status,
              priority: t.priority,
              isAllDay: true,
              metadata: {
                description: t.description,
                teamId: t.team_id,
                creatorId: t.created_by,
              },
            } as CalendarItem)
        )
    );
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
    items.push(
      ...projects
        .filter((p) => p.start_date && p.due_date)
        .map(
          (p) =>
            ({
              id: p.id,
              title: `PROJE: ${p.name}`,
              startDate: new Date(p.start_date!),
              endDate: new Date(p.due_date!),
              type: "project",
              status: p.status,
              isAllDay: true,
              metadata: {
                description: p.description,
                teamId: p.team_id,
                creatorId: p.owner_id,
              },
            } as CalendarItem)
        )
    );
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
    items.push(
      ...events.map(
        (e) =>
          ({
            id: e.id,
            title: e.title,
            startDate: new Date(e.start_date),
            endDate: new Date(e.end_date),
            type: "event",
            status: e.event_type,
            isAllDay: e.is_all_day,
            metadata: {
              description: e.description,
              teamId: e.team_id,
              creatorId: e.user_id,
            },
          } as CalendarItem)
      )
    );
  }

  return items;
}

// --- ETKİNLİK EKLEME (Mevcut) ---
export async function createCalendarEvent(formData: FormData) {
  // ... (Mevcut kod aynen kalıyor) ...
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum açmanız gerekiyor.");

  const title = formData.get("title") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const type = formData.get("type") as string;
  const teamId = formData.get("teamId") as string;
  const description = formData.get("description") as string;

  if (!title || !startDate) return;

  await supabase.from("calendar_events").insert({
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

  revalidatePath("/dashboard/calendar");
}

// --- YENİ: ETKİNLİK SİLME ---
export async function deleteCalendarEvent(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Oturum açın.");

  // Sadece kendi oluşturduğumuzu silebiliriz (RLS de bunu kontrol eder ama burada da emin olalım)
  const { error } = await supabase
    .from("calendar_events")
    .delete()
    .eq("id", eventId)
    .eq("user_id", user.id);

  if (error) throw new Error("Silinemedi. Yetkiniz olmayabilir.");

  revalidatePath("/dashboard/calendar");
}
