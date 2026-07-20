import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Heart } from "lucide-react";

import { getCharacterById } from "@/lib/anilist";
import { cleanDescription, formatCompact, roleLabel } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DonghuaCard } from "@/components/donghua-card";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacterById(Number(id));
  if (!character) return { title: "Karakter tidak ditemukan" };

  const name =
    character.name.userPreferred || character.name.full || "Karakter";
  const description = cleanDescription(character.description).slice(0, 160);
  const image = character.image.large || character.image.medium;

  return {
    title: name,
    description: description || `Profil karakter ${name} di DonghuaWiki ID.`,
    openGraph: {
      title: name,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function CharacterDetailPage({ params }: PageProps) {
  const { id } = await params;
  const character = await getCharacterById(Number(id));

  if (!character) notFound();

  const name =
    character.name.userPreferred || character.name.full || "Tanpa Nama";
  const image = character.image.large || character.image.medium;
  const description = cleanDescription(character.description);
  const mediaEdges = character.media.edges;

  return (
    <div className="container space-y-8 py-8">
      <div className="flex flex-col gap-6 sm:flex-row">
        {/* Foto karakter */}
        <div className="mx-auto w-40 shrink-0 sm:mx-0 sm:w-56">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border bg-muted shadow">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                priority
                sizes="224px"
                className="object-cover"
              />
            ) : null}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
            {character.name.native ? (
              <p className="text-lg text-muted-foreground">
                {character.name.native}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {character.gender ? (
              <Badge variant="secondary">{character.gender}</Badge>
            ) : null}
            {character.age ? (
              <Badge variant="secondary">Umur: {character.age}</Badge>
            ) : null}
            {character.favourites ? (
              <Badge variant="outline" className="gap-1">
                <Heart className="h-3 w-3 fill-primary text-primary" />
                {formatCompact(character.favourites)}
              </Badge>
            ) : null}
          </div>

          {description ? (
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : (
            <p className="text-muted-foreground">Deskripsi belum tersedia.</p>
          )}
        </div>
      </div>

      {mediaEdges.length > 0 ? (
        <>
          <Separator />
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Donghua & Anime yang Diikuti</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {mediaEdges.map(({ node, characterRole }) => (
                <div key={node.id} className="space-y-1">
                  <DonghuaCard media={node} />
                  {characterRole ? (
                    <p className="text-center text-xs text-muted-foreground">
                      {roleLabel(characterRole)}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
                          }
