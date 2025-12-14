/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["picsum.photos"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "www.soundhelix.com", // để load ảnh nếu sau này audio có thumbnail riêng
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Domain bị lỗi trong log
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com", // Thêm cái này để bao quát hết các subdomain của Google (lh4, lh5,...)
      },
      {
        protocol: "https",
        hostname: "picsum.photos", // Domain ảnh mẫu bạn đang dùng
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;
