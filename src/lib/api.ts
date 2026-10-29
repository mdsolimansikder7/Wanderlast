/**
 * Dynamic API Base URL resolution for Server and Client Components.
 * Falls back to the deployed Vercel backend if not specified in environment.
 */
export function getApiUrl(): string {
  const envUrl =
    (typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.API_URL || process.env.NEXT_PUBLIC_API_URL) || "";

  const trimmed = envUrl.trim().replace(/\/+$/, "");

  if (trimmed) {
    return trimmed;
  }

  return "https://wanderlust-backend-olive.vercel.app";
}

export const API_BASE_URL = getApiUrl();
