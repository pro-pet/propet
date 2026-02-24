import pluginNext from '@next/eslint-plugin-next'
import { createConfig } from './base.js'

export const nextJsConfig = createConfig(
  { nextjs: true },
  {
    plugins: { '@next/next': pluginNext },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
)
