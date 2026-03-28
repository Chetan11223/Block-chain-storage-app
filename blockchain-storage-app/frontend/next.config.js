const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': path.join(
        __dirname,
        'lib/stubs/async-storage-mock.js'
      ),
    };
    return config;
  },
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
