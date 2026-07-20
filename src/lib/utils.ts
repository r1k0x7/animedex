import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Gabungkan className Tailwind dengan aman (dipakai komponen Shadcn UI). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
