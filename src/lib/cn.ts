export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function pad(n: number, size = 2) {
  return String(n).padStart(size, "0");
}
