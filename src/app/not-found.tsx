import Link from "next/link";
import { Ghost } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <Ghost className="h-16 w-16 text-muted-foreground" />
      <h1 className="text-3xl font-bold">Halaman Tidak Ditemukan</h1>
      <p className="max-w-md text-muted-foreground">
        Donghua atau halaman yang kamu cari tidak ada. Mungkin sudah dihapus
        atau tautannya salah.
      </p>
      <Button asChild>
        <Link href="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  );
}
