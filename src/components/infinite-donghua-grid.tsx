"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import type { MediaSummary, PagedResult } from "@/types/anilist";
import {
  getPopularDonghua,
  getRecentDonghua,
  getTopRatedDonghua,
  getTrendingDonghua,
  searchDonghua,
} from "@/lib/anilist";
import { DonghuaGrid } from "@/components/donghua-grid";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

export type LoaderKind =
  | "trending"
  | "popular"
  | "recent"
  | "top-rated"
  | "search";

const LOADERS: Record<
  LoaderKind,
  (page: number, arg?: string) => Promise<PagedResult<MediaSummary>>
> = {
  trending: (page) => getTrendingDonghua(page),
  popular: (page) => getPopularDonghua(page),
  recent: (page) => getRecentDonghua(page),
  "top-rated": (page) => getTopRatedDonghua(page),
  search: (page, arg) => searchDonghua(arg ?? "", page),
};

interface InfiniteDonghuaGridProps {
  kind: LoaderKind;
  /** Data awal dari server (untuk SSR/SSG halaman pertama). */
  initialItems: MediaSummary[];
  initialHasNextPage: boolean;
  /** Argumen tambahan, mis. kata kunci pencarian. */
  arg?: string;
}

/**
 * Grid donghua dengan infinite scroll. Halaman pertama dirender di server
 * lalu halaman berikutnya diambil di client langsung dari AniList API.
 */
export function InfiniteDonghuaGrid({
  kind,
  initialItems,
  initialHasNextPage,
  arg,
}: InfiniteDonghuaGridProps) {
  const [items, setItems] = React.useState<MediaSummary[]>(initialItems);
  const [page, setPage] = React.useState(1);
  const [hasNextPage, setHasNextPage] = React.useState(initialHasNextPage);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Reset saat sumber data berganti (mis. kata kunci pencarian baru).
  React.useEffect(() => {
    setItems(initialItems);
    setPage(1);
    setHasNextPage(initialHasNextPage);
    setError(null);
  }, [initialItems, initialHasNextPage, arg, kind]);

  const loadMore = React.useCallback(async () => {
    if (isLoading || !hasNextPage) return;
    setIsLoading(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const result = await LOADERS[kind](nextPage, arg);
      setItems((prev) => {
        const seen = new Set(prev.map((m) => m.id));
        const merged = [...prev];
        for (const m of result.items) {
          if (!seen.has(m.id)) merged.push(m);
        }
        return merged;
      });
      setPage(nextPage);
      setHasNextPage(result.pageInfo.hasNextPage);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat data.");
      setHasNextPage(false);
    } finally {
      setIsLoading(false);
    }
  }, [arg, hasNextPage, isLoading, kind, page]);

  const sentinelRef = useInfiniteScroll({
    hasNextPage,
    isLoading,
    onLoadMore: loadMore,
  });

  return (
    <div className="space-y-6">
      <DonghuaGrid items={items} priorityCount={6} />

      {error ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center text-sm text-muted-foreground">
          <p>{error}</p>
          <button
            onClick={loadMore}
            className="font-medium text-primary hover:underline"
          >
            Coba lagi
          </button>
        </div>
      ) : null}

      <div ref={sentinelRef} className="flex justify-center py-6">
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : !hasNextPage && items.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            Semua data sudah dimuat.
          </p>
        ) : null}
      </div>
    </div>
  );
}
