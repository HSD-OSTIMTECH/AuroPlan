"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { CalendarItem } from "@/types/calendar";
import CalendarView from "./CalendarView";
import TimelineView from "./TimelineView";
import EventModal from "./EventModal";
import { useRouter } from "next/navigation"; // Router eklendi

type Team = { id: string; name: string };

export default function CalendarContainer({
  items,
  teams,
  teamId,
  currentUserId,
}: {
  items: CalendarItem[];
  teams: Team[];
  teamId: string;
  currentUserId: string;
}) {
  const [view, setView] = useState<"calendar" | "timeline">("calendar");
  const router = useRouter();

  // Filtreleme Fonksiyonu
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    router.push(`/dashboard/calendar?teamId=${selectedId}`);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Icon icon="heroicons:calendar-days" className="text-blue-600" />
            Takvim
          </h1>
          <div className="flex items-center gap-2 mt-1">
            {/* FİLTRELEME DROPDOWN */}
            <select
              value={teamId}
              onChange={handleFilterChange}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-bold py-1.5 pl-2 pr-8 rounded-lg outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="personal">👤 Kişisel Takvim</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  🏢 {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-bold">
            <button
              onClick={() => setView("calendar")}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-2 ${
                view === "calendar"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              <Icon icon="heroicons:calendar" /> Takvim
            </button>
            <button
              onClick={() => setView("timeline")}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-2 ${
                view === "timeline"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              <Icon icon="heroicons:chart-bar" /> Çizelge
            </button>
          </div>
          <EventModal teams={teams} />
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {view === "calendar" ? (
          <CalendarView items={items} currentUserId={currentUserId} />
        ) : (
          <TimelineView items={items} />
        )}
      </div>
    </div>
  );
}
