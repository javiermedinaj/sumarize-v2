"use client";

import React, { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";
import { SiAnthropic, SiGooglegemini } from "react-icons/si";
import { Bot } from "lucide-react";

const SiOpenai = Bot;
import type { DeepDivePrompt } from "./types";

function colorsFor(n: number) {
  const palette = [
    { bg: "bg-blue-50 dark:bg-blue-950/50", border: "border-blue-200 dark:border-blue-800/50", header: "bg-blue-100 dark:bg-blue-900/60", text: "text-blue-700 dark:text-blue-300", btn: "bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300" },
    { bg: "bg-purple-50 dark:bg-purple-950/50", border: "border-purple-200 dark:border-purple-800/50", header: "bg-purple-100 dark:bg-purple-900/60", text: "text-purple-700 dark:text-purple-300", btn: "bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300" },
    { bg: "bg-green-50 dark:bg-green-950/50", border: "border-green-200 dark:border-green-800/50", header: "bg-green-100 dark:bg-green-900/60", text: "text-green-700 dark:text-green-300", btn: "bg-green-100 dark:bg-green-900/40 hover:bg-green-200 dark:hover:bg-green-900/60 text-green-700 dark:text-green-300" },
    { bg: "bg-orange-50 dark:bg-orange-950/50", border: "border-orange-200 dark:border-orange-800/50", header: "bg-orange-100 dark:bg-orange-900/60", text: "text-orange-700 dark:text-orange-300", btn: "bg-orange-100 dark:bg-orange-900/40 hover:bg-orange-200 dark:hover:bg-orange-900/60 text-orange-700 dark:text-orange-300" },
    { bg: "bg-pink-50 dark:bg-pink-950/50", border: "border-pink-200 dark:border-pink-800/50", header: "bg-pink-100 dark:bg-pink-900/60", text: "text-pink-700 dark:text-pink-300", btn: "bg-pink-100 dark:bg-pink-900/40 hover:bg-pink-200 dark:hover:bg-pink-900/60 text-pink-700 dark:text-pink-300" },
  ];
  return palette[(n - 1) % palette.length];
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}

export const PromptDisplay: React.FC<{ deepDivePrompts: DeepDivePrompt[] }> = ({
  deepDivePrompts,
}) => {
  const [copyState, setCopyState] = useState<Record<string, boolean>>({});

  const setCopied = (key: string) => {
    setCopyState((p) => ({ ...p, [key]: true }));
    setTimeout(() => setCopyState((p) => ({ ...p, [key]: false })), 2000);
  };

  return (
    <div role="tabpanel" id="prompt-panel" aria-labelledby="prompt-tab" className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="bg-blue-50 dark:bg-blue-950/50 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
Guías para profundizar
          </h3>
          <button
            onClick={async () => {
              const all = deepDivePrompts
                .map((p) => `${p.title}\n\n${p.content}`)
                .join("\n\n---\n\n");
              await copy(all);
              setCopied("all");
            }}
            className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              copyState["all"]
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
            }`}
          >
            {copyState["all"] ? <FaCheck className="w-4 h-4 mr-1" /> : <FaCopy className="w-4 h-4 mr-1" />}
            {copyState["all"] ? "Copiado" : "Copiar Todos"}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {deepDivePrompts.map((p) => {
          const c = colorsFor(p.number);
          const key = `p-${p.number}`;
          const fullText = `${p.title}\n\n${p.content}`;
          return (
            <div
              key={p.number}
              className={`${c.bg} rounded-xl border-2 ${c.border} shadow-sm overflow-hidden`}
            >
              <div className={`${c.header} px-5 py-3 border-b ${c.border}`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center justify-center w-8 h-8 ${c.text} font-bold text-sm rounded-full ${c.bg} border-2 ${c.border}`}>
                      {p.number}
                    </span>
                    <h4 className={`text-lg font-semibold ${c.text}`}>{p.title}</h4>
                  </div>
                  <button
                    onClick={async () => {
                      await copy(fullText);
                      setCopied(key);
                    }}
                    className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      copyState[key] ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" : c.btn
                    }`}
                  >
                    {copyState[key] ? <FaCheck className="w-3 h-3 mr-1.5" /> : <FaCopy className="w-3 h-3 mr-1.5" />}
                    {copyState[key] ? "Copiado" : "Copiar"}
                  </button>
                </div>
              </div>
              <div className="p-5 bg-white dark:bg-transparent">
                <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                  {p.content}
                </p>
              </div>
            </div>
          );
        })}

        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-8">
          <h4 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4 text-center">
Abrí estas guías en:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-4 py-3 rounded-lg bg-black dark:bg-gray-800 hover:bg-gray-800 text-white text-sm">
              <SiOpenai className="w-4 h-4 mr-2" /> ChatGPT
            </a>
            <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-4 py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm">
              <SiAnthropic className="w-4 h-4 mr-2" /> Claude
            </a>
            <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm">
              <SiGooglegemini className="w-4 h-4 mr-2" /> Gemini
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
