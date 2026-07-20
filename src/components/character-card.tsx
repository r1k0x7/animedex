import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface CharacterCardProps {
  id: number;
  name: string;
  image: string | null;
  subtitle?: string | null;
  className?: string;
  priority?: boolean;
}

/** Kartu karakter dengan foto dan nama. */
export function CharacterCard({
  id,
  name,
  image,
  subtitle,
  className,
  priority,
}: CharacterCardProps) {
  return (
    <Link
      href={`/character/${id}`}
      className={cn(
        "group block overflow-hidden rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-muted shadow-sm ring-1 ring-border/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-black/20 group-hover:ring-primary/40">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 180px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority={priority}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            Tanpa Foto
          </div>
        )}
      </div>
      <div className="mt-2 space-y-0.5 text-center">
        <h3 className="line-clamp-1 text-sm font-semibold group-hover:text-primary">
          {name}
        </h3>
        {subtitle ? (
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
