export function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      return id || null;
    }
    if (
      u.hostname.endsWith("youtube.com") ||
      u.hostname.endsWith("youtube-nocookie.com")
    ) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const m = u.pathname.match(/\/(shorts|embed|v)\/([^/?]+)/);
      if (m) return m[2];
    }
    return null;
  } catch {
    return null;
  }
}
