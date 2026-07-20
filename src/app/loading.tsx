import { BannerSkeleton, DonghuaRowSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container space-y-12 py-6 md:py-8">
      <div className="space-y-6">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <Skeleton className="mx-auto h-10 w-3/4" />
          <Skeleton className="mx-auto h-4 w-full" />
          <Skeleton className="mx-auto h-9 w-full max-w-md" />
        </div>
        <BannerSkeleton />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-7 w-48" />
        <DonghuaRowSkeleton />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-7 w-48" />
        <DonghuaRowSkeleton />
      </div>
    </div>
  );
}
