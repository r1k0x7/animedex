import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton satu kartu donghua (rasio poster 2:3). */
export function DonghuaCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

/** Skeleton grid berisi `count` kartu. */
export function DonghuaGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <DonghuaCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Skeleton scroller horizontal untuk section beranda. */
export function DonghuaRowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-32 shrink-0 space-y-2 sm:w-40">
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton banner carousel di beranda. */
export function BannerSkeleton() {
  return <Skeleton className="aspect-[21/9] w-full rounded-xl md:aspect-[3/1]" />;
}

/** Skeleton kartu karakter (foto bulat). */
export function CharacterGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center space-y-2">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton halaman detail donghua. */
export function DonghuaDetailSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="aspect-[3/1] w-full rounded-none" />
      <div className="container">
        <div className="flex flex-col gap-6 sm:flex-row">
          <Skeleton className="mx-auto aspect-[2/3] w-48 shrink-0 rounded-lg sm:mx-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
