"use client";

import React from "react";
import { FaRegFileAlt, FaLayerGroup, FaBrain } from "react-icons/fa";

export type TabType = "summary" | "flashcards" | "prompt";

export const ContentTabs: React.FC<{
  activeTab: TabType;
  onTabChange: (t: TabType) => void;
}> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabType; label: string; short: string; icon: React.ReactNode }[] = [
    { id: "summary", label: "Resumen", short: "Resumen", icon: <FaRegFileAlt className="w-4 h-4" aria-hidden="true" /> },
    { id: "flashcards", label: "Flashcards", short: "Tarjetas", icon: <FaLayerGroup className="w-4 h-4" aria-hidden="true" /> },
    { id: "prompt", label: "Profundizar", short: "Explorar", icon: <FaBrain className="w-4 h-4" aria-hidden="true" /> },
  ];

  return (
    <div role="tablist" aria-label="Material generado" className="grid grid-cols-3 gap-1 rounded-lg bg-stone-100 p-1 dark:bg-zinc-900">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          id={`${tab.id}-tab`}
          aria-selected={activeTab === tab.id}
          aria-controls={`${tab.id}-panel`}
          onClick={() => onTabChange(tab.id)}
          className={`flex min-h-11 items-center justify-center gap-2 rounded-md px-2 py-2 font-medium text-xs sm:px-4 sm:text-sm transition-colors ${
            activeTab === tab.id
              ? "bg-white text-emerald-800 shadow-sm dark:bg-zinc-800 dark:text-emerald-300"
              : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
          }`}
        >
          {tab.icon}
          <span className="sm:hidden">{tab.short}</span>
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};
