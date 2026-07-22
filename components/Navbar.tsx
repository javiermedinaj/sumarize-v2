"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeContext";

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav aria-label="Navegación principal" className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#analizar" className="font-bold tracking-tight text-zinc-950 dark:text-white">
          YT<span className="text-emerald-600 dark:text-emerald-400">/</span>ESTUDIO
        </a>
        <div className="flex items-center gap-2">
          <a href="#analizar" className="hidden rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-stone-100 hover:text-zinc-950 sm:inline-flex dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white">
            Analizar video
          </a>
          <button type="button" onClick={toggleTheme} aria-label={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"} className="inline-flex h-10 w-10 items-center justify-center rounded-md text-zinc-600 hover:bg-stone-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white">
            {theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </nav>
  );
};
