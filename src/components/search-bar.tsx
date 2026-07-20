"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  defaultValue?: string;
  placeholder?: string;
  /** Jika true, arahkan ke /search saat submit (dipakai di navbar). */
  navigateOnSubmit?: boolean;
}

/**
 * Search bar yang mengarahkan ke halaman /search saat pengguna menekan
 * Enter. Pencarian realtime ditangani di halaman /search itu sendiri.
 */
export function SearchBar({
  className,
  defaultValue = "",
  placeholder = "Cari donghua…",
  navigateOnSubmit = true,
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = React.useState(defaultValue);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (navigateOnSubmit && q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <form onSubmit={onSubmit} className={cn("relative w-full", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
        aria-label="Cari donghua"
      />
    </form>
  );
}
