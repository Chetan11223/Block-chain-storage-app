/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/contracts/:path*',
        destination: '/api/contracts/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
