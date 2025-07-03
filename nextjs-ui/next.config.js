/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        port: "",
        pathname: "/random",
      },
      {
        protocol: "http", // vì bạn dùng http ở localhost
        hostname: "localhost",
        port: "8000",
        pathname: "/images/**", // cho phép truy cập thư mục /images
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
