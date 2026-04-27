import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Allow WP uploads when a real hostname is configured
    remotePatterns: process.env.WP_IMAGE_HOSTNAME
      ? [
          {
            protocol: 'https',
            hostname: process.env.WP_IMAGE_HOSTNAME,
            pathname: '/wp-content/uploads/**',
          },
        ]
      : [],

    // Required so next/image doesn't reject SVG data URIs used in mock data
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },

  async redirects() {
    return [
      { source: '/bilar', destination: '/vehicles', permanent: true },
      { source: '/bilar/:slug', destination: '/vehicles/:slug', permanent: true },
      { source: '/nyheter', destination: '/blog', permanent: true },
    ]
  },
}

export default nextConfig
