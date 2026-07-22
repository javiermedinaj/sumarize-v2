"use client";

import React from "react";
import { Link } from "lucide-react";

type Props = { onUrlSubmit: (url: string) => void; loading?: boolean; error?: string | null };

export const FileUpload: React.FC<Props> = ({ onUrlSubmit, loading = false, error }) => {
  const [url, setUrl] = React.useState("");
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const errorMessage = validationError ?? error;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = url.trim();
    if (!value) {
      setValidationError("Pegá un enlace de YouTube para continuar.");
      return;
    }
    try {
      const parsed = new URL(value);
      if (!/(^|\.)youtube\.com$|(^|\.)youtu\.be$|(^|\.)youtube-nocookie\.com$/.test(parsed.hostname)) throw new Error();
    } catch {
      setValidationError("Usá un enlace válido de YouTube.");
      return;
    }
    setValidationError(null);
    onUrlSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start gap-4">
        <div className="mt-1 rounded-lg bg-emerald-50 p-2.5 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"><Link className="h-5 w-5" aria-hidden="true" /></div>
        <div><h2 className="text-lg font-semibold text-zinc-950 dark:text-white">Analizá un video de YouTube</h2><p id="url-hint" className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">Funciona mejor con videos que tengan subtítulos disponibles.</p></div>
      </div>
      <label htmlFor="video-url" className="mt-6 block text-sm font-medium text-zinc-800 dark:text-zinc-100">Enlace del video</label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input id="video-url" name="video-url" type="url" inputMode="url" autoComplete="url" value={url} onChange={(e) => { setUrl(e.target.value); setValidationError(null); }} placeholder="https://www.youtube.com/watch?v=..." required disabled={loading} aria-invalid={Boolean(errorMessage)} aria-describedby={errorMessage ? "url-error" : "url-hint"} className="min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-3 py-3 text-zinc-950 placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-500" />
        <button type="submit" disabled={loading} className="min-h-11 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-400">{loading ? "Analizando…" : "Generar material"}</button>
      </div>
      {errorMessage && <p id="url-error" role="alert" className="mt-3 text-sm font-medium text-red-700 dark:text-red-400">{errorMessage}</p>}
    </form>
  );
};
