import Link from "next/link";
import { Icon } from "@iconify/react";
import { login } from "../actions";
import AuthMessageListener from "@/components/auth/AuthMessageListener"; // EKLENDİ

export default function LoginPage() {
  return (
    <>
      <AuthMessageListener /> {/* EKLENDİ: URL hatalarını dinler */}
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-bold text-foreground">Giriş Yap</h2>
        <p className="text-muted">Aura Plan hesabınıza erişin.</p>
      </div>
      {/* ... Formun geri kalanı aynı ... */}
      <form className="space-y-5" action={login}>
        {/* ... inputlar ... */}
        <div className="space-y-1.5">
          <label
            className="text-sm font-semibold text-foreground/80"
            htmlFor="email"
          >
            Email adresi
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="name@mail.com"
            required
            className="w-full px-4 py-3 bg-white border border-border rounded-lg text-foreground placeholder:text-muted/60 focus:border-primary focus:ring-0"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label
              className="text-sm font-semibold text-foreground/80"
              htmlFor="password"
            >
              Şifre
            </label>
            <Link
              href="#"
              className="text-sm font-semibold text-primary hover:text-primary-hover"
            >
              Şifremi Unuttum?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 bg-white border border-border rounded-lg text-foreground placeholder:text-muted/60 focus:border-primary focus:ring-0"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="remember"
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
          />
          <label
            htmlFor="remember"
            className="text-sm font-medium text-muted cursor-pointer select-none"
          >
            Beni Hatırla
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors flex justify-center items-center"
        >
          Giriş Yap
        </button>
      </form>
      {/* ... Divider ve Alt Kısım aynı ... */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">veya</span>
        </div>
      </div>
      <button
        type="button"
        className="w-full py-3 bg-white border border-border text-foreground font-semibold rounded-lg hover:bg-surface transition-colors flex justify-center items-center gap-2"
      >
        <Icon icon="logos:google-icon" className="text-xl" />
        <span className="text-sm">Google ile devam et</span>
      </button>
      <p className="text-center text-sm text-muted mt-6">
        Hesabınız yok mu?{" "}
        <Link href="/signup" className="font-bold text-primary hover:underline">
          Kayıt Olun
        </Link>
      </p>
    </>
  );
}
