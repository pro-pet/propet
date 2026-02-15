import { config } from "dotenv"
import { resolve } from "path"
import process from "node:process"

const env = process.env.NODE_ENV || "development"

config({ path: resolve(process.cwd(), "../..", `.env.${env}`) })
config({ path: resolve(process.cwd(), "../..", ".env") })

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  transpilePackages: ["@propet/ui"],
}

export default nextConfig
