import type { ProcessResponse } from "./types";

export async function processVideo(videoUrl: string): Promise<ProcessResponse> {
  const res = await fetch("/api/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoUrl }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}
