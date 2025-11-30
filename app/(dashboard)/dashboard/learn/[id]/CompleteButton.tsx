"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { completeLearning } from "../actions"; // Daha önce yazdığımız action
import toast from "react-hot-toast";
import confetti from "canvas-confetti"; // Efekt için (opsiyonel ama şık)

// pnpm add canvas-confetti
// pnpm add -D @types/canvas-confetti

export default function CompleteButton({
  learningId,
  xp,
  isCompleted,
}: {
  learningId: string;
  xp: number;
  isCompleted: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      await completeLearning(learningId, xp);

      // Konfeti Efekti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      toast.success(`Tebrikler! Eğitimi tamamladın ve +${xp} XP kazandın!`, {
        duration: 5000,
        icon: "🏆",
      });
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
          <Icon icon="heroicons:check-badge" className="text-4xl" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          Bu eğitimi tamamladınız!
        </h3>
        <p className="text-slate-500">Puanlarınız profilinize eklendi.</p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <p className="text-slate-500 text-sm">
        İçeriği tamamen incelediyseniz aşağıdaki butona tıklayın.
      </p>
      <button
        onClick={handleComplete}
        disabled={loading}
        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 rounded-full hover:bg-blue-700 hover:scale-105 hover:shadow-xl hover:shadow-blue-600/30 disabled:opacity-70 disabled:pointer-events-none"
      >
        {loading ? (
          <Icon icon="svg-spinners:180-ring" className="text-xl" />
        ) : (
          <>
            <span className="text-lg">Öğrendim ve Tamamla</span>
            <Icon
              icon="heroicons:arrow-right"
              className="text-xl group-hover:translate-x-1 transition-transform"
            />
          </>
        )}
      </button>
    </div>
  );
}
