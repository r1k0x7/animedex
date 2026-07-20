import type { Metadata } from "next";

import { getCharacters } from "@/lib/anilist";
import { CharacterCard } from "@/components/character-card";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Karakter Favorit",
  description:
    "Daftar karakter anime & donghua paling difavoritkan menurut penggemar AniList.",
};

export default async function CharacterListPage() {
  const { items } = await getCharacters(1, 30).catch(() => ({
    items: [],
    pageInfo: {
      total: 0,
      currentPage: 1,
      lastPage: 1,
      hasNextPage: false,
      perPage: 30,
    },
  }));

  return (
    <div className="container space-y-6 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Karakter Favorit</h1>
        <p className="text-muted-foreground">
          Karakter paling dicintai penggemar menurut AniList.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((c, i) => (
          <CharacterCard
            key={c.id}
            id={c.id}
            name={c.name.userPreferred || c.name.full || "Tanpa Nama"}
            image={c.image.large || c.image.medium}
            subtitle={c.name.native}
            priority={i < 6}
          />
        ))}
      </div>
    </div>
  );
}
