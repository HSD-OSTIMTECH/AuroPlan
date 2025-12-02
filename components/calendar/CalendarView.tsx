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
import { tr } from "date-fns/locale";
import { Icon } from "@iconify/react";
import { CalendarItem } from "@/types/calendar";
import EventDetailsModal from "./EventDetailsModal"; 

export default function CalendarView({
  items,
  currentUserId,
}: {
  items: CalendarItem[];
  currentUserId: string;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null); // <--- STATE EKLENDİ

  // ... (Tarih hesaplama kodları aynı) ...
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getItemColor = (item: CalendarItem) => {
    if (item.type === "task")
      return "bg-blue-50 text-blue-700 border-blue-100 hover:border-blue-300";
    if (item.type === "project")
      return "bg-purple-50 text-purple-700 border-purple-100 hover:border-purple-300";
    if (item.type === "event" && item.status === "meeting")
      return "bg-amber-50 text-amber-700 border-amber-100 hover:border-amber-300";
    return "bg-slate-50 text-slate-700 border-slate-100 hover:border-slate-300";
  };

  return (
    <>
      {/* MODAL EKLENDİ */}
      <EventDetailsModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        currentUserId={currentUserId}
      />

      <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* ... TOOLBAR AYNI ... */}
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
                <Icon icon="heroicons:chevron-left" />
              </button>
              <button
                onClick={goToToday}
                className="px-3 text-xs font-bold text-slate-600 hover:bg-white rounded shadow-sm"
              >
                Bugün
              </button>
              <button
                onClick={nextMonth}
                className="p-1 hover:bg-white rounded shadow-sm transition-all"
              >
                <Icon icon="heroicons:chevron-right" />
              </button>
            </div>
          </div>
        </div>

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

        <div className="grid grid-cols-7 flex-1 auto-rows-fr">
          {days.map((day, dayIdx) => {
            const dayItems = items.filter((item) =>
              isSameDay(item.startDate, day)
            );

            return (
              <div
                key={day.toString()}
                className={`
                            min-h-[100px] border-b border-r border-slate-100 p-1 transition-colors
                            ${
                              !isSameMonth(day, currentDate)
                                ? "bg-slate-50/30"
                                : "bg-white"
                            }
                        `}
              >
                <div className="text-right mb-1 pr-1 pt-1">
                  <span
                    className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ml-auto ${
                      isToday(day) ? "bg-blue-600 text-white" : "text-slate-500"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                </div>

                <div className="space-y-1">
                  {dayItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)} // <--- TIKLAMA EKLENDİ
                      className={`text-[10px] px-1.5 py-1 rounded border truncate font-medium cursor-pointer transition-all ${getItemColor(
                        item
                      )}`}
                    >
                      {item.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
