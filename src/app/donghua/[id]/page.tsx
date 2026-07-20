import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Calendar, Clock, Film, Star, Tv, Users } from "lucide-react";

import { getDonghuaById, getPopularDonghua } from "@/lib/anilist";
import {
  cleanDescription,
  formatCompact,
  formatFuzzyDate,
  preferredTitle,
  roleLabel,
  scoreToStars,
  statusLabel,
  statusVariant,
} from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CharacterCard } from "@/components/character-card";

export const revalidate = 3600;

// Pre-render 20 donghua terpopuler saat build (SSG), sisanya on-demand ISR.
export async function generateStaticParams() {
  try {
    const popular = await getPopularDonghua(1, 20);
    return popular.items.map((m) => ({ id: String(m.id) }));
  } catch {
    return [];
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const media = await getDonghuaById(Number(id));
  if (!media) {
    return { title: "Donghua tidak ditemukan" };
  }
  const title = preferredTitle(media.title);
  const description = cleanDescription(media.description).slice(0, 160);
  const image = media.coverImage.extraLarge || media.coverImage.large;

  return {
    title,
    description:
      description || `Informasi lengkap donghua ${title} di DonghuaWiki ID.`,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function DonghuaDetailPage({ params }: PageProps) {
  const { id } = await params;
  const media = await getDonghuaById(Number(id));

  if (!media) notFound();

  const title = preferredTitle(media.title);
  const cover = media.coverImage.extraLarge || media.coverImage.large;
  const description = cleanDescription(media.description);
  const studios = media.studios.nodes.filter((s) => s.isAnimationStudio);
  const characters = media.characters.edges;

  return (
    <article className="pb-8">
      {/* Banner */}
      <div className="relative h-40 w-full bg-muted sm:h-56 md:h-72 lg:h-80">
        {media.bannerImage ? (
          <Image
            src={media.bannerImage}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/20 to-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="container">
        <div className="-mt-20 flex flex-col gap-6 sm:-mt-24 sm:flex-row md:-mt-28">
          {/* Cover */}
          <div className="mx-auto w-40 shrink-0 sm:mx-0 sm:w-48 md:w-56">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border bg-muted shadow-lg">
              {cover ? (
                <Image
                  src={cover}
                  alt={title}
                  fill
                  priority
                  sizes="224px"
                  className="object-cover"
                />
              ) : null}
            </div>
          </div>

          {/* Info utama */}
          <div className="flex-1 space-y-4 pt-2 sm:pt-24 md:pt-28">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-4xl">
                {title}
              </h1>
              {media.title.english && media.title.english !== title ? (
                <p className="text-muted-foreground">{media.title.english}</p>
              ) : null}
              {media.title.native ? (
                <p className="text-sm text-muted-foreground">
                  {media.title.native}
                </p>
              ) : null}
            </div>

            {/* Stat cepat */}
            <div className="flex flex-wrap gap-2">
              <Badge variant={statusVariant(media.status)}>
                {statusLabel(media.status)}
              </Badge>
              {media.averageScore ? (
                <Badge variant="outline" className="gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {scoreToStars(media.averageScore)} / 10
                </Badge>
              ) : null}
              {media.format ? (
                <Badge variant="outline">{media.format}</Badge>
              ) : null}
            </div>

            {/* Genre */}
            <div className="flex flex-wrap gap-2">
              {media.genres.map((g) => (
                <Link key={g} href={`/search?q=${encodeURIComponent(g)}`}>
                  <Badge variant="secondary" className="hover:bg-primary/20">
                    {g}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Meta grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <MetaItem
            icon={<Tv className="h-4 w-4" />}
            label="Episode"
            value={media.episodes ? String(media.episodes) : "?"}
          />
          <MetaItem
            icon={<Clock className="h-4 w-4" />}
            label="Durasi"
            value={media.duration ? `${media.duration} mnt` : "?"}
          />
          <MetaItem
            icon={<Star className="h-4 w-4" />}
            label="Skor"
            value={scoreToStars(media.averageScore)}
          />
          <MetaItem
            icon={<Users className="h-4 w-4" />}
            label="Popularitas"
            value={formatCompact(media.popularity)}
          />
          <MetaItem
            icon={<Calendar className="h-4 w-4" />}
            label="Rilis"
            value={formatFuzzyDate(media.startDate)}
          />
          <MetaItem
            icon={<Film className="h-4 w-4" />}
            label="Studio"
            value={studios[0]?.name ?? "?"}
          />
        </div>

        <Separator className="my-8" />

        {/* Sinopsis */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold">Sinopsis</h2>
          {description ? (
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : (
            <p className="text-muted-foreground">Sinopsis belum tersedia.</p>
          )}
        </section>

        {/* Karakter */}
        {characters.length > 0 ? (
          <>
            <Separator className="my-8" />
            <section className="space-y-4">
              <h2 className="text-xl font-bold">Daftar Karakter</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {characters.map(({ node, role }) => (
                  <CharacterCard
                    key={node.id}
                    id={node.id}
                    name={
                      node.name.userPreferred ||
                      node.name.full ||
                      "Tanpa Nama"
                    }
                    image={node.image.large || node.image.medium}
                    subtitle={roleLabel(role)}
                  />
                ))}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </article>
  );
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-1 line-clamp-1 font-semibold">{value}</p>
    </div>
  );
    }
  
