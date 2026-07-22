import React from "react";

export const LogoMarquee: React.FC = () => (
  <section className="border-t border-stone-200 bg-stone-50 py-16 dark:border-zinc-800 dark:bg-zinc-900/40">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-[1fr_2fr] md:items-center">
        <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">Pensado para estudiar</p><h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">Menos reproducción pasiva. Más aprendizaje activo.</h2></div>
        <ul className="grid gap-3 sm:grid-cols-3">{["Clases y conferencias", "Tutoriales técnicos", "Videos de repaso"].map((useCase) => <li key={useCase} className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">{useCase}</li>)}</ul>
      </div>
    </div>
  </section>
);
