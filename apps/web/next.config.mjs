import { resolve } from 'node:path'
import process from 'node:process'
import { config } from 'dotenv'

const env = process.env.NODE_ENV || 'development'

const workspaceRoot = resolve(import.meta.dirname, '../..')
for (const file of [`.env.${env}.local`, '.env.local', '.env', `.env.${env}`]) {
  config({ path: resolve(workspaceRoot, file), quiet: true })
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: workspaceRoot,
  experimental: {
    externalDir: true,
  },
  transpilePackages: ['@propet/ui'],
  images: {
    remotePatterns: [
      { hostname: 'loremflickr.com' },
      { hostname: 'i.pravatar.cc' },
    ],
  },
}

export default nextConfig
