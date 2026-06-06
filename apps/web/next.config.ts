import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  async redirects() {
    // Renamed slug — Google still has the old URL indexed (returns 404).
    // 301 it to the current page to recover the signal and clear the 404.
    return [
      {
        source: '/projects/ai-agents-for-non-technical-teams',
        destination: '/projects/decoupled-ownership-non-technical-teams',
        permanent: true,
      },
      {
        source: '/en/projects/ai-agents-for-non-technical-teams',
        destination: '/en/projects/decoupled-ownership-non-technical-teams',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    // Locale-prefixed static assets (browser may resolve manifest/icons under /en/…)
    const localeStatic = [
      'site.webmanifest',
      'favicon.ico',
      'favicon.svg',
      'favicon-96x96.png',
      'apple-touch-icon.png',
      'web-app-manifest-192x192.png',
      'web-app-manifest-512x512.png',
    ]
    return {
      beforeFiles: localeStatic.flatMap((file) => [
        { source: `/en/${file}`, destination: `/${file}` },
        { source: `/es/${file}`, destination: `/${file}` },
      ]),
    }
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source',
    })
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3100',
      },
      {
        protocol: 'https',
        hostname: 'pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
