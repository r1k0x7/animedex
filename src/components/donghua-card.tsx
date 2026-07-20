import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import type { MediaSummary } from "@/types/anilist";
import { preferredTitle, statusLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface DonghuaCardProps {
  media: MediaSummary;
  className?: string;
  /** Prioritaskan pemuatan gambar (untuk item di atas lipatan). */
  priority?: boolean;
}

/** Kartu poster donghua dengan skor, judul, dan status. */
export function DonghuaCard({ media, className, priority }: DonghuaCardProps) {
  const title = preferredTitle(media.title);
  const cover =
    media.coverImage.extraLarge ||
    media.coverImage.large ||
    media.coverImage.medium;

  return (
    <Link
      href={`/donghua/${media.id}`}
      className={cn(
        "group block overflow-hidden rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-muted">
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 200px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            Tanpa Gambar
          </div>
        )}

        {media.averageScore ? (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-white backdrop-blur">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {(media.averageScore / 10).toFixed(1)}
          </div>
        ) : null}

        {media.status ? (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <Badge variant="secondary" className="text-[10px]">
              {statusLabel(media.status)}
            </Badge>
          </div>
        ) : null}
      </div>

      <div className="mt-2 space-y-0.5">
        <h3 className="line-clamp-2 text-sm font-semibold leading-tight group-hover:text-primary">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {media.episodes ? `${media.episodes} episode` : "Episode ?"}
          {media.seasonYear ? ` • ${media.seasonYear}` : ""}
        </p>
      </div>
    </Link>
  );
}
