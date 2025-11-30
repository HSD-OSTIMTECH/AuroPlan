"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Görev Oluşturma
export async function createTask(formData: FormData) {
  const supabase = await createClient();

  // Oturum kontrolü
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;
  const status = "todo"; // Varsayılan başlangıç durumu

  if (!title) return;

  const { error } = await supabase.from("tasks").insert({
    title,
    description,
    priority,
    status,
    created_by: user.id,
    // team_id: ... (İleride takım ID'si buraya eklenecek)
  });

  if (error) {
    console.error("Task creation failed:", error);
    // Hata yönetimi eklenebilir
  }

  revalidatePath("/dashboard/tasks");
}

// Görev Silme
export async function deleteTask(taskId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) console.error("Delete failed:", error);
  revalidatePath("/dashboard/tasks");
}

// Görev Durumu Güncelleme (Sürükle-Bırak için)
export async function updateTaskStatus(taskId: string, newStatus: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tasks")
    .update({ status: newStatus })
    .eq("id", taskId);

  if (error) console.error("Update failed:", error);
  revalidatePath("/dashboard/tasks");
}
