"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// --- LOGIN ---
export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // HATA DÜZELTİLDİ: encodeURIComponent kullanıldı
    const message = encodeURIComponent(
      "Giriş yapılamadı. E-posta veya şifre hatalı."
    );
    return redirect(`/login?error=${message}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

// --- SIGN UP ---
export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        avatar_url: "",
      },
    },
  });

  if (error) {
    // HATA DÜZELTİLDİ: encodeURIComponent kullanıldı
    const message = encodeURIComponent(
      "Kayıt oluşturulamadı. Lütfen bilgileri kontrol edin."
    );
    return redirect(`/signup?error=${message}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

// --- SIGN OUT ---
export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}
