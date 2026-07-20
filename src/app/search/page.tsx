import { Suspense } from "react";
import type { Metadata } from "next";

import { SearchView } from "@/components/search-view";
import { DonghuaGridSkeleton } from "@/components/skeletons";

export const metadata: Metadata = {
  title: "Cari Donghua",
  description:
    "Cari donghua favoritmu secara realtime menggunakan AniList GraphQL API.",
};

export default function SearchPage() {
  return (
    <div className="container space-y-6 py-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Cari Donghua</h1>
        <p className="text-muted-foreground">
          Pencarian realtime dari database AniList.
        </p>
      </div>

      <Suspense fallback={<DonghuaGridSkeleton />}>
        <SearchView />
      </Suspense>
    </div>
  );
}
