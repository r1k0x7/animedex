import Link from "next/link";
import { Clapperboard } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <Clapperboard className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">
            DonghuaWiki ID
          </span>
        </div>
        <p className="text-center">
          Data disediakan oleh{" "}
          <a
            href="https://anilist.co"
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium text-primary hover:underline"
          >
            AniList
          </a>
          . Dibuat oleh{" "}
          <a
            href="https://github.com/r1k0x7"
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium text-primary hover:underline"
          >
            r1k0x7
          </a>
          .
        </p>
        <nav className="flex gap-4">
          <Link href="/ranking" className="hover:text-primary">
            Ranking
          </Link>
          <Link href="/character" className="hover:text-primary">
            Karakter
          </Link>
          <Link href="/search" className="hover:text-primary">
            Cari
          </Link>
        </nav>
      </div>
    </footer>
  );
}
