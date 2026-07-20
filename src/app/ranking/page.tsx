import Link from "next/link";
import type { Metadata } from "next";
import { Flame, Trophy } from "lucide-react";

import { getMostPopularDonghua, getTopRatedDonghua } from "@/lib/anilist";
import {
  InfiniteDonghuaGrid,
  type LoaderKind,
} from "@/components/infinite-donghua-grid";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Ranking Donghua",
  description:
    "Peringkat donghua dengan rating tertinggi dan paling populer menurut AniList.",
};

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

const TABS = [
  {
    key: "top-rated" as const,
    label: "Rating Tertinggi",
    icon: Trophy,
  },
  {
    key: "popular" as const,
    label: "Paling Populer",
    icon: Flame,
  },
];

export default async function RankingPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const activeTab = tab === "popular" ? "popular" : "top-rated";

  const EMPTY = {
    items: [],
    pageInfo: {
      total: 0,
      currentPage: 1,
      lastPage: 1,
      hasNextPage: false,
      perPage: 24,
    },
  };

  const initial = await (activeTab === "popular"
    ? getMostPopularDonghua(1, 24)
    : getTopRatedDonghua(1, 24)
  ).catch(() => EMPTY);

  const kind: LoaderKind = activeTab === "popular" ? "popular" : "top-rated";

  return (
    <div className="container space-y-6 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Ranking Donghua</h1>
        <p className="text-muted-foreground">
          Peringkat berdasarkan skor dan popularitas dari AniList.
        </p>
      </div>

      {/* Tab navigasi */}
      <div className="inline-flex rounded-lg border bg-muted p-1">
        {TABS.map((t) => {
          const active = t.key === activeTab;
          const Icon = t.icon;
          return (
            <Link
              key={t.key}
              href={`/ranking?tab=${t.key}`}
              scroll={false}
              className={cn(
                "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </Link>
          );
        })}
      </div>

      {/* Grid ranking dengan infinite scroll. `key` memaksa reset saat tab berganti. */}
      <InfiniteDonghuaGrid
        key={kind}
        kind={kind}
        initialItems={initial.items}
        initialHasNextPage={initial.pageInfo.hasNextPage}
      />
    </div>
  );
    }
                  
