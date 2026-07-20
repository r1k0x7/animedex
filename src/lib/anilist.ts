/**
 * lib/anilist.ts
 * ------------------------------------------------------------------
 * Helper GraphQL untuk mengambil data donghua dari AniList API.
 *
 * Donghua = animasi asal Tiongkok, sehingga semua query difilter dengan
 * `type: ANIME` dan `countryOfOrigin: CN`.
 *
 * Endpoint: https://graphql.anilist.co
 *
 * Fungsi di sini aman dipakai di Server Components (dengan cache ISR
 * lewat opsi `next.revalidate`) maupun di Client Components (untuk
 * infinite scroll & search realtime) karena hanya memakai `fetch`.
 */

import type {
  CharacterDetail,
  MediaDetail,
  MediaSummary,
  PageInfo,
  PagedResult,
} from "@/types/anilist";

export const ANILIST_ENDPOINT = "https://graphql.anilist.co";

/** Waktu revalidate default (detik) untuk data yang jarang berubah. */
export const DEFAULT_REVALIDATE = 60 * 60; // 1 jam

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string; status?: number }[];
}

interface FetchOptions {
  /** Detik untuk ISR di server. Abaikan di client (pakai cache browser). */
  revalidate?: number;
  /** Paksa no-store untuk data yang harus selalu segar (mis. search). */
  noStore?: boolean;
}

/**
 * Helper generik untuk mengeksekusi query/mutation GraphQL ke AniList.
 * Menangani rate limit (429) dan error GraphQL dengan pesan yang jelas.
 */
export async function fetchAniList<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: FetchOptions = {},
): Promise<T> {
  const { revalidate = DEFAULT_REVALIDATE, noStore = false } = options;

  const nextConfig = noStore
    ? { cache: "no-store" as const }
    : { next: { revalidate } };

  const res = await fetch(ANILIST_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
    ...nextConfig,
  });

  if (res.status === 429) {
    const retryAfter = res.headers.get("Retry-After") ?? "60";
    throw new Error(
      `AniList rate limit tercapai. Coba lagi dalam ${retryAfter} detik.`,
    );
  }

  if (!res.ok) {
    throw new Error(`AniList API error: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(
      `AniList GraphQL error: ${json.errors.map((e) => e.message).join(", ")}`,
    );
  }

  if (!json.data) {
    throw new Error("AniList API tidak mengembalikan data.");
  }

  return json.data;
}

/* ------------------------------------------------------------------ */
/* Fragment GraphQL yang dipakai ulang                                 */
/* ------------------------------------------------------------------ */

/** Field ringkas untuk kartu/grid. */
const MEDIA_SUMMARY_FIELDS = `
  id
  title {
    romaji
    english
    native
  }
  coverImage {
    extraLarge
    large
    medium
    color
  }
  bannerImage
  averageScore
  popularity
  genres
  episodes
  status
  format
  seasonYear
`;

/* ------------------------------------------------------------------ */
/* Query yang diminta di spesifikasi                                   */
/* ------------------------------------------------------------------ */

/**
 * Query dasar sesuai spesifikasi tugas. Diekspor agar mudah diinspeksi.
 */
export const TRENDING_QUERY = `
query ($page: Int) {
  Page(page: $page, perPage: 20) {
    media(type: ANIME, countryOfOrigin: CN, sort: POPULARITY_DESC) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        large
      }
      bannerImage
      averageScore
      popularity
      genres
      episodes
      status
    }
  }
}`;

/* ------------------------------------------------------------------ */
/* Query lengkap dengan pagination                                     */
/* ------------------------------------------------------------------ */

const PAGED_MEDIA_QUERY = (sort: string) => `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media(type: ANIME, countryOfOrigin: CN, sort: ${sort}) {
      ${MEDIA_SUMMARY_FIELDS}
    }
  }
}`;

interface PagedMediaData {
  Page: {
    pageInfo: PageInfo;
    media: MediaSummary[];
  };
}

async function fetchPagedMedia(
  sort: string,
  page: number,
  perPage: number,
  options?: FetchOptions,
): Promise<PagedResult<MediaSummary>> {
  const data = await fetchAniList<PagedMediaData>(
    PAGED_MEDIA_QUERY(sort),
    { page, perPage },
    options,
  );
  return {
    pageInfo: data.Page.pageInfo,
    items: data.Page.media ?? [],
  };
}

/* ------------------------------------------------------------------ */
/* API functions reusable                                              */
/* ------------------------------------------------------------------ */

/** Donghua yang sedang tren. */
export function getTrendingDonghua(
  page = 1,
  perPage = 20,
): Promise<PagedResult<MediaSummary>> {
  return fetchPagedMedia("TRENDING_DESC", page, perPage, {
    revalidate: 60 * 30, // 30 menit — tren berubah cukup cepat
  });
}

/** Donghua paling populer sepanjang masa. */
export function getPopularDonghua(
  page = 1,
  perPage = 20,
): Promise<PagedResult<MediaSummary>> {
  return fetchPagedMedia("POPULARITY_DESC", page, perPage);
}

/** Donghua terbaru berdasarkan tanggal rilis. */
export function getRecentDonghua(
  page = 1,
  perPage = 20,
): Promise<PagedResult<MediaSummary>> {
  return fetchPagedMedia("START_DATE_DESC", page, perPage, {
    revalidate: 60 * 30,
  });
}

/** Donghua dengan rating rata-rata tertinggi (untuk halaman ranking). */
export function getTopRatedDonghua(
  page = 1,
  perPage = 20,
): Promise<PagedResult<MediaSummary>> {
  return fetchPagedMedia("SCORE_DESC", page, perPage);
}

/** Alias populer untuk halaman ranking. */
export function getMostPopularDonghua(
  page = 1,
  perPage = 20,
): Promise<PagedResult<MediaSummary>> {
  return getPopularDonghua(page, perPage);
}

/* ------------------------------------------------------------------ */
/* Detail donghua                                                      */
/* ------------------------------------------------------------------ */

const MEDIA_DETAIL_QUERY = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    ${MEDIA_SUMMARY_FIELDS}
    description(asHtml: false)
    duration
    season
    startDate { year month day }
    endDate { year month day }
    countryOfOrigin
    isAdult
    studios(isMain: true) {
      nodes {
        id
        name
        isAnimationStudio
      }
    }
    trailer {
      id
      site
      thumbnail
    }
    characters(sort: [ROLE, RELEVANCE], perPage: 24) {
      edges {
        role
        node {
          id
          name {
            full
            native
            userPreferred
          }
          image {
            large
            medium
          }
        }
      }
    }
  }
}`;

