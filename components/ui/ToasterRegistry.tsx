"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterRegistry() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Varsayılan süre
        duration: 4000,

        // Genel Stil
        style: {
          background: "#ffffff",
          color: "#0f172a",
          border: "1px solid #e2e8f0",
          padding: "16px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          fontSize: "14px",
          fontWeight: 500,
          borderRadius: "8px",
        },

        // Başarı Mesajı Stili
        success: {
          iconTheme: {
            primary: "#10b981", // Emerald 500
            secondary: "white",
          },
          style: {
            borderLeft: "4px solid #10b981",
          },
        },

        // Hata Mesajı Stili
        error: {
          iconTheme: {
            primary: "#ef4444", // Red 500
            secondary: "white",
          },
          style: {
            borderLeft: "4px solid #ef4444",
          },
        },
      }}
    />
  );
}
