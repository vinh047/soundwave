/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["picsum.photos",],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "www.soundhelix.com", // để load ảnh nếu sau này audio có thumbnail riêng
      },
    ],
  },
};

export default nextConfig;
