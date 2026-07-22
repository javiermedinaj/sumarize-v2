"use client";

import React from "react";
import { FaYoutube, FaTrash } from "react-icons/fa";
import { extractVideoId } from "@/lib/video-id";

type Props = { videoUrl: string; onClear: () => void; title?: string; author?: string; lengthSeconds?: number; fromCache?: boolean };

function formatDuration(seconds?: number) {
  if (!seconds) return null;
  return `${Math.floor(seconds / 60)} min`;
}

export const VideoPlayer: React.FC<Props> = ({ videoUrl, onClear, title, author, lengthSeconds, fromCache }) => {
  const id = extractVideoId(videoUrl);

  return (
    <section aria-label="Video analizado" className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="aspect-video w-full bg-zinc-100 dark:bg-zinc-950">
        {id ? <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${id}`} title={title || "Vista previa del video"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <div className="grid h-full place-items-center text-sm text-zinc-500">No pudimos cargar la vista previa del video.</div>}
      </div>
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="truncate font-semibold text-zinc-950 dark:text-white">{title || "Video analizado"}</h2>{fromCache && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">Recuperado del historial</span>}</div>{(author || lengthSeconds) && <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{[author, formatDuration(lengthSeconds)].filter(Boolean).join(" · ")}</p>}</div>
        <div className="flex shrink-0 items-center gap-2"><a href={videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-zinc-700 hover:bg-stone-100 dark:text-zinc-200 dark:hover:bg-zinc-800"><FaYoutube className="h-5 w-5 text-red-600" aria-hidden="true" />Ver en YouTube</a><button type="button" onClick={onClear} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"><FaTrash className="h-4 w-4" aria-hidden="true" />Otro video</button></div>
      </div>
    </section>
  );
};
