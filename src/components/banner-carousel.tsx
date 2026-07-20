"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { Star } from "lucide-react";

import type { MediaSummary } from "@/types/anilist";
import { preferredTitle } from "@/lib/format";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BannerCarouselProps {
  items: MediaSummary[];
}

/** Banner carousel besar di bagian atas beranda (autoplay). */
export function BannerCarousel({ items }: BannerCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  );

  const withBanner = items.filter((m) => m.bannerImage).slice(0, 6);
  if (withBanner.length === 0) return null;

  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[plugin.current]}
      className="w-full"
    >
      <CarouselContent>
        {withBanner.map((media) => {
          const title = preferredTitle(media.title);
          return (
            <CarouselItem key={media.id}>
              <Link
                href={`/donghua/${media.id}`}
                className="group relative block aspect-[21/9] w-full overflow-hidden rounded-xl bg-muted shadow-lg ring-1 ring-border/50 md:aspect-[3/1]"
              >
                <Image
                  src={media.bannerImage as string}
                  alt={title}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 space-y-2 p-4 md:p-8">
                  <div className="flex flex-wrap gap-2">
                    {media.averageScore ? (
                      <Badge className="gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        {(media.averageScore / 10).toFixed(1)}
                      </Badge>
                    ) : null}
                    {media.genres.slice(0, 3).map((g) => (
                      <Badge key={g} variant="secondary">
                        {g}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="max-w-2xl text-xl font-bold text-white drop-shadow md:text-4xl">
                    {title}
                  </h2>
                  <Button size="sm" className="mt-2">
                    Lihat Detail
                  </Button>
                </div>
              </Link>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}
