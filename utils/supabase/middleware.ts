import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // 1. Response oluştur
  let supabaseResponse = NextResponse.next({
    request,
  });

  // 2. Supabase client oluştur
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. Kullanıcıyı kontrol et
  // getUser() kullanmak daha güvenlidir çünkü her seferinde auth sunucusunu doğrular
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // --- KURAL 1: Giriş Yapmamış Kullanıcı Koruması ---
  // Kullanıcı yoksa ve korumalı bir rotaya (/dashboard) girmeye çalışıyorsa -> Login'e at
  if (!user && path.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // --- KURAL 2: Giriş Yapmış Kullanıcı Koruması ---
  // Kullanıcı varsa ve Auth sayfalarına (/login, /signup) girmeye çalışıyorsa -> Dashboard'a at
  if (user && (path.startsWith("/login") || path.startsWith("/signup"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
