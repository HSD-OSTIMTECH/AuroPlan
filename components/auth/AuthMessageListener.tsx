"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function AuthMessageListener() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    if (error) {
      toast.error(error);
      // Mesajı gösterdikten sonra URL'den temizle
      router.replace(pathname, { scroll: false });
    } else if (message) {
      toast.success(message);
      router.replace(pathname, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  return null; // Bu bileşen görünmez, sadece mantık çalıştırır
}
