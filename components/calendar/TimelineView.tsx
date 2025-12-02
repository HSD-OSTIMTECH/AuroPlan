"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  isWithinInterval,
  differenceInDays,
} from "date-fns";
import { tr } from "date-fns/locale";
import { Icon } from "@iconify/react";
import { CalendarItem } from "@/types/calendar";

export default function TimelineView({ items }: { items: CalendarItem[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Ayın günlerini hesapla
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Gezinme
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Öğeleri Grupla (Önce Projeler, Sonra Görevler)
  const sortedItems = [...items].sort((a, b) => {
    if (a.type === "project" && b.type !== "project") return -1;
    if (a.type !== "project" && b.type === "project") return 1;
    return a.startDate.getTime() - b.startDate.getTime();
  });

  // Renk Seçici
  const getItemStyle = (item: CalendarItem) => {
    if (item.type === "project")
      return "bg-purple-600 border-purple-700 text-white";
    if (item.type === "task") return "bg-blue-500 border-blue-600 text-white";
    if (item.type === "event")
      return "bg-amber-500 border-amber-600 text-white";
    return "bg-slate-500 border-slate-600 text-white";
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* --- TOOLBAR --- */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800 capitalize flex items-center gap-2">
            <Icon
              icon="heroicons:chart-bar-square"
              className="text-slate-400"
            />
            {format(currentDate, "MMMM yyyy", { locale: tr })}
          </h2>
          <div className="flex gap-1 bg-white border border-slate-200 p-1 rounded-lg">
            <button
              onClick={prevMonth}
              className="p-1 hover:bg-slate-50 rounded transition-all"
            >
              <Icon icon="heroicons:chevron-left" className="text-slate-500" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1 hover:bg-slate-50 rounded transition-all"
            >
              <Icon icon="heroicons:chevron-right" className="text-slate-500" />
            </button>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Zaman Çizelgesi
        </div>
      </div>

      {/* --- TIMELINE BODY --- */}
      <div className="flex-1 overflow-auto relative">
        <div className="min-w-max">
          {/* Header (Günler) */}
          <div className="flex border-b border-slate-200 sticky top-0 z-10 bg-white shadow-sm">
            <div className="w-48 p-3 border-r border-slate-100 font-bold text-xs text-slate-500 bg-slate-50 sticky left-0 z-20">
              Görev / Proje
            </div>
            {days.map((day) => (
              <div
                key={day.toString()}
                className="w-10 flex-shrink-0 border-r border-slate-100 p-2 text-center"
              >
                <div className="text-[10px] text-slate-400 uppercase">
                  {format(day, "EEE", { locale: tr })}
                </div>
                <div
                  className={`text-sm font-bold ${
                    isSameDay(day, new Date())
                      ? "text-blue-600"
                      : "text-slate-700"
                  }`}
                >
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {sortedItems.map((item) => {
              // Başlangıç ve Bitişin bu ay içinde olup olmadığını kontrol et
              // Basitlik için: Sadece bu ayın günlerinde görünürlüğünü hesaplıyoruz

              // Başlangıç günü indexi (Ayın kaçıncı günü?)
              let startDay = item.startDate.getDate();
              let endDay = item.endDate.getDate();

              // Eğer tarih aralığı bu ayın dışına taşıyorsa sınırla
              // (Bu kısım geliştirilebilir, şimdilik basit render)
              const isStartInMonth = isSameDay(
                startOfMonth(item.startDate),
                monthStart
              );
              const isEndInMonth = isSameDay(
                startOfMonth(item.endDate),
                monthStart
              );

              if (!isStartInMonth && !isEndInMonth) return null; // Bu ayda değilse gösterme

              if (!isStartInMonth) startDay = 1;
              if (!isEndInMonth) endDay = days.length;

              const duration = endDay - startDay + 1;
              const leftOffset = (startDay - 1) * 40; // 40px = w-10
              const width = duration * 40;

              return (
                <div
                  key={item.id}
                  className="flex hover:bg-slate-50 transition-colors group"
                >
                  {/* Sol İsim Kolonu */}
                  <div className="w-48 p-3 border-r border-slate-100 sticky left-0 bg-white group-hover:bg-slate-50 z-10 flex items-center gap-2 overflow-hidden">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.type === "project"
                          ? "bg-purple-500"
                          : "bg-blue-500"
                      }`}
                    ></div>
                    <span
                      className="text-xs font-medium text-slate-700 truncate"
                      title={item.title}
                    >
                      {item.title}
                    </span>
                  </div>

                  {/* Timeline Bar Alanı */}
                  <div className="relative flex-1 h-12">
                    {/* Izgara Çizgileri */}
                    <div className="absolute inset-0 flex pointer-events-none">
                      {days.map((d) => (
                        <div
                          key={d.toString()}
                          className="w-10 border-r border-slate-50 h-full"
                        ></div>
                      ))}
                    </div>

                    {/* Bar */}
                    <div
                      className={`absolute top-3 h-6 rounded-md shadow-sm flex items-center px-2 text-[10px] font-bold truncate border ${getItemStyle(
                        item
                      )}`}
                      style={{
                        left: `${leftOffset}px`,
                        width: `${width}px`,
                      }}
                    >
                      {width > 30 && item.title}
                    </div>
                  </div>
                </div>
              );
            })}

            {sortedItems.length === 0 && (
              <div className="p-12 text-center text-slate-400 text-sm">
                Bu ay için görüntülenecek veri yok.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
