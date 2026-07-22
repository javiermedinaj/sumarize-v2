# YT-AI-RESUME — prototype-next

Migración del proyecto original (Express + MongoDB + Azure OpenAI) a un único
proyecto **Next.js 15 (App Router) + TypeScript + Tailwind** pensado para
testear localmente con un stack **100% gratuito** y **sin Docker**.

## Stack

- **Next.js 15** (App Router, Route Handlers, Server Components)
- **TypeScript** + **Tailwind CSS**
- **Groq** (`groq-sdk`) como proveedor de IA (free tier)
- **`youtube-transcript`** para el transcript (sin API key, sin Google API)
- **Invidious** (instancias públicas) para metadata del video (sin Google API)
- **JSON files** en `/data` como storage (sin MongoDB)
- **Sin Docker**

## Setup

```bash
cd prototype-next
cp .env.example .env.local
# editá .env.local y poné tu GROQ_API_KEY (sacala gratis de https://console.groq.com/keys)

npm install
npm run dev
```

Abrí http://localhost:3000.

## Variables de entorno

| Var | Default | Descripción |
|---|---|---|
| `GROQ_API_KEY` | — | API key de Groq (obligatoria) |
| `GROQ_MODEL` | `llama-3.1-8b-instant` | Modelo. Otros válidos: `llama-3.3-70b-versatile`, `mixtral-8x7b-32768` |
| `INVIDIOUS_INSTANCES` | `https://yewtu.be,https://invidious.fdn.fr,https://invidious.protokolla.fi` | Lista separada por coma, la primera que responda gana |
| `UPSTASH_REDIS_REST_URL` | — | URL REST de Upstash Redis. Obligatoria en producción para limitar abusos. |
| `UPSTASH_REDIS_REST_TOKEN` | — | Token REST de Upstash Redis. Obligatorio en producción. |

## Endpoints

- `POST /api/process` — recibe `{ videoUrl }`, devuelve summary + flashcards + deep dive prompts. Está limitado a **10 análisis por IP por hora** en producción.

## Storage

Cada video procesado se guarda como `data/{videoId}.json` con la forma:

```json
{
  "videoId": "...",
  "videoUrl": "...",
  "title": "...",
  "subtitles": "...",
  "summary": "...",
  "deepDivePrompts": [{ "number": 1, "title": "...", "content": "..." }],
  "flashcards": [{ "question": "...", "answer": "..." }],
  "createdAt": "ISO-8601"
}
```

El endpoint hace cache hit cuando el JSON ya está completo. La transcripción se conserva solo en el almacenamiento interno y no se devuelve al navegador.

## Notas

- No se usa la API oficial de YouTube en ningún punto.
- No usa Azure OpenAI. Se puede cambiar de proveedor tocando sólo `lib/groq.ts`.
- Los archivos de `/data` están ignorados por git. En plataformas serverless como Vercel son efímeros y no deben considerarse almacenamiento persistente.
- Para producción, creá una base de datos gratuita en [Upstash](https://upstash.com/), configurá las dos variables `UPSTASH_REDIS_REST_*` en Vercel y en el entorno local. Sin ellas, `/api/process` responde `503` en producción para evitar desplegar una API de Groq sin protección.
