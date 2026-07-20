import type { MediaSummary } from "@/types/anilist";
import { DonghuaCard } from "@/components/donghua-card";
import { cn } from "@/lib/utils";

interface DonghuaGridProps {
  items: MediaSummary[];
  className?: string;
  priorityCount?: number;
}

/** Grid responsif berisi kartu donghua. */
export function DonghuaGrid({
  items,
  className,
  priorityCount = 0,
}: DonghuaGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
        className,
      )}
    >
      {items.map((media, i) => (
        <DonghuaCard
          key={media.id}
          media={media}
          priority={i < priorityCount}
        />
      ))}
    </div>
  );
}
