# DonghuaWiki ID 🐉

Ensiklopedia **donghua** (animasi Tiongkok) berbahasa Indonesia. Dibangun dengan
**Next.js 15**, **TypeScript**, **Tailwind CSS**, dan **Shadcn UI**. Seluruh data
diambil **realtime** dari [AniList GraphQL API](https://anilist.co) —
**tanpa backend & tanpa database**, siap deploy ke **Vercel**.

## ✨ Fitur

- **Beranda** — banner carousel, donghua trending, populer, dan terbaru + search bar.
- **Halaman Donghua** — cover, banner, judul (romaji/english/native), sinopsis,
  genre, rating, status, episode, studio, dan daftar karakter.
- **Halaman Karakter** — foto, nama, deskripsi, dan daftar donghua/anime yang diikuti.
- **Search** — pencarian realtime dengan debounce langsung ke AniList API.
- **Ranking** — donghua rating tertinggi & paling populer.
- **UX** — loading skeleton, infinite scroll, responsive design, dark mode,
  dan metadata SEO otomatis (Open Graph, robots, sitemap).

## 🧱 Arsitektur

- **Server Components + Static Generation (ISR).** Beranda, detail donghua,
  karakter, dan ranking dirender di server dan di-cache dengan `revalidate`.
- **Realtime tanpa backend.** Fetch langsung ke `https://graphql.anilist.co`.
  Infinite scroll & search dijalankan di client, memanggil API yang sama.
- **Caching.** `fetch` server memakai ISR (`next.revalidate`); search memakai
  `no-store` agar selalu segar; gambar dioptimalkan lewat `next/image`.

```
src/
├─ app/                # Rute App Router (beranda, donghua, character, search, ranking)
├─ components/         # Komponen UI + Shadcn UI (components/ui)
├─ lib/
│  └─ anilist.ts       # Helper GraphQL + fungsi API reusable
├─ types/              # Definisi tipe respons AniList
└─ hooks/              # useDebounce, useInfiniteScroll
```

## 🔌 API (`src/lib/anilist.ts`)

Fungsi reusable yang tersedia:

- `getTrendingDonghua(page?, perPage?)`
- `getPopularDonghua(page?, perPage?)` / `getMostPopularDonghua(...)`
- `getRecentDonghua(page?, perPage?)`
- `getTopRatedDonghua(page?, perPage?)`
- `getDonghuaById(id)`
- `searchDonghua(query, page?, perPage?)`
- `getCharacters(page?, perPage?)`
- `getCharacterById(id)`

Semua query difilter `type: ANIME` & `countryOfOrigin: CN` agar hanya
menampilkan donghua.

## 🚀 Menjalankan secara lokal

```bash
npm install
npm run dev
# buka http://localhost:3000
```

Build produksi:

```bash
npm run build && npm start
```

## ☁️ Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Impor ke [Vercel](https://vercel.com/new) — framework terdeteksi otomatis
   sebagai **Next.js**, tanpa konfigurasi tambahan.
3. (Opsional) Set environment variable `NEXT_PUBLIC_SITE_URL` ke domain final
   agar metadata Open Graph & sitemap memakai URL yang benar.
4. Deploy. Selesai — tanpa backend & tanpa database.

## 📄 Lisensi

Proyek edukasi. Data & gambar milik AniList dan pemegang hak masing-masing.
