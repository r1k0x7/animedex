"use client";

import { useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  /** Apakah masih ada halaman berikutnya untuk dimuat. */
  hasNextPage: boolean;
  /** Apakah sedang memuat (untuk mencegah pemanggilan ganda). */
  isLoading: boolean;
  /** Callback saat sentinel terlihat. */
  onLoadMore: () => void;
  /** Margin root observer (default memuat sedikit lebih awal). */
  rootMargin?: string;
}

/**
 * Hook infinite scroll berbasis IntersectionObserver.
 * Kembalikan `ref` yang harus dipasang ke elemen sentinel di akhir daftar.
 */
export function useInfiniteScroll({
  hasNextPage,
  isLoading,
  onLoadMore,
  rootMargin = "600px",
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  // Simpan callback terbaru tanpa memicu ulang observer.
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isLoading) {
          onLoadMoreRef.current();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isLoading, rootMargin]);

  return sentinelRef;
}
