import React, { useState, useEffect } from "react";
import { Hash, GraduationCap, Landmark } from "lucide-react";
import { documentApi } from "../../../api/documentApi";

const TABS = [
  { key: "general", label: "Chung", icon: Hash },
  { key: "category", label: "Theo ngành", icon: GraduationCap },
  { key: "university", label: "Theo trường", icon: Landmark },
];

export default function RoomSelector({ activeRoomId, onSelectRoom }) {
  const [tab, setTab] = useState("general");
  const [categories, setCategories] = useState([]);
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    documentApi.getCategories().then(setCategories);
    documentApi.getUniversities().then(setUniversities);
  }, []);

  const listForTab = tab === "category" ? categories : tab === "university" ? universities : [];

  return (
    <div className="w-56 shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm p-3 space-y-3 h-fit">
      <div className="flex gap-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg text-[10px] font-bold transition-all ${
              tab === key ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:bg-slate-50"
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        {tab === "general" ? (
          <button
            onClick={() => onSelectRoom("general", "Sảnh chung")}
            className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeRoomId === "general"
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            # Sảnh chung
          </button>
        ) : (
          listForTab.map((item) => {
            const roomId = `${tab}:${item.id}`;
            const label = item.name || item.title;
            return (
              <button
                key={roomId}
                onClick={() => onSelectRoom(roomId, label)}
                className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-bold truncate transition-all ${
                  activeRoomId === roomId
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}