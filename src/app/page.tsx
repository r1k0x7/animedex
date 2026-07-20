import Link from "next/link";
import { Flame, Sparkles, TrendingUp } from "lucide-react";

import {
  getPopularDonghua,
  getRecentDonghua,
  getTrendingDonghua,
} from "@/lib/anilist";
import type { MediaSummary, PagedResult } from "@/types/anilist";
import { BannerCarousel } from "@/components/banner-carousel";
import { DonghuaRow } from "@/components/donghua-row";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";

// Regenerasi statis tiap 30 menit (ISR).
export const revalidate = 1800;

const EMPTY: PagedResult<MediaSummary> = {
  items: [],
  pageInfo: {
    total: 0,
    currentPage: 1,
    lastPage: 1,
    hasNextPage: false,
    perPage: 20,
  },
};

export default async function HomePage() {
  // Ambil ketiga koleksi secara paralel. Jika AniList gagal, tampilkan
  // section kosong alih-alih membuat seluruh halaman error.
  const [trending, popular, recent] = await Promise.all([
    getTrendingDonghua(1, 20).catch(() => EMPTY),
    getPopularDonghua(1, 20).catch(() => EMPTY),
    getRecentDonghua(1, 20).catch(() => EMPTY),
  ]);

  return (
    <div className="container space-y-12 py-6 md:py-8">
      {/* Hero + banner carousel */}
      <section className="relative space-y-6">
        <div className="hero-glow pointer-events-none absolute inset-x-0 -top-24 -z-10 h-72" />
        <div className="mx-auto max-w-2xl animate-fade-in-up space-y-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Data realtime dari AniList
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            Jelajahi Dunia{" "}
            <span className="text-gradient">Donghua</span>
          </h1>
          <p className="text-muted-foreground md:text-lg">
            Ensiklopedia animasi Tiongkok berbahasa Indonesia. Temukan judul
            trending, populer, dan terbaru — data realtime dari AniList.
          </p>
          <div className="mx-auto max-w-md">
            <SearchBar placeholder="Cari donghua favoritmu…" />
          </div>
        </div>

        <BannerCarousel items={trending.items} />
      </section>

      {/* Trending */}
      <DonghuaRow
        title="🔥 Trending Sekarang"
        items={trending.items}
        href="/ranking"
        priority
      />

      {/* Populer */}
      <DonghuaRow
        title="⭐ Paling Populer"
        items={popular.items}
        href="/ranking"
      />

      {/* Terbaru */}
      <DonghuaRow title="🆕 Donghua Terbaru" items={recent.items} />

      {/* CTA ranking */}
      <section className="grid gap-4 sm:grid-cols-3">
        <FeatureCard
          href="/ranking?tab=popular"
          icon={<Flame className="h-6 w-6" />}
          title="Paling Populer"
          desc="Donghua dengan penggemar terbanyak."
        />
        <FeatureCard
          href="/ranking?tab=top-rated"
          icon={<TrendingUp className="h-6 w-6" />}
          title="Rating Tertinggi"
          desc="Judul dengan skor terbaik."
        />
        <FeatureCard
          href="/character"
          icon={<Sparkles className="h-6 w-6" />}
          title="Karakter Favorit"
          desc="Karakter paling dicintai penggemar."
        />
      </section>
    </div>
  );
}

function FeatureCard({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-2 rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/15">
        {icon}
      </div>
      <h3 className="text-lg font-semibold group-hover:text-primary">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
      <Button variant="link" className="h-auto justify-start p-0">
        Lihat selengkapnya →
      </Button>
    </Link>
  );
}
