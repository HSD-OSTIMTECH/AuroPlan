"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { CalendarItem } from "@/types/calendar";
import CalendarView from "./CalendarView";
import TimelineView from "./TimelineView";
import EventModal from "./EventModal";

type Team = {
  id: string;
  name: string;
};

export default function CalendarContainer({
  items,
  teams,
  teamId,
}: {
  items: CalendarItem[];
  teams: Team[];
  teamId: string;
}) {
  const [view, setView] = useState<"calendar" | "timeline">("calendar");

  return (
    <div className="h-full flex flex-col gap-4">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Icon icon="heroicons:calendar-days" className="text-blue-600" />
            Takvim & Planlama
          </h1>
          <p className="text-slate-500 text-sm">
            {teamId === "personal"
              ? "Kişisel programınız"
              : "Takım proje ve görev takvimi"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Görünüm Değiştirici */}
          <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-bold">
            <button
              onClick={() => setView("calendar")}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-2 ${
                view === "calendar"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon icon="heroicons:calendar" />
              Takvim
            </button>
            <button
              onClick={() => setView("timeline")}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-2 ${
                view === "timeline"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon icon="heroicons:chart-bar" />
              Zaman Çizelgesi
            </button>
          </div>

          {/* Ekleme Modalı */}
          <EventModal teams={teams} />
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 min-h-0">
        {view === "calendar" ? (
          <CalendarView items={items} />
        ) : (
          <TimelineView items={items} />
        )}
      </div>
    </div>
  );
}
