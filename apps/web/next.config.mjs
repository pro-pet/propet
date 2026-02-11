import { config } from 'dotenv';
import { resolve } from 'path';
import process from 'node:process'

// 从 monorepo 根目录加载环境变量
const env = process.env.NODE_ENV || 'development';
config({ path: resolve(process.cwd(), '../..', `.env.${env}`) });
config({ path: resolve(process.cwd(), '../..', '.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  transpilePackages: ["@propet/ui"],
}

export default nextConfig
