import type { Metadata, Viewport } from "next";
import "@fontsource-variable/plus-jakarta-sans";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const SITE_NAME = "DonghuaWiki ID";
const SITE_DESCRIPTION =
  "Ensiklopedia donghua (animasi Tiongkok) berbahasa Indonesia. Jelajahi donghua trending, populer, terbaru, karakter, dan ranking — data realtime dari AniList.";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://donghuawiki-id.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Ensiklopedia Donghua Indonesia`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "donghua",
    "anime china",
    "animasi tiongkok",
    "donghua sub indo",
    "AniList",
    "ensiklopedia donghua",
  ],
  authors: [{ name: "DonghuaWiki ID" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Ensiklopedia Donghua Indonesia`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Ensiklopedia Donghua Indonesia`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
