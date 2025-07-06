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
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/random",
      },
      {
        protocol: "http", // s vì bạn dùng http ở localhost
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
