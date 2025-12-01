import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import ProfileForm from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Profil verisini çek
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center text-sm text-slate-500 mb-4">
          <Link
            href="/dashboard"
            className="hover:text-slate-900 transition-colors"
          >
            Dashboard
          </Link>
          <Icon icon="heroicons:chevron-right" className="mx-2 text-xs" />
          <span className="font-semibold text-slate-900">Profil Ayarları</span>
        </nav>
        <h1 className="text-3xl font-extrabold text-slate-900">Profilim</h1>
        <p className="text-slate-500 mt-1">
          Kişisel bilgilerinizi ve görünümünüzü yönetin.
        </p>
      </div>

      {/* Form Bileşeni */}
      {profile && <ProfileForm profile={profile} />}
    </div>
  );
}
