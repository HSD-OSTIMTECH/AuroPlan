"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTeam(formData: FormData) {
  const supabase = await createClient();

  // 1. Kullanıcı Kontrolü
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = formData.get("name") as string;
  const membersRaw = formData.get("members") as string; // Yeni alan

  if (!name || name.trim().length < 3) {
    throw new Error("Takım adı en az 3 karakter olmalıdır.");
  }

  // 2. Slug Oluşturma
  const slug =
    name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-") +
    "-" +
    Date.now().toString().slice(-4);

  // 3. Takımı Oluştur
  const { data: team, error } = await supabase
    .from("teams")
    .insert({
      name,
      slug,
      owner_id: user.id, // RLS bu alanın auth.uid() ile aynı olmasını bekler
    })
    .select()
    .single();

  if (error) {
    console.error("Team Create Error:", error);
    throw new Error(`Takım oluşturulamadı: ${error.message}`);
  }

  // Owner'ı team_members tablosuna ekle
  await supabase.from("team_members").insert({
    team_id: team.id,
    user_id: user.id,
    role: "owner",
  });

  // 4. Üyeleri Ekle (Opsiyonel)
  if (membersRaw && membersRaw.trim().length > 0) {
    // E-postaları temizle ve ayır
    const emails = membersRaw
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    if (emails.length > 0) {
      // Bu e-postalara sahip kullanıcıları bul
      // Not: Sadece sisteme kayıtlı kullanıcıları ekleyebiliriz.
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email")
        .in("email", emails);

      if (profiles && profiles.length > 0) {
        const newMembers = profiles.map((profile) => ({
          team_id: team.id,
          user_id: profile.id,
          role: "member",
        }));

        // Üyeleri veritabanına yaz
        const { error: memberError } = await supabase
          .from("team_members")
          .insert(newMembers);

        if (memberError) {
          console.error("Member add error", memberError);
          // Takım oluştu ama üyeler eklenemedi, kullanıcıya bunu bildirebiliriz
          // ama şimdilik akışı bozmayalım.
        }
      }
    }
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
