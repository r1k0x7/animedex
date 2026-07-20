import type { FuzzyDate, MediaStatus, MediaTitle } from "@/types/anilist";

/** Ambil judul paling relevan (romaji > english > native). */
export function preferredTitle(title: MediaTitle | null | undefined): string {
  if (!title) return "Tanpa Judul";
  return title.romaji || title.english || title.native || "Tanpa Judul";
}

/** Terjemahkan status media AniList ke label bahasa Indonesia. */
export function statusLabel(status: MediaStatus | null | undefined): string {
  switch (status) {
    case "RELEASING":
      return "Sedang Tayang";
    case "FINISHED":
      return "Selesai";
    case "NOT_YET_RELEASED":
      return "Belum Tayang";
    case "CANCELLED":
      return "Dibatalkan";
    case "HIATUS":
      return "Hiatus";
    default:
      return "Tidak Diketahui";
  }
}

/** Warna badge berdasarkan status. */
export function statusVariant(
  status: MediaStatus | null | undefined,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "RELEASING":
      return "default";
    case "FINISHED":
      return "secondary";
    case "CANCELLED":
      return "destructive";
    default:
      return "outline";
  }
}

/** Ubah skor 0–100 menjadi format bintang 0–10. */
export function scoreToStars(score: number | null | undefined): string {
  if (!score) return "—";
  return (score / 10).toFixed(1);
}

/** Format angka besar menjadi ringkas (mis. 12500 -> 12,5rb). */
export function formatCompact(value: number | null | undefined): string {
  if (value == null) return "—";
  if (value >= 1_000_000)
    return `${(value / 1_000_000).toFixed(1).replace(".", ",")}jt`;
  if (value >= 1_000)
    return `${(value / 1_000).toFixed(1).replace(".", ",")}rb`;
  return value.toString();
}

/** Format FuzzyDate AniList menjadi teks yang mudah dibaca. */
export function formatFuzzyDate(date: FuzzyDate | null | undefined): string {
  if (!date || !date.year) return "—";
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const parts: string[] = [];
  if (date.day) parts.push(String(date.day));
  if (date.month) parts.push(months[date.month - 1] ?? "");
  parts.push(String(date.year));
  return parts.join(" ");
}

/**
 * Bersihkan deskripsi AniList dari tag HTML/markdown sederhana
 * dan spoiler penanda, lalu kembalikan teks bersih.
 */
export function cleanDescription(
  description: string | null | undefined,
): string {
  if (!description) return "";
  return description
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/~![\s\S]*?!~/g, "")
    .replace(/__(.*?)__/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .trim();
}

/** Label role karakter dalam bahasa Indonesia. */
export function roleLabel(
  role: "MAIN" | "SUPPORTING" | "BACKGROUND" | null | undefined,
): string {
  switch (role) {
    case "MAIN":
      return "Utama";
    case "SUPPORTING":
      return "Pendukung";
    case "BACKGROUND":
      return "Latar";
    default:
      return "";
  }
}
