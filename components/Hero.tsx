import React from "react";
import { BookOpen, Brain, Layers3 } from "lucide-react";

export const Hero: React.FC = () => {
  return (
    <section className="border-b border-stone-200 bg-stone-50/70 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">Aprendé con intención</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-zinc-950 sm:text-6xl dark:text-white">Convertí un video en material de estudio que sí vas a usar.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">Pegá un enlace de YouTube y obtené un resumen estructurado, flashcards para repasar y guías para profundizar en las ideas importantes.</p>
          <a href="#analizar" className="mt-8 inline-flex min-h-11 items-center rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-400">Analizar un video</a>
        </div>
        <div className="mt-12 grid gap-3 sm:grid-cols-3">
          {[
            [BookOpen, "Resumen claro", "Ideas ordenadas para entender rápido."],
            [Layers3, "Repaso activo", "Flashcards listas para estudiar."],
            [Brain, "Profundizá", "Preguntas que llevan el aprendizaje más allá."],
          ].map(([Icon, title, text]) => {
            const FeatureIcon = Icon as typeof BookOpen;
            return <div key={title as string} className="rounded-xl border border-stone-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"><FeatureIcon className="h-5 w-5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" /><h2 className="mt-4 font-semibold text-zinc-950 dark:text-white">{title as string}</h2><p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{text as string}</p></div>;
          })}
        </div>
      </div>
    </section>
  );
};
