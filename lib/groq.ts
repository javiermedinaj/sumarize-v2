import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  // We don't throw at import time so the build doesn't break,
  // the route handler will throw a clean error instead.
}

let _client: Groq | null = null;
function client() {
  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not set. Add it to .env.local (see .env.example).",
    );
  }
  if (!_client) _client = new Groq({ apiKey });
  return _client;
}

function model() {
  return process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
}

// Cap input to avoid blowing past TPM limits on free tier.
// 12k chars ≈ 3k tokens, fits comfortably in any model's window
// and still gives the LLM enough context for a good summary.
const MAX_INPUT_CHARS = 12_000;

function trim(text: string): string {
  if (text.length <= MAX_INPUT_CHARS) return text;
  const head = text.slice(0, MAX_INPUT_CHARS * 0.7);
  const tail = text.slice(-MAX_INPUT_CHARS * 0.3);
  return `${head}\n\n[...contenido recortado...]\n\n${tail}`;
}

async function chat(
  system: string,
  user: string,
  opts: { temperature?: number; maxTokens?: number; json?: boolean } = {},
) {
  const res = await client().chat.completions.create({
    model: model(),
    messages: [
      { role: "system", content: system },
      { role: "user", content: trim(user) },
    ],
    temperature: opts.temperature ?? 0.7,
    max_tokens: opts.maxTokens ?? 1500,
    response_format: opts.json ? { type: "json_object" } : undefined,
  });
  return res.choices[0]?.message?.content ?? "";
}

const SUMMARY_SYSTEM = `Eres un experto analista de contenido. Genera un resumen ejecutivo profesional en español, en markdown, con esta estructura EXACTA:

## Resumen
- 2-3 oraciones con la esencia.

## Puntos Clave
- Lista numerada (7-8 puntos) cubriendo TODOS los temas mencionados.

## Insights Destacados
- Análisis de ideas valiosas, conexiones e implicaciones.

## Aplicaciones Prácticas
- Cómo aplicar la información con pasos accionables.

## Conclusiones
- Reflexiones finales y próximos pasos.`;

const FLASHCARD_SYSTEM = `Eres un experto en diseño instruccional. Crea flashcards de alta calidad en español que promuevan pensamiento crítico. Respondes EXCLUSIVAMENTE con un JSON válido con la forma:
{ "flashcards": [ { "question": "...", "answer": "..." }, ... ] }
- question: pregunta clara y específica
- answer: respuesta concisa (máximo 2-3 oraciones)
- Incluye variedad: conceptos, aplicaciones, comparaciones, casos de uso, problemas/soluciones.`;

const DEEPDIVE_SYSTEM = `Eres un experto en diseño de prompts educativos. Crea 5 prompts "Deep Dive" autocontenidos en español. Cada prompt debe incluir TODO el contexto necesario para funcionar solo. Responde EXCLUSIVAMENTE con un JSON válido con la forma:
{
  "prompts": [
    { "number": 1, "title": "ANÁLISIS GENERAL", "content": "..." },
    { "number": 2, "title": "ANÁLISIS CRÍTICO", "content": "..." },
    { "number": 3, "title": "APLICACIÓN PRÁCTICA", "content": "..." },
    { "number": 4, "title": "CONTEXTO AMPLIADO", "content": "..." },
    { "number": 5, "title": "PENSAMIENTO CRÍTICO", "content": "..." }
  ]
}
Cada content debe tener entre 150-250 palabras: contexto resumido + instrucciones + entregable esperado.`;

export async function summarizeText(text: string): Promise<string> {
  if (text.length < 50) throw new Error("Content too short");
  return chat(
    SUMMARY_SYSTEM,
    `Analiza y resume:\n\n${text}`,
    { maxTokens: 1500 },
  );
}

export async function generateFlashcards(
  text: string,
  count = 6,
): Promise<{ question: string; answer: string }[]> {
  if (text.length < 50) throw new Error("Content too short");
  const out = await chat(
    FLASHCARD_SYSTEM,
    `Crea ${count} flashcards de alta calidad basadas en este contenido. Responde SOLO JSON.\n\n${text}`,
    { maxTokens: 1500, json: true, temperature: 0.6 },
  );
  return extractJsonArray(out, "flashcards");
}

export async function generateDeepDivePrompts(
  text: string,
): Promise<{ number: number; title: string; content: string }[]> {
  if (text.length < 50) throw new Error("Content too short");
  const out = await chat(
    DEEPDIVE_SYSTEM,
    `Genera los 5 prompts Deep Dive autocontenidos. Responde SOLO JSON.\n\n${text}`,
    { maxTokens: 2500, json: true, temperature: 0.8 },
  );
  return extractJsonArray(out, "prompts");
}

function extractJsonArray<T>(raw: string, key: string): T[] {
  const cleaned = raw
    .replace(/```json\s*/g, "")
    .replace(/```\s*$/g, "")
    .trim();
  try {
    const parsed = JSON.parse(cleaned);
    const arr = Array.isArray(parsed) ? parsed : parsed[key];
    if (Array.isArray(arr)) return arr as T[];
  } catch {}
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      const arr = Array.isArray(parsed) ? parsed : parsed[key];
      if (Array.isArray(arr)) return arr as T[];
    } catch {}
  }
  return [];
}
