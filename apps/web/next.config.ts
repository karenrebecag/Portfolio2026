import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
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
