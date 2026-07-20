"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log ke konsol; di produksi bisa dikirim ke layanan monitoring.
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <AlertTriangle className="h-16 w-16 text-destructive" />
      <h1 className="text-3xl font-bold">Terjadi Kesalahan</h1>
      <p className="max-w-md text-muted-foreground">
        {error.message ||
          "Gagal memuat data dari AniList. Silakan coba lagi sebentar."}
      </p>
      <Button onClick={reset}>Coba Lagi</Button>
    </div>
  );
  }
      
