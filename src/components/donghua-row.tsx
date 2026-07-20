import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { MediaSummary } from "@/types/anilist";
import { DonghuaCard } from "@/components/donghua-card";

interface DonghuaRowProps {
  title: string;
  items: MediaSummary[];
  href?: string;
  priority?: boolean;
}

/**
 * Section beranda: judul + scroller horizontal berisi kartu donghua.
 * Scroll-snap membuat pengalaman geser nyaman di mobile.
 */
export function DonghuaRow({ title, items, href, priority }: DonghuaRowProps) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">
          {title}
        </h2>
        {href ? (
          <Link
            href={href}
            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Lihat semua
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
        {items.map((media, i) => (
          <div
            key={media.id}
            className="w-32 shrink-0 snap-start sm:w-40 md:w-44"
          >
            <DonghuaCard media={media} priority={priority && i < 4} />
          </div>
        ))}
      </div>
    </section>
  );
}
