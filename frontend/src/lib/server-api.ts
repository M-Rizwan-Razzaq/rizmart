/**
 * Server-only fetch helper. Reads from the same backend the client uses and
 * unwraps the `{ success, data, timestamp }` envelope.
 */
const SERVER_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export async function fetchApiData<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${SERVER_BASE_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: T };
    return json?.data ?? null;
  } catch {
    return null;
  }
}