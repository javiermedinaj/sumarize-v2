"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingSpinner: React.FC<{ message?: string }> = ({
  message = "Processing your video...",
}) => (
  <div role="status" aria-live="polite" className="rounded-xl border border-stone-200 bg-stone-50 p-8 dark:border-zinc-800 dark:bg-zinc-900">
    <div className="flex items-center gap-3"><Loader2 className="h-5 w-5 animate-spin text-emerald-700 dark:text-emerald-400" aria-hidden="true" /><p className="font-medium text-zinc-900 dark:text-white">{message}</p></div>
    <ol className="mt-6 grid gap-3 text-sm text-zinc-600 sm:grid-cols-3 dark:text-zinc-300"><li>1. Buscando subtítulos</li><li>2. Creando resumen</li><li>3. Preparando material de repaso</li></ol>
  </div>
);
