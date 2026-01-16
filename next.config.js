/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: process.env.NEXT_IMAGE_DOMAIN
      ? [
          {
            protocol: 'https',
            hostname: process.env.NEXT_IMAGE_DOMAIN,
            port: '33002',
            pathname: '/sites/default/files/**',
          },
        ]
      : [],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
