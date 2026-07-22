"use client";

import React, { useState } from "react";
import { FaDownload, FaCopy } from "react-icons/fa";
import type { Flashcard, DeepDivePrompt } from "./types";
import { PromptDisplay } from "./PromptDisplay";
import type { TabType } from "./ContentTabs";

type Props = {
  activeTab: TabType;
  summary?: string;
  flashcards?: Flashcard[];
  deepDivePrompts?: DeepDivePrompt[];
};

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  }
}

function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}



function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-gray-800 dark:text-gray-200">
        {p.replace(/\*\*/g, "")}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const out: React.ReactNode[] = [];
  let bullets: string[] = [];
  let numbered: string[] = [];
  let bKey = 0;
  let nKey = 0;

  const flush = () => {
    if (bullets.length) {
      out.push(
        <ul key={`b-${bKey++}`} className="list-disc ml-6 mb-4 space-y-2">
          {bullets.map((b, i) => (
            <li key={i} className="text-gray-700 dark:text-gray-200 leading-relaxed">
              {renderInline(b)}
            </li>
          ))}
        </ul>,
      );
      bullets = [];
    }
    if (numbered.length) {
      out.push(
        <ol key={`n-${nKey++}`} className="list-decimal ml-6 mb-4 space-y-3">
          {numbered.map((b, i) => (
            <li key={i} className="text-gray-700 dark:text-gray-200 leading-relaxed">
              {renderInline(b)}
            </li>
          ))}
        </ol>,
      );
      numbered = [];
    }
  };

  lines.forEach((line, idx) => {
    const t = line.trim();
    if (!t) {
      flush();
      out.push(<br key={`br-${idx}`} />);
    } else if (t.startsWith("## ")) {
      flush();
      out.push(
        <h3
          key={`h3-${idx}`}
          className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-4 pb-2 border-b border-gray-200 dark:border-gray-800"
        >
          {t.substring(3)}
        </h3>,
      );
    } else if (t.startsWith("### ")) {
      flush();
      out.push(
        <h4
          key={`h4-${idx}`}
          className="text-lg font-semibold text-gray-700 dark:text-gray-200 mt-5 mb-3"
        >
          {t.substring(4)}
        </h4>,
      );
    } else if (t.startsWith("- ") || t.startsWith("* ")) {
      bullets.push(t.substring(2).trim());
    } else if (/^\d+\.\s/.test(t)) {
      // If the line already starts with a number, treat it as a bullet
      // (avoid double numbering when the LLM adds its own numbering).
      bullets.push(t.replace(/^\d+\.\s*/, "").trim());
    } else {
      flush();
      out.push(
        <p
          key={`p-${idx}`}
          className="text-gray-700 dark:text-gray-200 mb-4 leading-relaxed text-base"
        >
          {renderInline(t)}
        </p>,
      );
    }
  });
  flush();
  return out;
}

function ActionBar({
  text,
  filename,
}: {
  text: string;
  filename: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={async () => {
          await copyText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          copied
            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700"
        }`}
        title="Copiar"
      >
        <FaCopy className="w-3 h-3 mr-1.5" />
        {copied ? "Copiado" : "Copiar"}
      </button>
      <button
        onClick={() => downloadBlob(text, `${filename}.md`, "text/markdown")}
        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700"
        title="Markdown"
      >
        <FaDownload className="w-3 h-3 mr-1.5" /> MD
      </button>

    </div>
  );
}

export const ContentDisplay: React.FC<Props> = ({
  activeTab,
  summary,
  flashcards,
  deepDivePrompts,
}) => {
  if (activeTab === "summary" && summary) {
    return (
      <div role="tabpanel" id="summary-panel" aria-labelledby="summary-tab" className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="bg-green-50 dark:bg-green-900 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Resumen
            </h3>
            <ActionBar text={summary} filename="resumen" />
          </div>
        </div>
        <div className="p-6 sm:p-8">{renderMarkdown(summary)}</div>
      </div>
    );
  }

  if (activeTab === "flashcards" && flashcards && flashcards.length > 0) {
    const text = flashcards
      .map(
        (c, i) => `Pregunta ${i + 1}: ${c.question}\nRespuesta: ${c.answer}\n`,
      )
      .join("\n---\n\n");

    return (
      <div role="tabpanel" id="flashcards-panel" aria-labelledby="flashcards-tab" className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="bg-purple-50 dark:bg-purple-950/50 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              Flashcards
              <span className="ml-2 px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                {flashcards.length} tarjetas
              </span>
            </h3>
            <ActionBar text={text} filename="flashcards" />
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {flashcards.map((c, i) => (
              <div
                key={i}
                className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full mr-3">
                        Q{i + 1}
                      </span>
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                        Pregunta
                      </span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                      {c.question}
                    </p>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                    <div className="flex items-center mb-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full mr-3">
                        A
                      </span>
                      <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                        Respuesta
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {c.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "prompt" && deepDivePrompts && deepDivePrompts.length > 0) {
    return <PromptDisplay deepDivePrompts={deepDivePrompts} />;
  }

  return null;
};
