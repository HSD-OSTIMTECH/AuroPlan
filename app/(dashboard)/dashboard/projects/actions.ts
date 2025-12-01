"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export async function createProject(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const teamId = (formData.get("teamId") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const status = (formData.get("status") as string) || "planning";
  const priority = (formData.get("priority") as string) || "medium";
  const objective = (formData.get("objective") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const startDate = (formData.get("startDate") as string) || null;
  const dueDate = (formData.get("dueDate") as string) || null;
  const coverImageUrl = (formData.get("coverImageUrl") as string)?.trim();

  if (!teamId || !name) {
    throw new Error("Proje adı ve takım seçimi zorunludur.");
  }

  const slugBase = slugify(name);
  const slug = `${slugBase}-${Date.now().toString(36).slice(-4)}`;

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      name,
      team_id: teamId,
      owner_id: user.id,
      slug,
      status,
      priority,
      objective: objective || null,
      description: description || null,
      start_date: startDate || null,
      due_date: dueDate || null,
      cover_image_url: coverImageUrl || null,
    })
    .select()
    .single();

  if (error || !project) {
    console.error(error);
    throw new Error("Proje oluşturulamadı. Lütfen tekrar deneyin.");
  }

  const { error: memberError } = await supabase.from("project_members").insert({
    project_id: project.id,
    user_id: user.id,
    role: "owner",
  });

  if (memberError) {
    console.error(memberError);
  }

  revalidatePath("/dashboard/projects");
}
