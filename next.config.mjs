/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s4.anilist.co",
      },
      {
        protocol: "https",
        hostname: "img.anili.st",
      },
    ],
    // Cache remote images for 24 hours on Vercel's image optimizer.
    minimumCacheTTL: 60 * 60 * 24,
  },
};

export default nextConfig;
