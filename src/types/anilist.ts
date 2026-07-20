/**
 * Tipe data untuk respons AniList GraphQL API.
 * Referensi skema: https://anilist.gitbook.io/anilist-apiv2-docs/
 *
 * Semua field dibuat optional/nullable sesuai perilaku API AniList,
 * yang kerap mengembalikan `null` untuk data yang belum tersedia.
 */

export type MediaStatus =
  | "FINISHED"
  | "RELEASING"
  | "NOT_YET_RELEASED"
  | "CANCELLED"
  | "HIATUS";

export type MediaSeason = "WINTER" | "SPRING" | "SUMMER" | "FALL";

export interface MediaTitle {
  romaji: string | null;
  english: string | null;
  native: string | null;
}

export interface MediaCoverImage {
  extraLarge: string | null;
  large: string | null;
  medium: string | null;
  color: string | null;
}

export interface FuzzyDate {
  year: number | null;
  month: number | null;
  day: number | null;
}

export interface Studio {
  id: number;
  name: string;
  isAnimationStudio: boolean;
}

export interface StudioConnection {
  nodes: Studio[];
}

export interface CharacterName {
  full: string | null;
  native: string | null;
  userPreferred: string | null;
}

export interface CharacterImage {
  large: string | null;
  medium: string | null;
}

export interface CharacterEdge {
  role: "MAIN" | "SUPPORTING" | "BACKGROUND" | null;
  node: CharacterNode;
}

export interface CharacterNode {
  id: number;
  name: CharacterName;
  image: CharacterImage;
}

export interface CharacterConnection {
  edges: CharacterEdge[];
}

/** Bentuk ringkas media, dipakai di kartu/grid. */
export interface MediaSummary {
  id: number;
  title: MediaTitle;
  coverImage: MediaCoverImage;
  bannerImage: string | null;
  averageScore: number | null;
  popularity: number | null;
  genres: string[];
  episodes: number | null;
  status: MediaStatus | null;
  format: string | null;
  seasonYear: number | null;
}

/** Bentuk lengkap media untuk halaman detail donghua. */
export interface MediaDetail extends MediaSummary {
  description: string | null;
  duration: number | null;
  season: MediaSeason | null;
  startDate: FuzzyDate | null;
  endDate: FuzzyDate | null;
  countryOfOrigin: string | null;
  isAdult: boolean | null;
  studios: StudioConnection;
  characters: CharacterConnection;
  trailer: {
    id: string | null;
    site: string | null;
    thumbnail: string | null;
  } | null;
}

/** Media yang muncul dalam profil karakter. */
export interface CharacterMediaEdge {
  characterRole: "MAIN" | "SUPPORTING" | "BACKGROUND" | null;
  node: MediaSummary;
}

export interface CharacterMediaConnection {
  edges: CharacterMediaEdge[];
}

/** Bentuk lengkap karakter untuk halaman detail karakter. */
export interface CharacterDetail {
  id: number;
  name: CharacterName;
  image: CharacterImage;
  description: string | null;
  gender: string | null;
  age: string | null;
  favourites: number | null;
  media: CharacterMediaConnection;
}

export interface PageInfo {
  total: number | null;
  currentPage: number;
  lastPage: number | null;
  hasNextPage: boolean;
  perPage: number;
}

export interface PagedResult<T> {
  pageInfo: PageInfo;
  items: T[];
}
