"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, SearchX } from "lucide-react";

import type { MediaSummary } from "@/types/anilist";
import { searchDonghua } from "@/lib/anilist";
import { useDebounce } from "@/hooks/use-debounce";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { Input } from "@/components/ui/input";
import { DonghuaGrid } from "@/components/donghua-grid";
import { DonghuaGridSkeleton } from "@/components/skeletons";

/**
 * Pencarian donghua realtime. Input di-debounce lalu memanggil AniList API
 * langsung dari client. Mendukung infinite scroll untuk hasil berikutnya.
 */
export function SearchView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [term, setTerm] = React.useState(initialQuery);
  const debouncedTerm = useDebounce(term, 450);

  const [items, setItems] = React.useState<MediaSummary[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasNextPage, setHasNextPage] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Sinkronkan kata kunci ke URL (shareable), tanpa reload halaman.
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedTerm.trim()) params.set("q", debouncedTerm.trim());
    router.replace(`/search${params.toString() ? `?${params}` : ""}`, {
      scroll: false,
    });
  }, [debouncedTerm, router]);

  // Pencarian baru setiap kali kata kunci (debounced) berubah.
  React.useEffect(() => {
    const q = debouncedTerm.trim();
    if (!q) {
      setItems([]);
      setHasNextPage(false);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);
    setError(null);

    searchDonghua(q, 1)
      .then((result) => {
        if (cancelled) return;
        setItems(result.items);
        setPage(1);
        setHasNextPage(result.pageInfo.hasNextPage);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
        setItems([]);
        setHasNextPage(false);
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedTerm]);

  const loadMore = React.useCallback(async () => {
    const q = debouncedTerm.trim();
    if (isLoading || isSearching || !hasNextPage || !q) return;
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const result = await searchDonghua(q, nextPage);
      setItems((prev) => {
        const seen = new Set(prev.map((m) => m.id));
        return [...prev, ...result.items.filter((m) => !seen.has(m.id))];
      });
      setPage(nextPage);
      setHasNextPage(result.pageInfo.hasNextPage);
    } catch {
      setHasNextPage(false);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedTerm, hasNextPage, isLoading, isSearching, page]);

  const sentinelRef = useInfiniteScroll({
    hasNextPage,
    isLoading,
    onLoadMore: loadMore,
  });

  const showEmpty =
    !isSearching && debouncedTerm.trim() !== "" && items.length === 0 && !error;

  return (
    <div className="space-y-6">
      <div className="relative mx-auto max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Ketik judul donghua…"
          className="h-12 pl-11 text-base"
          aria-label="Cari donghua"
        />
        {isSearching ? (
          <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : null}
      </div>

      {isSearching && items.length === 0 ? (
        <DonghuaGridSkeleton count={12} />
      ) : null}

      {error ? (
        <p className="py-10 text-center text-sm text-destructive">{error}</p>
      ) : null}

      {showEmpty ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
          <SearchX className="h-10 w-10" />
          <p>
            Tidak ada donghua untuk{" "}
            <span className="font-semibold">&ldquo;{debouncedTerm}&rdquo;</span>
            .
          </p>
        </div>
      ) : null}

      {items.length > 0 ? (
        <>
          <DonghuaGrid items={items} priorityCount={6} />
          <div ref={sentinelRef} className="flex justify-center py-6">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : null}
          </div>
        </>
      ) : null}

      {!debouncedTerm.trim() && !isSearching ? (
        <p className="py-16 text-center text-muted-foreground">
          Mulai ketik untuk mencari donghua favoritmu.
        </p>
      ) : null}
    </div>
  );
}