interface MediaDetailData {
  Media: MediaDetail | null;
}

/** True jika error AniList menandakan entitas tidak ditemukan. */
function isNotFoundError(error: unknown): boolean {
  return (
    error instanceof Error && /not found|404/i.test(error.message)
  );
}

/**
 * Ambil detail lengkap satu donghua berdasarkan ID AniList.
 * Mengembalikan `null` jika donghua tidak ditemukan (memicu 404 rapi),
 * tetapi melempar error lain (mis. gangguan jaringan) agar tertangani
 * oleh error boundary.
 */
export async function getDonghuaById(id: number): Promise<MediaDetail | null> {
  try {
    const data = await fetchAniList<MediaDetailData>(
      MEDIA_DETAIL_QUERY,
      { id },
      { revalidate: DEFAULT_REVALIDATE },
    );
    return data.Media;
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
}

/* ------------------------------------------------------------------ */
/* Search realtime                                                     */
/* ------------------------------------------------------------------ */

const SEARCH_QUERY = `
query ($search: String, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media(
      type: ANIME
      countryOfOrigin: CN
      search: $search
      sort: SEARCH_MATCH
    ) {
      ${MEDIA_SUMMARY_FIELDS}
    }
  }
}`;

interface SearchData {
  Page: {
    pageInfo: PageInfo;
    media: MediaSummary[];
  };
}

/**
 * Pencarian donghua realtime. Memakai `no-store` supaya hasil selalu
 * mengikuti input pengguna terbaru (tidak di-cache ISR).
 */
export async function searchDonghua(
  search: string,
  page = 1,
  perPage = 20,
): Promise<PagedResult<MediaSummary>> {
  const term = search.trim();
  if (!term) {
    return {
      pageInfo: {
        total: 0,
        currentPage: page,
        lastPage: page,
        hasNextPage: false,
        perPage,
      },
      items: [],
    };
  }

  const data = await fetchAniList<SearchData>(
    SEARCH_QUERY,
    { search: term, page, perPage },
    { noStore: true },
  );

  return {
    pageInfo: data.Page.pageInfo,
    items: data.Page.media ?? [],
  };
}

/* ------------------------------------------------------------------ */
/* Karakter                                                            */
/* ------------------------------------------------------------------ */

const CHARACTERS_QUERY = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    characters(sort: FAVOURITES_DESC) {
      id
      name {
        full
        native
        userPreferred
      }
      image {
        large
        medium
      }
      media(sort: POPULARITY_DESC, perPage: 1) {
        nodes {
          countryOfOrigin
        }
      }
    }
  }
}`;

export interface CharacterListItem {
  id: number;
  name: {
    full: string | null;
    native: string | null;
    userPreferred: string | null;
  };
  image: {
    large: string | null;
    medium: string | null;
  };
}

interface CharactersData {
  Page: {
    pageInfo: PageInfo;
    characters: CharacterListItem[];
  };
}

/**
 * Daftar karakter paling difavoritkan. Catatan: AniList tidak memfilter
 * karakter berdasarkan negara asal media, jadi ini daftar umum.
 */
export async function getCharacters(
  page = 1,
  perPage = 24,
): Promise<PagedResult<CharacterListItem>> {
  const data = await fetchAniList<CharactersData>(
    CHARACTERS_QUERY,
    { page, perPage },
    { revalidate: DEFAULT_REVALIDATE },
  );
  return {
    pageInfo: data.Page.pageInfo,
    items: data.Page.characters ?? [],
  };
}

/* ------------------------------------------------------------------ */
/* Detail karakter                                                     */
/* ------------------------------------------------------------------ */

const CHARACTER_DETAIL_QUERY = `
query ($id: Int) {
  Character(id: $id) {
    id
    name {
      full
      native
      userPreferred
    }
    image {
      large
      medium
    }
    description(asHtml: false)
    gender
    age
    favourites
    media(sort: POPULARITY_DESC, perPage: 25) {
      edges {
        characterRole
        node {
          ${MEDIA_SUMMARY_FIELDS}
        }
      }
    }
  }
}`;

interface CharacterDetailData {
  Character: CharacterDetail | null;
}

/** Ambil detail lengkap satu karakter berdasarkan ID AniList. */
export async function getCharacterById(
  id: number,
): Promise<CharacterDetail | null> {
  try {
    const data = await fetchAniList<CharacterDetailData>(
      CHARACTER_DETAIL_QUERY,
      { id },
      { revalidate: DEFAULT_REVALIDATE },
    );
    return data.Character;
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
}
