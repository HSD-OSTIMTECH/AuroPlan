"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import { tr } from "date-fns/locale"; // Türkçe yerelleştirme
import { Icon } from "@iconify/react";
import { CalendarItem } from "@/types/calendar";

export default function CalendarView({ items }: { items: CalendarItem[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Ayın başlangıç ve bitiş tarihlerini bul
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // Takvim ızgarasının başlangıç (önceki aydan gelen günler) ve bitişi
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Pazartesi başlasın
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // Görüntülenecek tüm günler
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Gezinme Fonksiyonları
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Renk Yardımcısı
  const getItemColor = (item: CalendarItem) => {
    if (item.type === "task")
      return "bg-blue-100 text-blue-700 border-blue-200";
    if (item.type === "project")
      return "bg-purple-100 text-purple-700 border-purple-200";
    if (item.type === "event" && item.status === "meeting")
      return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* --- TOOLBAR --- */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800 capitalize">
            {format(currentDate, "MMMM yyyy", { locale: tr })}
          </h2>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={prevMonth}
              className="p-1 hover:bg-white rounded shadow-sm transition-all"
            >
              <Icon icon="heroicons:chevron-left" className="text-slate-500" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 text-xs font-bold text-slate-600 hover:bg-white rounded shadow-sm transition-all"
            >
              Bugün
            </button>
            <button
              onClick={nextMonth}
              className="p-1 hover:bg-white rounded shadow-sm transition-all"
            >
              <Icon icon="heroicons:chevron-right" className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Görünüm Değiştirici (İleride eklenebilir: Hafta/Gün) */}
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg">
            Ay
          </button>
          <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg">
            Hafta
          </button>
        </div>
      </div>

      {/* --- GRID HEADER (Gün İsimleri) --- */}
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
        {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day) => (
          <div
            key={day}
            className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* --- CALENDAR GRID --- */}
      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {days.map((day, dayIdx) => {
          // O güne ait itemları bul
          const dayItems = items.filter((item) =>
            isSameDay(item.startDate, day)
          );

          return (
            <div
              key={day.toString()}
              className={`
                        min-h-[120px] border-b border-r border-slate-100 p-2 transition-colors hover:bg-slate-50/30
                        ${
                          !isSameMonth(day, currentDate)
                            ? "bg-slate-50/50 text-slate-400"
                            : "bg-white"
                        }
                        ${
                          dayIdx % 7 === 6 ? "border-r-0" : ""
                        } // Son sütun border sil
                    `}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={`
                            text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                            ${
                              isToday(day)
                                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                : ""
                            }
                        `}
                >
                  {format(day, "d")}
                </span>
              </div>

              {/* Etkinlik Listesi */}
              <div className="space-y-1">
                {dayItems.map((item) => (
                  <div
                    key={item.id}
                    className={`text-[10px] px-2 py-1 rounded border truncate font-medium cursor-pointer hover:opacity-80 ${getItemColor(
                      item
                    )}`}
                    title={item.title}
                  >
                    {item.type === "task" && (
                      <Icon
                        icon="heroicons:check-circle"
                        className="inline mr-1 -mt-0.5"
                      />
                    )}
                    {item.type === "project" && (
                      <Icon
                        icon="heroicons:folder"
                        className="inline mr-1 -mt-0.5"
                      />
                    )}
                    {item.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
